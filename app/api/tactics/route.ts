import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { racket, rubbers, style, prompt } = body;

    // 🔸 「追加質問（promptのみ）」が来た場合
    if (prompt) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "あなたは卓球コーチです。ユーザーの質問に対して日本語で的確かつ200文字以内で答えてください。",
            },
            { role: "user", content: prompt },
          ],
          temperature: 0.8,
        }),
      });

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content ?? "AIの応答を取得できませんでした。";
      return NextResponse.json({ text });
    }

    // 🔸 通常の戦術診断（racket, rubbers, style が来た場合）
    const basePrompt =`あなたは卓球のコーチです。
以下の選手のラケット・ラバー構成と目指したい戦型スタイルを踏まえ、
最適な戦術を300文字程度で日本語でアドバイスしてください。

戦型: ${style}
ラケット: ${racket}
ラバー構成: ${rubbers.join("・")}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: basePrompt }],
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    const text =
      data.choices?.[0]?.message?.content ?? "回答を取得できませんでした。";

    return NextResponse.json({ message: text });
  } catch (error) {
    console.error("APIエラー:", error);
    return NextResponse.json(
      { message: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}
