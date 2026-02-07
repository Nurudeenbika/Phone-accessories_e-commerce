"use client";

import { useState, useEffect, useCallback } from "react";

interface UseAdminDataOptions {
  refetchInterval?: number; // Auto-refetch interval in milliseconds
  enableBackgroundRefetch?: boolean;
}

interface UseAdminDataReturn<T> {
  data: T | null;
  isLoading: boolean;
  isRefetching: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  mutate: (newData: T) => void;
}

export function useAdminData<T>(
  fetchFn: () => Promise<T>,
  options: UseAdminDataOptions = {},
): UseAdminDataReturn<T> {
  const { refetchInterval = 30000, enableBackgroundRefetch = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (isBackground = false) => {
      try {
        if (isBackground) {
          setIsRefetching(true);
        } else {
          setIsLoading(true);
        }
        setError(null);

        const result = await fetchFn();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
        setIsRefetching(false);
      }
    },
    [fetchFn],
  );

  const refetch = useCallback(() => fetchData(true), [fetchData]);

  const mutate = useCallback((newData: T) => {
    setData(newData);
  }, []);

  // Initial load
  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  // Auto-refetch interval
  useEffect(() => {
    if (!enableBackgroundRefetch || !refetchInterval) return;

    const interval = setInterval(() => {
      if (data) {
        // Only refetch if we have data
        fetchData(true);
      }
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [fetchData, refetchInterval, enableBackgroundRefetch, data]);

  return {
    data,
    isLoading,
    isRefetching,
    error,
    refetch,
    mutate,
  };
}

