"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RubberSelect from "../components/RubberSelect";
import RacketSelect from "../components/RacketSelect";

export default function ResultPage() {
  const router = useRouter();

  const [style, setStyle] = useState<string | null>(null);
  const [initialResponse, setInitialResponse] = useState<string | null>(null);
  const [racket, setRacket] = useState("");
  const [rubberValues, setRubberValues] = useState({
    forehand: "",
    backhand: "",
  });
  const [finalResponse, setFinalResponse] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- 初期ロード ---
  useEffect(() => {
    const savedStyle = sessionStorage.getItem("style");
    const savedResult = sessionStorage.getItem("tacticsResult");
    if (savedStyle) setStyle(savedStyle);
    if (savedResult) setInitialResponse(savedResult);
    else setInitialResponse("診断データが見つかりません。ホームに戻ってください。");
    setLoading(false);
  }, []);

  // --- ラケット・ラバーを考慮した再診断 ---
  const handleFinalDiagnosis = async () => {
    if (!style) return;
    if (!racket) return alert("ラケットを選択してください。");

    const rubbers = [rubberValues.forehand, rubberValues.backhand].filter(
      (r) => r && r !== "なし"
    );
    if (rubbers.length === 0) return alert("ラバーを選択してください。");

    setThinking(true);
    try {
      const res = await fetch("/api/tactics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ style, racket, rubbers }),
      });

      const data = await res.json();
      setFinalResponse(data.message ?? "再診断結果を取得できませんでした。");
    } catch {
      setFinalResponse("AI診断に失敗しました。");
    } finally {
      setThinking(false);
    }
  };

  if (loading)
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">診断結果を読み込み中...</p>
      </main>
    );

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-6 rounded shadow w-full max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold">AI 戦術診断結果</h1>

        {/* 初回診断結果 */}
        <div className="space-y-2">
          <p className="text-gray-600">戦型: {style ?? "不明"}</p>
          <p className="whitespace-pre-wrap text-gray-800">
            {initialResponse ?? "診断結果が見つかりません。"}
          </p>
        </div>

        {/* ラケット選択 */}
        <div className="border-t pt-4">
          <RacketSelect value={racket} onChange={setRacket} />
        </div>

        {/* ラバー選択 */}
        {racket && (
          <div className="border-t pt-4">
            <RubberSelect
              values={rubberValues}
              onChange={setRubberValues}
              racket={racket}
            />
          </div>
        )}

        {/* 再診断ボタン */}
        {racket && (
          <button
            onClick={handleFinalDiagnosis}
            disabled={thinking}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
          >
            {thinking ? "AIが再診断中..." : "ラケット・ラバーを考慮して再診断する"}
          </button>
        )}

        {/* 再診断結果 */}
        {finalResponse && (
          <div className="mt-6 border-t pt-4">
            <h2 className="font-semibold mb-2 text-lg">最終診断結果</h2>
            <p className="whitespace-pre-wrap">{finalResponse}</p>
          </div>
        )}

        {/* 戻るボタン */}
        <button
          className="mt-8 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
          onClick={() => {
            sessionStorage.clear();
            router.push("/");
          }}
        >
          ホームに戻る
        </button>
      </div>
    </main>
  );
}
