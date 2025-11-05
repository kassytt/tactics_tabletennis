import React from "react";

interface Props {
  values: { forehand: string; backhand: string };
  onChange: (values: { forehand: string; backhand: string }) => void;
  racket: string;
}

const RubberSelect: React.FC<Props> = ({ values, onChange, racket }) => {
  // 「なし」を含める
  const rubberTypes = ["裏ソフト", "表ソフト", "粒高", "なし"];

  const handleChange = (side: "forehand" | "backhand", value: string) => {
    onChange({ ...values, [side]: value });
  };

  return (
    <div>
      <h2 className="font-semibold mb-2">ラバーは何を使いたいですか？</h2>

      {/* フォア面 */}
      <div className="mb-4">
        <p className="font-medium mb-1">フォア面</p>
        <div className="flex flex-wrap gap-2">
          {rubberTypes.map((type) => (
            <label key={`fore-${type}`} className="flex items-center gap-1">
              <input
                type="radio"
                name="forehand"
                value={type}
                checked={values.forehand === type}
                onChange={() => handleChange("forehand", type)}
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* バック面 */}
      <div>
        <p className="font-medium mb-1">バック面</p>
        <div className="flex flex-wrap gap-2">
          {rubberTypes.map((type) => (
            <label key={`back-${type}`} className="flex items-center gap-1">
              <input
                type="radio"
                name="backhand"
                value={type}
                checked={values.backhand === type}
                onChange={() => handleChange("backhand", type)}
              />
              {type}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RubberSelect;
