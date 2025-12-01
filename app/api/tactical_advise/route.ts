import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ← サーバー専用の環境変数
});

export async function POST(req: Request) {
  try {
    const { style, spin, serveType } = await req.json();

    if (!style || !spin || !serveType) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    const prompt = `
あなたはたくさんの世界大会優勝者を輩出した、世界一の卓球のコーチです。
以下の条件に基づいて、効果的なサーブ後の戦術を日本語で提案してください。

- 戦型: ${style}
- サーブ回転: ${spin}
- サーブの長さとコース: ${serveType}

出力フォーマット:
1. 戦術の狙い
2. 予想される相手の返球
3. 3球目以降の展開とポイント
4. 注意点
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    const advice = response.choices[0].message.content;

    return NextResponse.json({ advice });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to get tactical advice." },
      { status: 500 }
    );
  }
}
