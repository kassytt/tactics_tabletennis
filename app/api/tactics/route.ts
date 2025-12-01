import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { style, racket, rubbers } = await req.json();

    let prompt = "";

    // 🎯 再診断（ラケットまたはラバーが入力されている場合）
    if (racket || (rubbers && rubbers.length > 0)) {
      prompt = `あなたはたくさんの世界大会優勝者を輩出した、世界一の卓球のコーチです。
以下の戦型、ラケット、ラバー構成を踏まえて、
より実戦的で具体的な戦術アドバイスを300文字以内で日本語で提案してください。

戦型: ${style || "未設定"}
ラケット: ${racket || "未設定"}
ラバー構成: ${rubbers?.join("・") || "未設定"}

（例：攻撃の組み立て方、得点パターン、相手への対応戦術など）`;
    } 
    // 🎯 初回診断（戦型だけ選択されている場合）
    else {
      const basePrompt = `あなたはたくさんの世界大会優勝者を輩出した、世界一の卓球のコーチです。
これから卓球を始めたい人向けに戦型の相談をされています。
選択された戦型スタイルを踏まえ、そのスタイルに沿った戦術と、
ラケットとラバーの種類を500文字程度で日本語でアドバイスしてください。
その際、シェイク、中国式ペン、日本式ペン、それぞれで戦い方のスタイルを教えてあげてください。
また、それぞれについて、裏ソフト、表ソフト、異質ラバーを使う場合の戦い方も教えてあげてください。

戦型: ${style}`;
      prompt = basePrompt;
    }

    // 🧠 ChatGPT API 呼び出し
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // 速くてコスパの良いモデル
        messages: [{ role: "user", content: prompt }],
        temperature: 0.8,
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      message: data.choices?.[0]?.message?.content ?? "AIの応答を取得できませんでした。",
    });
  } catch (error) {
    console.error("APIエラー:", error);
    return NextResponse.json(
      { message: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}
