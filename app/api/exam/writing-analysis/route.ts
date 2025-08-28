import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // --- MOCKED AI IMPLEMENTATION FOR POC --- //
    // This simulates AI analysis without external API calls or billing.
    // The scoring and description logic can be customized as needed for the POC.

    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

    let rawScore = 0;
    let detailedDescription = {};

    if (wordCount < 10) {
      rawScore = Math.floor(Math.random() * 5) + 1; // 1-5 points
      detailedDescription = {
        message: 'Your text is too short. Please elaborate more.',
        wordCount: wordCount,
        feedback: 'Consider adding more details and expanding on your ideas.',
      };
    } else if (wordCount >= 10 && wordCount < 50) {
      rawScore = Math.floor(Math.random() * 5) + 6; // 6-10 points
      detailedDescription = {
        message: 'Good start! Your text has some good points.',
        wordCount: wordCount,
        feedback: 'Try to provide more examples or deeper analysis.',
      };
    } else {
      rawScore = Math.floor(Math.random() * 10) + 11; // 11-20 points
      detailedDescription = {
        message: 'Excellent work! Your text is well-developed.',
        wordCount: wordCount,
        feedback: 'Keep up the great writing!',
      };
    }

    // Max score can be set based on the desired range, e.g., 20
    const maxScore = 20;

    return NextResponse.json({
      score: rawScore,
      detailedDescription: detailedDescription,
      maxScore: maxScore, // Also return maxScore for consistency
    });
  } catch (error) {
    console.error('Error analyzing text (mocked):', error);
    return NextResponse.json({ error: 'Failed to analyze text (mocked)' }, { status: 500 });
  }
}
