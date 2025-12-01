import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { history } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
あなたはたくさんの世界大会優勝者を輩出した、世界一の卓球のコーチです。
ユーザーの戦型・戦術・練習内容を理解したうえで、戦術面・技術面・メンタル面を含めたアドバイスを丁寧に答えてください。
基本的にはユーザの意見を尊重して欲しいですが、スポーツマンシップに反すること、誤ったこと、非合理的でないことについては、理由と共に否定し、誤りを訂正してください
`,
        },
        ...history,
      ],
    });

    const reply = completion.choices[0]?.message?.content?.trim();
    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "チャット応答の生成に失敗しました。" },
      { status: 500 }
    );
  }
}
