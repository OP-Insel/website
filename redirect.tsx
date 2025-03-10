"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function Redirect({ to }: { to: string }) {
  const router = useRouter();

  useEffect(() => {
    router.push(to);
  }, [router, to]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        <p>Redirecting...</p>
      </div>
    </div>
  );
}
