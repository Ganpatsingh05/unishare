"use client";

import Link from "next/link";
import Image from "next/image";
import { useUI } from '@contexts/UniShareContext';


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
            {/* Same treatment as the header: on light pages "Uni" gets a navy edge so it reads. */}
            <span className="font-extrabold text-xl tracking-[-0.02em]">
              <span style={darkMode ? { color: '#FFD24C' } : { color: '#FFD24C', WebkitTextStroke: '0.07em #12233A', paintOrder: 'stroke fill' }}>Uni</span>
              <span style={{ color: darkMode ? '#3CC3F2' : '#1565D8' }}>Share</span>
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
