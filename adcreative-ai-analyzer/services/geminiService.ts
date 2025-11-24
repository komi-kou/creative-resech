import { GoogleGenAI, Type } from "@google/genai";
import { AdAnalysisResult } from "../types";

const SYSTEM_INSTRUCTION = `
あなたは世界トップクラスのデジタルマーケティング・クリエイティブディレクターです。
ユーザーがアップロードした広告クリエイティブ（Meta広告、Google広告、ディスプレイ広告など）を詳細に分析し、そのパフォーマンスを予測・評価してください。

あなたの役割は、単なる感想を述べることではなく、**数値的根拠と競合比較に基づいたプロフェッショナルな改善提案**を行うことです。
大手企業（Nike, Apple, Starbucksなど）や、同業界のトップパフォーマンス広告（CTRが高い広告）をベンチマークとして比較してください。

以下のJSON形式で出力してください。

1. **metrics (各10点満点)**:
   厳しめに採点してください。7点は「普通」、8点以上は「業界トップクラス」です。
   - visibility: 視認性（フィードでのスクロールを止める力、コントラスト、視線誘導）
   - design: デザイン力（レイアウトの美しさ、フォント選定、配色の調和、画像のクオリティ）
   - appeal: 訴求力（ベネフィットの明確さ、ユーザーインサイトへの刺さり具合、CTAの強さ）
   - clarity: 情報の明確さ（「何の商品か」が瞬時に伝わるか、文字の可読性、情報過多でないか）
   - trust: 信頼性（ブランドの信頼感、怪しさがないか、リーガルチェック観点での安心感）

2. **overallScore (100点満点)**:
   上記のmetricsを総合し、実際の広告運用で成果が出る確率をスコア化してください。
   - 80-100: 非常に優秀。そのまま配信すべき。
   - 60-79: 合格ライン。微修正でさらに良くなる。
   - 40-59: 改善が必要。
   - 0-39: 作り直しを推奨。

3. **comparison**:
   「競合他社や大手ブランドのクリエイティブと比較してどう見えるか」を記述。
   （例：「競合A社に比べて視認性は高いが、デザインの洗練度で劣る」「大手B社のキャンペーンバナーのような高級感がある」）

4. **pros**:
   評価できる点（箇条書き、最大3つ）。

5. **cons**:
   致命的な欠点や改善が必要な弱点（箇条書き、最大3つ）。

6. **improvements**:
   **具体的で即実行可能な改善指示**（箇条書き、最大3つ）。
   抽象的な表現は避け、デザイナーにそのまま渡せる指示にしてください。
   （良い例：「背景色を#F0F0F0から白に変更し、商品画像を20%拡大する」）
   （悪い例：「もっと目立つようにする」）

7. **targetAudienceAnalysis**:
   このクリエイティブが最も響くターゲット層（デモグラフィック、興味関心、抱えている悩み）の分析。

全てのテキストは**日本語**で出力してください。
`;

export const analyzeImage = async (file: File, apiKey?: string): Promise<AdAnalysisResult> => {
  const keyToUse = apiKey || process.env.API_KEY;
  
  if (!keyToUse) {
    throw new Error("API Key is missing. Please provide a valid Gemini API Key.");
  }

  const ai = new GoogleGenAI({ apiKey: keyToUse });

  // Convert file to Base64
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64String = result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: file.type,
            data: base64Data,
          },
        },
        {
          text: "この広告クリエイティブを、プロフェッショナルな視点で分析し、改善点を指摘してください。",
        },
      ],
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      // Enable thinking for higher quality analysis
      thinkingConfig: { thinkingBudget: 2048 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          metrics: {
            type: Type.OBJECT,
            properties: {
              visibility: { type: Type.NUMBER },
              design: { type: Type.NUMBER },
              appeal: { type: Type.NUMBER },
              clarity: { type: Type.NUMBER },
              trust: { type: Type.NUMBER },
            },
            required: ["visibility", "design", "appeal", "clarity", "trust"],
          },
          overallScore: { type: Type.NUMBER },
          comparison: { type: Type.STRING },
          pros: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          cons: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          improvements: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          targetAudienceAnalysis: { type: Type.STRING },
        },
        required: ["metrics", "overallScore", "comparison", "pros", "cons", "improvements", "targetAudienceAnalysis"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from Gemini.");
  }

  try {
    let text = response.text;
    // Clean potential markdown code blocks if strictly JSON is not returned
    if (text.startsWith("```")) {
      text = text.replace(/^```(json)?\n?/, "").replace(/\n?```$/, "");
    }
    
    const result = JSON.parse(text) as AdAnalysisResult;
    return result;
  } catch (e) {
    console.error("Failed to parse JSON", e);
    throw new Error("Analysis failed due to invalid response format.");
  }
};