import "server-only";

// A small in-memory limit for public forms that send email, so one visitor cannot flood the
// Secretariat's inbox or use the site to mail strangers. It is per server process: enough for a
// single instance, and a restart forgets it.

/** Where the visitor connects from: the first address the proxy in front of us saw. */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

export class RateLimiter {
  private readonly hits = new Map<string, number[]>();

  /** At most `limit` attempts per key within `windowMs`. */
  constructor(
    private readonly limit: number,
    private readonly windowMs: number
  ) {}

  /** Records an attempt for the key; false when it is over the limit (and the attempt is not counted). */
  attempt(key: string): boolean {
    const now = Date.now();
    const recent = (this.hits.get(key) ?? []).filter((time) => now - time < this.windowMs);
    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    if (this.hits.size > 10_000) this.prune(now);
    return true;
  }

  /** Drops keys with no attempts left in the window, so the map cannot grow without end. */
  private prune(now: number) {
    for (const [key, times] of this.hits) {
      if (times.every((time) => now - time >= this.windowMs)) this.hits.delete(key);
    }
  }
}
