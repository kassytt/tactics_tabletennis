"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link"; // ✅ 追加

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6">卓球アドバイスAI</h1>

      <div className="flex flex-col gap-4">
        <Link
          href="/style_finder"
          className="px-6 py-3 bg-sky-400 text-white rounded-lg shadow hover:bg-sky-500 transition"
        >
          戦型診断（どの戦型か迷っている方向け）
        </Link>

        <Link
          href="/tactical_advise"
          className="px-6 py-3 bg-emerald-400 text-white rounded-lg shadow hover:bg-emerald-500 transition"
        >
          戦術アドバイス（試合の戦術を考えたい方向け）
        </Link>
      </div>
    </main>
  );
}
