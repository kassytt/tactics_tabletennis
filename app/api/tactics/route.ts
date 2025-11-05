import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { racket, rubbers, style } = await req.json();

    // プロンプトの生成（戦型が「悩み中」の場合は別メッセージ）
    const prompt =
      style === "悩み中"
        ? `あなたは卓球のコーチです。
以下のラケットとラバー構成を持つ選手が、自分に合った戦型を悩んでいます。
どんな戦型が向いているか、そしてどんな戦術が合いそうかを日本語で具体的にアドバイスしてください。

ラケット: ${racket}
ラバー構成: ${rubbers.join("・")}`
        : `あなたは卓球のコーチです。
以下の選手のラケット・ラバー構成と戦型を踏まえ、
最適な戦術を150文字程度で日本語でアドバイスしてください。

戦型: ${style}
ラケット: ${racket}
ラバー構成: ${rubbers.join("・")}`;

    // ChatGPT API 呼び出し
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // ← 環境変数から取得
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // コストが低く応答も速い
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      message: data.choices?.[0]?.message?.content ?? "回答を取得できませんでした。",
    });
  } catch (error) {
    console.error("APIエラー:", error);
    return NextResponse.json(
      { message: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}
