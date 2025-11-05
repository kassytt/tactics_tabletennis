"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import RacketSelect from "./components/RacketSelect";
import StyleSelect from "./components/StyleSelect";

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();

  const [style, setStyle] = useState("");
  const [loading, setLoading] = useState(false);

  // ページが表示されたときに古い結果を削除してフォームを初期化
  useEffect(() => {
    sessionStorage.removeItem("tacticsResult");
    setStyle("");
  }, [pathname]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/tactics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style,
        }),
      });

      const data = await res.json();

      // SessionStorageに保存
      sessionStorage.setItem("style", style);
      sessionStorage.setItem("tacticsResult", data.message);

      // 結果ページへ遷移
      router.push("/result");
    } catch (err) {
      console.error(err);
      alert("診断中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6">卓球 戦型診断AI</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-md bg-white p-6 rounded shadow"
      >
        <StyleSelect value={style} onChange={setStyle} />

        {style && (
          <button
            type="submit"
            className={`bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition flex items-center justify-center`}
            disabled={loading}
          >
            {loading && (
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mr-2"></span>
            )}
            {loading ? "診断中..." : "戦術を診断する"}
          </button>
        )}
      </form>
    </main>
  );
}
