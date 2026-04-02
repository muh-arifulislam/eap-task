"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Page() {
  const router = useRouter();
  const [count, setCount] = useState(3);

  const handleRedirect = () => {
    router.push("/dashboard"); // manual redirect
  };

  // Countdown and redirect
  useEffect(() => {
    if (count === 0) {
      router.push("/dashboard");
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8 text-center">
        Oops! The page you are looking for does not exist.
        <br />
        Redirecting to dashboard in {count} second{count !== 1 ? "s" : ""}...
      </p>
      <Button onClick={handleRedirect} className="px-6 py-3">
        Go to Dashboard Now
      </Button>
    </main>
  );
}
