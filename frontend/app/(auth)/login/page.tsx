"use client";

import LoginForm from "@/components/auth/LoginForm";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <LoginForm />
    </div>
  );
}
