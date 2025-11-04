"use client";

type Props = {
  values: string[];
  onChange: (values: string[]) => void;
};

const rubbers = ["裏ソフト", "表ソフト", "粒高", "アンチ"];

export default function RubberSelect({ values, onChange }: Props) {
  const handleToggle = (rubber: string) => {
    const limit = 2; // 上限は常に2枚

    if (values.includes(rubber)) {
      onChange(values.filter((r) => r !== rubber));
    } else if (values.length < limit) {
      onChange([...values, rubber]);
    }
  };

  return (
    <div>
      <h2 className="font-semibold mb-2">② 使用ラバーを選択（最大2枚）</h2>
      <div className="flex flex-col gap-2">
        {rubbers.map((r) => (
          <label key={r} className="flex items-center gap-2">
            <input
              type="checkbox"
              value={r}
              checked={values.includes(r)}
              onChange={() => handleToggle(r)}
              disabled={!values.includes(r) && values.length >= 2} // 2枚以上選べない
              className="cursor-pointer"
            />
            {r}
          </label>
        ))}
      </div>
    </div>
  );
}
