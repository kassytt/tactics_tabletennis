// app/api/tactical_advise/practice/route.ts
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { style, spin, serveType, tactic } = await req.json();

    const prompt = `
あなたはたくさんの世界大会優勝者を輩出した、世界一の卓球のコーチです。
以下の条件に基づいて、具体的で実践的な「練習方法」を提案してください。

- 戦型: ${style}
- サーブの回転: ${spin}
- サーブの種類: ${serveType}
- 戦術アドバイスの内容: ${tactic}

出力フォーマット：
1. 練習の目的
2. 具体的な練習内容（ステップごとに）
3. 練習のポイント
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
    });

    const practiceAdvice = completion.choices[0]?.message?.content?.trim();

    return NextResponse.json({ practiceAdvice });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "練習アドバイスの生成に失敗しました。" },
      { status: 500 }
    );
  }
}
