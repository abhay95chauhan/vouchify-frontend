import { useState, useEffect, useMemo } from 'react';

type QueryParams = {
  page: number;
  limit: number;
  search: string;
};

export function useQuery(
  initial: QueryParams = { page: 1, limit: 10, search: '' }
) {
  const [query, setQuery] = useState(initial);

  // reset page when search changes
  useEffect(() => {
    if (query.search) {
      setQuery((prev) => ({ ...prev, page: 1 }));
    }
  }, [query.search]);

  // 🔹 Generate query string
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        params.append(key, String(value));
      }
    });
    return params.toString(); // 👉 "page=1&limit=10&search=abc"
  }, [query]);

  return { query, setQuery, queryString };
}
