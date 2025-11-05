import React from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const StyleSelect: React.FC<Props> = ({ value, onChange }) => {
  const styles = [
    "ドライブ主体で攻めたい",
    "前陣で速攻で決めたい",
    "ひたすら守ってミスを誘いたい"
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
