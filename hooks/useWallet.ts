// hooks/useWallet.ts
import { useState, useEffect, useCallback } from "react";

export function useWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const connectWallet = useCallback(async () => {
    if (typeof window === "undefined") {
      console.error("Window object is not available");
      return;
    }
    if (!(window as any).solana || !(window as any).solana.isPhantom) {
      window.open("https://phantom.app/", "_blank");
      return;
    }
    try {
      const provider = (window as any).solana;
      const response = await provider.connect();
      const publicKey = response.publicKey.toString();
      setWalletAddress(publicKey);
      setIsWalletConnected(true);
      localStorage.setItem("walletAddress", publicKey);
    } catch (error) {
      console.error("Error connecting to Phantom wallet:", error);
    }
  }, []);

  useEffect(() => {
    // On mount, check localStorage for an existing wallet address.
    const savedWallet = localStorage.getItem("walletAddress");
    if (savedWallet) {
      setWalletAddress(savedWallet);
      setIsWalletConnected(true);
    } else if (
      typeof window !== "undefined" &&
      (window as any).solana &&
      (window as any).solana.isPhantom
    ) {
      const provider = (window as any).solana;
      provider
        .connect({ onlyIfTrusted: true })
        .then((response: any) => {
          const publicKey = response.publicKey.toString();
          setWalletAddress(publicKey);
          setIsWalletConnected(true);
          localStorage.setItem("walletAddress", publicKey);
        })
        .catch(() =>
          console.log("User has not previously connected Phantom wallet")
        );
    }
  }, []);

  return { walletAddress, isWalletConnected, connectWallet, setWalletAddress };
}
