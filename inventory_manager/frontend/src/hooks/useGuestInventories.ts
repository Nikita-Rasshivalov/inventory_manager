import { useEffect, useState } from "react";
import { Inventory, TopInventory } from "../models/models";
import { GuestService } from "../services/guestService";

export function useGuestInventories(limit: number = 10) {
  const [latest, setLatest] = useState<Inventory[]>([]);
  const [top, setTop] = useState<TopInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const [latestData, topData] = await Promise.all([
          GuestService.getLatest(limit),
          GuestService.getTop(),
        ]);
        if (mounted) {
          setLatest(latestData);
          setTop(topData);
        }
      } catch (err: any) {
        if (mounted) setError(err.message ?? "Failed to load inventories");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [limit]);

  return { latest, top, loading, error };
}
