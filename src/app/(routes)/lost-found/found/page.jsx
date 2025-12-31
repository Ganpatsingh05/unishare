"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FoundPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main lost-found page
    router.replace("/lost-found");
  }, [router]);

  return null;
}
