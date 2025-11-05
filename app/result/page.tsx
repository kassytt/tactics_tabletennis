"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();
  const [response, setResponse] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("tacticsResult");
    if (saved) {
      setResponse(saved);
    } else {
      setResponse("診断結果が見つかりません。");
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-6 rounded shadow w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">AI戦術診断結果</h1>
        <p className="whitespace-pre-wrap">{response}</p>
        <button
          className="mt-6 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
          onClick={() => router.push("/")}
        >
          戻る
        </button>
      </div>
    </main>
  );
}
