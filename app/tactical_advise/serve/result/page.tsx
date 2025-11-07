"use client";

import { useState, useEffect } from "react";

export default function ServeResultPage() {
  const [tacticAdvice, setTacticAdvice] = useState<string | null>(null);
  const [practiceAdvice, setPracticeAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  

  // ✅ チャット用ステート
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  useEffect(() => {
    const advice = sessionStorage.getItem("tacticalAdvice");
    if (advice) {
      setTacticAdvice(advice);
    }
  }, []);

  const handlePracticeAdvice = async () => {
    setLoading(true);
    try {
      const style = sessionStorage.getItem("selectedStyle");
      const spin = sessionStorage.getItem("selectedServeSpin");
      const serveType = sessionStorage.getItem("selectedServeType");

      const res = await fetch("/api/tactical_advise/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style,
          spin,
          serveType,
          tactic: tacticAdvice,
        }),
      });

      const data = await res.json();
      setPracticeAdvice(data.practiceAdvice);
    } catch (e) {
      alert("練習アドバイスの取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const newHistory = [
      ...chatHistory,
      { role: "user" as const, content: chatInput },
    ];
    setChatHistory(newHistory);
    setChatInput(""); // ✅ 入力欄クリア

    const res = await fetch("/api/tactical_advise/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ history: newHistory }),
    });

    const data = await res.json();
    if (data.reply) {
      setChatHistory([
        ...newHistory,
        { role: "assistant", content: data.reply },
      ]);
    }
  };

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        サーブからの戦術アドバイス結果
      </h1>

      {tacticAdvice ? (
        <div className="bg-white p-6 rounded-xl shadow w-full max-w-2xl mb-6 border">
          <h2 className="font-semibold text-lg mb-2 text-indigo-700">
            🧠 戦術アドバイス
          </h2>
          <p className="whitespace-pre-wrap text-gray-800">{tacticAdvice}</p>
        </div>
      ) : (
        <p>戦術アドバイスが見つかりません。</p>
      )}

      {!practiceAdvice && (
        <button
          onClick={handlePracticeAdvice}
          disabled={loading}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {loading ? "生成中..." : "この戦術を伸ばす練習方法を聞く"}
        </button>
      )}

      {practiceAdvice && (
        <div className="bg-white p-6 rounded-xl shadow w-full max-w-2xl mt-6 border">
          <h2 className="font-semibold text-lg mb-2 text-emerald-700">
            🏓 練習アドバイス
          </h2>
          <p className="whitespace-pre-wrap text-gray-800">{practiceAdvice}</p>
        </div>
      )}

      {/* --- チャットエリア --- */}
      {practiceAdvice && (
        <div className="w-full max-w-2xl mt-10 bg-white rounded-xl shadow border p-6">
          <h2 className="font-semibold text-lg mb-4 text-gray-800">
            💬 AIコーチとチャット
          </h2>

          <div className="h-64 overflow-y-auto border rounded-lg p-3 bg-gray-50 mb-4">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-3 ${
                  msg.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-emerald-100 text-gray-800"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.content}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="質問を入力..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={async (e) => {
                // 日本語入力変換中なら送信しない
                if (e.nativeEvent.isComposing) return;

                if (e.key === "Enter" && chatInput.trim()) {
                  e.preventDefault();
                  await handleSendMessage();
                }
              }}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              送信
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
