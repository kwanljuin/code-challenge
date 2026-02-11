import { useState, useEffect, useMemo } from 'react';

export interface PriceData {
  currency: string;
  date: string;
  price: number;
}

export function usePrices() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const apiUrl = import.meta.env.VITE_SWITCHEO_API_URL;
        if (!apiUrl) throw new Error("VITE_SWITCHEO_API_URL is not defined in environment variables");
        const response = await fetch(`${apiUrl}/prices.json`);
        if (!response.ok) {
          throw new Error('Failed to fetch prices');
        }
        const data: PriceData[] = await response.json();
        
        // Deduplicate: use the latest price for each currency
        const priceMap: Record<string, number> = {};
        
        // Sort by date to ensure later prices overwrite earlier ones
        const sortedData = [...data].sort((a, b) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        sortedData.forEach((item) => {
          if (item.price !== undefined && item.price !== null) {
            priceMap[item.currency] = item.price;
          }
        });

        setPrices(priceMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchPrices();
  }, []);

  const tokenList = useMemo(() => Object.keys(prices).sort(), [prices]);

  return { prices, tokenList, loading, error };
}
