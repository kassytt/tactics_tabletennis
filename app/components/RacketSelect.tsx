"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const rackets = ["シェイク", "中国式ペン", "日本式ペン"];

export default function RacketSelect({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="font-semibold mb-2">ラケットの種類を選択</h2>
      <div className="flex flex-col gap-2">
        {rackets.map((r) => (
          <label key={r} className="flex items-center gap-2">
            <input
              type="radio"
              name="racket"
              value={r}
              checked={value === r}
              onChange={() => onChange(r)}
              className="cursor-pointer"
            />
            {r}
          </label>
        ))}
      </div>
    </div>
  );
}
