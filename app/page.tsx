"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import RacketSelect from "./components/RacketSelect";
import RubberSelect from "./components/RubberSelect";
import StyleSelect from "./components/StyleSelect";

export default function HomePage() {
  const router = useRouter();
  const [racket, setRacket] = useState("");
  const [rubbers, setRubbers] = useState({ forehand: "", backhand: "" });
  const [style, setStyle] = useState("");
  const [loading, setLoading] = useState(false); // ← 追加

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // ← 診断開始でローディングON

    try {
      const res = await fetch("/api/tactics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          racket,
          rubbers: [rubbers.forehand, rubbers.backhand].filter(Boolean),
          style,
        }),
      });

      const data = await res.json();

      // 結果ページへ
      router.push(`/result?response=${encodeURIComponent(data.message)}`);
    } catch (err) {
      console.error(err);
      alert("診断中にエラーが発生しました。");
    } finally {
      setLoading(false); // ← 診断完了でローディングOFF
    }
  };

  const canSubmit = racket && style && (rubbers.forehand || rubbers.backhand);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6">卓球 戦型診断AI</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-md bg-white p-6 rounded shadow"
      >
        <RacketSelect value={racket} onChange={setRacket} />
        {racket && (
          <RubberSelect racket={racket} values={rubbers} onChange={setRubbers} />
        )}
        {racket && (rubbers.forehand || rubbers.backhand) && (
          <StyleSelect value={style} onChange={setStyle} />
        )}

        {canSubmit && (
          <button
            type="submit"
            className={`bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition flex items-center justify-center`}
            disabled={loading} // ← ローディング中は押せない
          >
            {loading ? (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
            ) : null}
            {loading ? "診断中..." : "戦術を診断する"}
          </button>
        )}
      </form>
    </main>
  );
}
