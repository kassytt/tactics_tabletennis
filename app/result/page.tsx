"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ChatEntry = {
  role: "user" | "assistant";
  content: string;
};

export default function ResultPage() {
  const router = useRouter();
  const [response, setResponse] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [subLoading, setSubLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);

  // 初期ロード：SessionStorage から結果取得
  useEffect(() => {
    const saved = sessionStorage.getItem("tacticsResult");
    if (saved) {
      setResponse(saved);
      // 初期診断結果をチャット履歴の最初に追加
      setChatHistory([
        {
          role: "assistant",
          content: saved,
        },
      ]);
    } else {
      setResponse("診断結果が見つかりません。");
    }
    setLoading(false);
  }, []);

  // 質問送信処理
  const handleAsk = async () => {
    if (!question.trim()) return;
    if (!response) return;

    const userQuestion = question.trim();
    setQuestion("");
    setSubLoading(true);

    // ユーザーの質問を履歴に追加
    setChatHistory((prev) => [...prev, { role: "user", content: userQuestion }]);

    const prompt = `${response}\n\n追加の質問: ${userQuestion}`;

    try {
      const res = await fetch("/api/tactics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      const answer = data.text || "AIの応答を取得できませんでした。";

      // AIの応答を履歴に追加
      setChatHistory((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: "AIの応答を取得できませんでした。" },
      ]);
    } finally {
      setSubLoading(false);
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

        {/* チャット履歴 */}
        <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto border p-3 rounded bg-gray-50">
          {chatHistory.map((entry, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                entry.role === "user"
                  ? "bg-blue-100 text-right"
                  : "bg-white border text-left"
              }`}
            >
              <p className="whitespace-pre-wrap">{entry.content}</p>
            </div>
          ))}
          {subLoading && (
            <p className="text-gray-500 text-sm italic">AIが考え中です…</p>
          )}
        </div>

        {/* 質問フォーム */}
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="AIに質問してみよう（例：おすすめの練習法は？）"
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleAsk}
            disabled={subLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
          >
            送信
          </button>
        </div>

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
