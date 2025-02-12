// hooks/useUserData.ts
import { useState, useEffect, useCallback } from "react";
import { getUserData } from "@/app/actions";

export function useUserData(walletAddress: string | null) {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false); // add loading state

  const fetchUserData = useCallback(async (address: string) => {
    setLoading(true);
    const result = await getUserData(address);
    if (result.success) {
      setUserData(result.user);
    } else {
      console.error("Failed to fetch user data:", result.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      fetchUserData(walletAddress);
    }
  }, [walletAddress, fetchUserData]);

  return { userData, fetchUserData, setUserData, loading }; // return loading
}
