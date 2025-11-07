"use client";

import { useState, useEffect } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function ServeResultPage() {
  const [loading, setLoading] = useState(true);
  const [advice, setAdvice] = useState<string | null>(null);

  const [practiceAdvice, setPracticeAdvice] = useState<string | null>(null);
  const [showPractice, setShowPractice] = useState(false);
  const [loadingPractice, setLoadingPractice] = useState(false);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");

  // 戦術アドバイス折りたたみ
  const [showTactic, setShowTactic] = useState(true);

  // --- 戦術アドバイス取得 ---
  useEffect(() => {
    const fetchAdvice = async () => {
      const style = sessionStorage.getItem("selectedStyle");
      const spin = sessionStorage.getItem("selectedServeSpin");
      const serveType = sessionStorage.getItem("selectedServeType");

      if (!style || !spin || !serveType) {
        setAdvice(
          "戦術アドバイスを取得できませんでした。前のページで入力してください。"
        );
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/tactical_advise", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ style, spin, serveType }),
        });

        if (!res.ok) throw new Error(`APIエラー: ${res.status}`);
        const data = await res.json();

        if (data.advice) {
          setAdvice(data.advice);
        } else {
          setAdvice("戦術アドバイスが見つかりません。");
        }
      } catch (error) {
        console.error(error);
        setAdvice("戦術アドバイス取得中にエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchAdvice();
  }, []);

  // --- 練習アドバイス取得 ---
  const handleFetchPractice = async () => {
    setShowPractice(true);
    setLoadingPractice(true);

    if (practiceAdvice) {
      setLoadingPractice(false);
      return; // 既に取得済みなら fetch しない
    }

    const style = sessionStorage.getItem("selectedStyle");
    const spin = sessionStorage.getItem("selectedServeSpin");
    const serveType = sessionStorage.getItem("selectedServeType");

    try {
      const res = await fetch("/api/tactical_advise/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ style, spin, serveType, tacticalAdvice: advice }),
      });

      const data = await res.json();
      if (data.practiceAdvice) setPracticeAdvice(data.practiceAdvice);
      else setPracticeAdvice("練習アドバイスが見つかりません。");
    } catch (error) {
      console.error(error);
      setPracticeAdvice("練習アドバイス取得中にエラーが発生しました。");
    } finally {
      setLoadingPractice(false);
    }
  };

  // --- チャット送信 ---
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const newHistory: ChatMessage[] = [
      ...chatHistory,
      { role: "user", content: chatInput },
    ];
    setChatHistory(newHistory);
    setChatInput("");

    try {
      const res = await fetch("/api/tactical_advise/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: newHistory }),
      });

      const data = await res.json();
      if (data.reply) {
        setChatHistory([...newHistory, { role: "assistant", content: data.reply }]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        サーブからの戦術アドバイス
      </h1>

      {loading ? (
        <p className="text-gray-600">読み込み中...</p>
      ) : (
        <>
          {/* --- 戦術アドバイス 折りたたみ --- */}
          {advice && (
            <div className="w-full max-w-2xl mb-4 border rounded-xl shadow bg-white">
              <button
                className="w-full px-6 py-3 text-left font-semibold text-lg text-indigo-700 flex justify-between items-center focus:outline-none"
                onClick={() => setShowTactic(!showTactic)}
              >
                🎯 戦術アドバイス
                <span>{showTactic ? "▲" : "▼"}</span>
              </button>
              {showTactic && (
                <div className="p-6 text-gray-800 whitespace-pre-wrap">
                  {advice}
                </div>
              )}
            </div>
          )}

          {/* --- 練習アドバイス ボタン --- */}
          {advice && !showPractice && (
            <button
              className="w-full max-w-2xl mb-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
              onClick={handleFetchPractice}
            >
              🏓 練習方法を見る
            </button>
          )}

          {/* --- 練習アドバイス 折りたたみ --- */}
          {showPractice && (
            <div className="w-full max-w-2xl mb-4 border rounded-xl shadow bg-white">
              <div className="px-6 py-3 text-left font-semibold text-lg text-emerald-700 flex justify-between items-center">
                🏓 練習アドバイス
              </div>
              <div className="p-6 text-gray-800 whitespace-pre-wrap">
                {loadingPractice ? "読み込み中..." : practiceAdvice || "練習アドバイスがありません。"}
              </div>
            </div>
          )}

          {/* --- チャットエリア --- */}
          {practiceAdvice && (
            <div className="w-full max-w-2xl mt-6 bg-white rounded-xl shadow border p-6">
              <h2 className="font-semibold text-lg mb-4 text-gray-800">
                💬 AIコーチとチャット
              </h2>

              <div className="h-64 overflow-y-auto border rounded-lg p-4 bg-gray-50 mb-4 space-y-3">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                        msg.role === "user"
                          ? "bg-emerald-100 text-gray-800 rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
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
        </>
      )}
    </main>
  );
}
