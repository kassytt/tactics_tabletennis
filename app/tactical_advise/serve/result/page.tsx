"use client";

import { useState, useEffect } from "react";

export default function ServeResultPage() {
  const [tacticAdvice, setTacticAdvice] = useState<string | null>(null);
  const [practiceAdvice, setPracticeAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // sessionStorageから情報を取得
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

      {/* 練習アドバイスボタン */}
      {!practiceAdvice && (
        <button
          onClick={handlePracticeAdvice}
          disabled={loading}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition disabled:opacity-50"
        >
          {loading ? "生成中..." : "この戦術を伸ばす練習方法を聞く"}
        </button>
      )}

      {/* 練習アドバイス結果 */}
      {practiceAdvice && (
        <div className="bg-white p-6 rounded-xl shadow w-full max-w-2xl mt-6 border">
          <h2 className="font-semibold text-lg mb-2 text-emerald-700">
            🏓 練習アドバイス
          </h2>
          <p className="whitespace-pre-wrap text-gray-800">
            {practiceAdvice}
          </p>
        </div>
      )}
    </main>
  );
}
