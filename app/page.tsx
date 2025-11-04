"use client";

import { useState } from "react";
import RacketSelect from "./components/RacketSelect";
import RubberSelect from "./components/RubberSelect";
import StyleSelect from "./components/StyleSelect";

export default function HomePage() {
  const [racket, setRacket] = useState("");
  const [rubbers, setRubbers] = useState<string[]>([]);
  const [style, setStyle] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResponse(
      `ラケット: ${racket}, ラバー: ${rubbers.join("・")}, 戦型: ${style}`
    );
  };

  // ✅ 戦型を表示する条件
  const shouldShowStyleSelect =
    racket &&
    ((racket === "シェイク" && rubbers.length === 2) || // シェイクは2枚必須
      (racket !== "シェイク" && rubbers.length >= 1)); // ペンは1枚以上でOK

  // ✅ 送信ボタン表示条件
  const canSubmit = shouldShowStyleSelect && style;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-6">卓球 戦型診断</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 w-full max-w-md bg-white p-6 rounded shadow"
      >
        {/* ステップ1：ラケット選択 */}
        <RacketSelect
          value={racket}
          onChange={(v) => {
            setRacket(v);
            setRubbers([]);
            setStyle("");
          }}
        />

        {/* ステップ2：ラバー選択（ラケット選択後に表示） */}
        {racket && <RubberSelect values={rubbers} onChange={setRubbers} />}

        {/* ステップ3：戦型選択 */}
        {shouldShowStyleSelect && (
          <StyleSelect value={style} onChange={setStyle} />
        )}

        {/* ステップ4：送信ボタン */}
        {canSubmit && (
          <button
            type="submit"
            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition"
          >
            戦術を診断する
          </button>
        )}
      </form>

      {response && (
        <div className="mt-6 p-4 bg-white shadow rounded w-full max-w-md">
          <h2 className="font-semibold mb-2">入力結果：</h2>
          <p>{response}</p>
        </div>
      )}
    </main>
  );
}
