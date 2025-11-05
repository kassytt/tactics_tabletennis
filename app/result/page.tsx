"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();
  const [response, setResponse] = useState<string | null>(null);
  const [followup, setFollowup] = useState<string>(""); // AIの追応答
  const [question, setQuestion] = useState<string>(""); // 入力中の質問
  const [loading, setLoading] = useState<boolean>(true);
  const [subLoading, setSubLoading] = useState<boolean>(false);

  // 初期ロード：SessionStorage から結果取得
  useEffect(() => {
    const saved = sessionStorage.getItem("tacticsResult");
    if (saved) {
      setResponse(saved);
    } else {
      setResponse("診断結果が見つかりません。");
    }
    setLoading(false);
  }, []);

  // 質問送信処理
  const handleAsk = async () => {
    if (!question.trim()) return;
    if (!response) return;

    setSubLoading(true);
    setFollowup("");

    const prompt = `${response}\n\n追加の質問: ${question}`;

    try {
      const res = await fetch("/api/tactics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setFollowup(data.text || "AIの応答を取得できませんでした。");
    } catch {
      setFollowup("AIの応答を取得できませんでした。");
    } finally {
      setSubLoading(false);
      setQuestion("");
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">診断結果を読み込み中...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-6 rounded shadow w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">AI戦術診断結果</h1>

        {/* 診断結果表示 */}
        <p className="whitespace-pre-wrap mb-6">{response}</p>

        {/* 質問フォーム */}
        <div className="mt-4">
          <label className="block text-sm font-semibold mb-2">
            AIに質問してみる
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="例: この戦型におすすめの練習は？"
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleAsk}
              disabled={subLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
            >
              質問する
            </button>
          </div>
        </div>

        {/* AI応答 */}
        {subLoading && <p className="mt-4 text-gray-500">AIが考え中です…</p>}

        {followup && (
          <div className="mt-6 p-4 border rounded bg-gray-50 whitespace-pre-wrap">
            {followup}
          </div>
        )}

        {/* 戻る */}
        <button
          className="mt-8 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
          onClick={() => router.push("/")}
        >
          戻る
        </button>
      </div>
    </main>
  );
}
