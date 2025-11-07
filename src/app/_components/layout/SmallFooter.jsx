"use client";

import Link from "next/link";
import Image from "next/image";
import { useUI } from "./../../lib/contexts/UniShareContext";


export default function SmallFooter() {
  const { darkMode } = useUI();

  return (
    <footer className="py-5 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2">
          <span className={`text-base font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Powered by
          </span>
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 relative">
              <Image
                src="/images/logos/logounishare1.png"
                alt="UniShare"
                width={28}
                height={28}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-lg">
              <span style={{ color: '#facc15' }}>Uni</span>
              <span style={{ color: '#38bdf8' }}>Share</span>
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
