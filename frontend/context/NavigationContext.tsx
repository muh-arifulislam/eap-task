"use client";

import { createContext, useContext, useTransition, ReactNode } from "react";
import { useRouter } from "next/navigation";
import TopLoader from "@/components/TopLoader";

type NavigationContextType = {
  navigate: (href: string) => void;
  isPending: boolean;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <NavigationContext.Provider value={{ navigate, isPending }}>
      {children}
      {isPending && <TopLoader />}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error("useNavigation must be used inside provider");
  return ctx;
};
