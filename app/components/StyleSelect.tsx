"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const styles = ["両ハンドドライブ型", "カットマン", "異質攻撃型", "前陣速攻型", "ペン攻撃型"];

export default function StyleSelect({ value, onChange }: Props) {
  return (
    <div>
      <h2 className="font-semibold mb-2">戦型スタイルを選択</h2>
      <div className="flex flex-col gap-2">
        {styles.map((s) => (
          <label key={s} className="flex items-center gap-2">
            <input
              type="radio"
              name="style"
              value={s}
              checked={value === s}
              onChange={() => onChange(s)}
              className="cursor-pointer"
            />
            {s}
          </label>
        ))}
      </div>
    </div>
  );
}
