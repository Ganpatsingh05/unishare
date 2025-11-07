'use client';

import dynamic from "next/dynamic";

// Dynamic import with ssr: false to prevent hydration issues
const DynamicIsland = dynamic(() => import('./DynamicIsland'), {
  ssr: false,
});

export default function DynamicIslandWrapper() {
  return <DynamicIsland />;
}
