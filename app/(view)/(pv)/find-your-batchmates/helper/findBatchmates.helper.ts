/** What a member typed into the search form. */
export interface BatchmateQuery {
  name: string;
  batch: string;
  city: string;
  profession: string;
}

export const EMPTY_QUERY: BatchmateQuery = { name: '', batch: '', city: '', profession: '' };

export const findBatchmatesHelper = {
  /** "Batch, City" → ["Batch", "City"]. */
  tags: (list: string): string[] =>
    list
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),

  hasQuery: (query: BatchmateQuery) => Object.values(query).some((value) => value.trim()),

  /** The search, written out for an email to the Secretariat. */
  queryLines: (query: BatchmateQuery): string =>
    [
      query.name.trim() && `Name: ${query.name.trim()}`,
      query.batch.trim() && `Batch year: ${query.batch.trim()}`,
      query.city.trim() && `City: ${query.city.trim()}`,
      query.profession.trim() && `Profession: ${query.profession.trim()}`,
    ]
      .filter(Boolean)
      .join('\n'),
};
