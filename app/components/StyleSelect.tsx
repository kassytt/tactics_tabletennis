import React from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const StyleSelect: React.FC<Props> = ({ value, onChange }) => {
  const styles = [
    "攻撃型（ドライブ主体）",
    "前陣速攻型",
    "カット型",
    "オールラウンド型",
    "悩み中",
  ];

  return (
    <div>
      <h2 className="font-semibold mb-2">戦型スタイル</h2>
      <div className="flex flex-col gap-2">
        {styles.map((style) => (
          <label key={style} className="flex items-center gap-2">
            <input
              type="radio"
              name="style"
              value={style}
              checked={value === style}
              onChange={() => onChange(style)}
            />
            {style}
          </label>
        ))}
      </div>
    </div>
  );
};

export default StyleSelect;
