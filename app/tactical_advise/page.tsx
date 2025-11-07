"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const styles = [
  { id: "attacker", label: "ドライブ攻撃型（前陣・中陣）" },
  { id: "chopper", label: "カットマン（守備型）" },
  { id: "blocker", label: "ブロック・安定型" },
  { id: "pips", label: "変化型（表・粒・異質ラバー）" },
];

export default function TacticalAdvisePage() {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const handleSelectStyle = (styleId: string) => {
    setSelectedStyle(styleId);
    sessionStorage.setItem("selectedStyle", styleId);
  };

  const handleNavigate = (path: string) => {
    if (!selectedStyle) {
      alert("先に戦型を選択してください！");
      return;
    }
    router.push(`/tactical_advise/${path}`);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        戦術アドバイス（Tactical Advice）
      </h1>

      {/* --- 戦型選択 --- */}
      <p className="text-gray-600 mb-4 text-center">
        まずは自分の戦型を選びましょう
      </p>

      <div className="bg-white rounded-xl shadow-sm p-6 w-full max-w-md border">
        <form className="flex flex-col gap-3">
          {styles.map((s) => (
            <label
              key={s.id}
              className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg transition
                ${
                  selectedStyle === s.label
                    ? "bg-indigo-50 border border-indigo-300"
                    : "hover:bg-gray-50 border border-transparent"
                }`}
            >
              <input
                type="radio"
                name="style"
                value={s.id}
                checked={selectedStyle === s.label}
                onChange={() => handleSelectStyle(s.label)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-gray-800">{s.label}</span>
            </label>
          ))}
        </form>
      </div>

      {/* --- サーブ／レシーブ選択（戦型選択後に表示） --- */}
      {selectedStyle && (
        <>
          <p className="text-gray-700 mt-8 mb-4">
            選択中の戦型：
            <span className="font-semibold text-indigo-700">{selectedStyle}</span>
          </p>

          <p className="text-gray-600 mb-4 text-center">
            戦術を立てたい場面を選びましょう
          </p>

          <div className="flex flex-col gap-4 w-full max-w-sm">
            <button
              onClick={() => handleNavigate("serve")}
              className="px-6 py-4 bg-indigo-500 text-white rounded-xl shadow hover:bg-indigo-600 transition"
            >
              サーブからの戦術を立てる
            </button>

            <button
              onClick={() => handleNavigate("receive")}
              className="px-6 py-4 bg-emerald-500 text-white rounded-xl shadow hover:bg-emerald-600 transition"
            >
              レシーブからの戦術を立てる
            </button>
          </div>
        </>
      )}
    </main>
  );
}
