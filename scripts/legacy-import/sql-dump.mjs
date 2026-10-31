// Reads tables straight out of a phpMyAdmin SQL export (.sql or .sql.gz), so the import needs no MySQL server.
// Understands what phpMyAdmin writes: `USE db;`, `CREATE TABLE`, and multi-row `INSERT INTO t (cols) VALUES (...), (...);`.

import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { createGunzip } from "node:zlib";

const ESCAPES = { 0: "\0", b: "\b", n: "\n", r: "\r", t: "\t", Z: "\x1a" };

/** Parses the `(...), (...)` part of an INSERT into arrays of values (strings, numbers or null). */
export function parseValues(text) {
  const rows = [];
  let i = 0;
  const n = text.length;
  while (i < n) {
    while (i < n && text[i] !== "(") i++;
    if (i >= n) break;
    i++;
    const row = [];
    for (;;) {
      while (text[i] === " " || text[i] === "\n" || text[i] === "\r" || text[i] === "\t") i++;
      if (text[i] === "'") {
        let out = "";
        i++;
        for (;;) {
          const c = text[i];
          if (c === "\\") {
            const next = text[i + 1];
            out += ESCAPES[next] ?? next;
            i += 2;
          } else if (c === "'") {
            if (text[i + 1] === "'") {
              out += "'";
              i += 2;
            } else {
              i++;
              break;
            }
          } else if (c === undefined) {
            throw new Error("Unterminated string in INSERT");
          } else {
            out += c;
            i++;
          }
        }
        row.push(out);
      } else {
        let j = i;
        while (j < n && text[j] !== "," && text[j] !== ")") j++;
        const raw = text.slice(i, j).trim();
        row.push(raw === "NULL" ? null : raw.startsWith("0x") ? raw : Number(raw));
        i = j;
      }
      while (text[i] === " ") i++;
      if (text[i] === ",") {
        i++;
        continue;
      }
      if (text[i] === ")") {
        i++;
        break;
      }
      throw new Error(`Unexpected character ${JSON.stringify(text[i])} in INSERT at ${i}`);
    }
    rows.push(row);
  }
  return rows;
}

/**
 * Loads the wanted tables from one database in the dump.
 * Returns { tableName: [{ column: value, ... }, ...] }; tables with no rows come back as [].
 */
export async function readTables(dumpPath, database, wanted) {
  const want = new Set(wanted);
  const tables = Object.fromEntries(wanted.map((name) => [name, []]));
  const input = createReadStream(dumpPath);
  const lines = createInterface({ input: dumpPath.endsWith(".gz") ? input.pipe(createGunzip()) : input, crlfDelay: Infinity });

  let currentDb = null;
  let statement = null; // { table, columns, text } while an INSERT spans several lines
  for await (const line of lines) {
    if (statement) {
      statement.text += "\n" + line;
      if (line.endsWith(";")) {
        addRows(tables[statement.table], statement.columns, statement.text);
        statement = null;
      }
      continue;
    }
    if (line.startsWith("USE `")) {
      currentDb = line.slice(5, line.indexOf("`", 5));
      continue;
    }
    if (currentDb !== database || !line.startsWith("INSERT INTO `")) continue;
    const table = line.slice(13, line.indexOf("`", 13));
    if (!want.has(table)) continue;
    const open = line.indexOf("(");
    const values = line.indexOf(" VALUES");
    const columns = line.slice(open + 1, line.lastIndexOf(")", values)).split(",").map((c) => c.trim().replace(/`/g, ""));
    const rest = line.slice(values + 7);
    if (rest.endsWith(";")) addRows(tables[table], columns, rest);
    else statement = { table, columns, text: rest };
  }
  return tables;
}

function addRows(target, columns, text) {
  for (const values of parseValues(text.replace(/;\s*$/, ""))) {
    target.push(Object.fromEntries(columns.map((column, index) => [column, values[index]])));
  }
}
