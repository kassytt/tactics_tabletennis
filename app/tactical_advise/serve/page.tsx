"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const spins = [
  { id: "topspin", label: "上回転" },
  { id: "backspin", label: "下回転" },
  { id: "sidespin", label: "順横回転" },
  { id: "reverse-sidespin", label: "逆横回転" },
  { id: "side-top", label: "横上回転" },
  { id: "side-back", label: "横下回転" },
  { id: "reverse-side-top", label: "逆横上回転" },
  { id: "reverse-side-back", label: "逆横下回転" },
  { id: "no-spin", label: "ナックル" },
];

const serveTypes = [
  { id: "short-fore", label: "ショートサーブ（フォア）" },
  { id: "short-back", label: "ショートサーブ（バック）" },
  { id: "long-fore", label: "ロングサーブ（フォア）" },
  { id: "long-back", label: "ロングサーブ（バック）" },
];

export default function ServePage() {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedSpin, setSelectedSpin] = useState<string>("");
  const [selectedServeType, setSelectedServeType] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // ✅ 戦型を sessionStorage から取得
  useEffect(() => {
    const style = sessionStorage.getItem("selectedStyle");
    if (!style) {
      alert("戦型が選択されていません。");
      router.push("/tactical_advise");
      return;
    }
    setSelectedStyle(style);
  }, [router]);

  const handleNext = async () => {
    if (!selectedSpin) {
      alert("出したいサーブの回転を選択してください！");
      return;
    }
    if (!selectedServeType) {
      alert("サーブの長さとコースを選択してください！");
      return;
    }

    // ✅ ローディング開始
    setLoading(true);

    try {
      // ✅ OpenAI APIへ戦術アドバイスをリクエスト
      const res = await fetch("/api/tactical_advise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style: selectedStyle,
          spin: selectedSpin,
          serveType: selectedServeType,
        }),
      });

      const data = await res.json();
      console.log(data)

      if (!res.ok || !data.advice) {
        alert("戦術アドバイスの取得に失敗しました。");
        return;
      }

      // ✅ 選択内容と結果を sessionStorage に保存
      sessionStorage.setItem("selectedServeSpin", selectedSpin);
      sessionStorage.setItem("selectedServeType", selectedServeType);
      sessionStorage.setItem("tacticalAdvice", data.advice);

      // ✅ 結果ページへ遷移
      router.push("/tactical_advise/serve/result");
    } catch (error) {
      console.error("APIエラー:", error);
      alert("戦術アドバイスの取得中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        サーブからの戦術を立てる
      </h1>

      {selectedStyle && (
        <p className="text-gray-700 mb-6">
          戦型：
          <span className="font-semibold text-indigo-700">{selectedStyle}</span>
        </p>
      )}

      {/* --- サーブ回転選択 --- */}
      <div className="bg-white rounded-xl shadow-sm p-6 w-full max-w-md border mb-6">
        <label htmlFor="spin" className="text-gray-800 font-medium mb-2 block">
          サーブ回転の種類
        </label>
        <select
          id="spin"
          value={selectedSpin}
          onChange={(e) => setSelectedSpin(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
        >
          <option value="">選択してください</option>
          {spins.map((s) => (
            <option key={s.id} value={s.label}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* --- サーブの長さ・コース選択 --- */}
      <div className="bg-white rounded-xl shadow-sm p-6 w-full max-w-md border">
        <label
          htmlFor="serveType"
          className="text-gray-800 font-medium mb-2 block"
        >
          サーブの長さとコース
        </label>
        <select
          id="serveType"
          value={selectedServeType}
          onChange={(e) => setSelectedServeType(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
        >
          <option value="">選択してください</option>
          {serveTypes.map((type) => (
            <option key={type.id} value={type.label}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* --- 次へボタン --- */}
      <button
        onClick={handleNext}
        disabled={loading}
        className="mt-8 px-6 py-3 bg-emerald-600 text-white rounded-lg shadow hover:bg-emerald-700 transition disabled:opacity-50"
      >
        {loading ? "生成中..." : "戦術アドバイスを見る"}
      </button>
    </main>
  );
}
