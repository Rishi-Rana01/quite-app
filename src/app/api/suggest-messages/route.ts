import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: process.env['GEMINI_API_KEY'],
});

// NOTE: Do NOT use edge runtime — @google/genai requires Node.js APIs

// Fallback questions used when the API quota is exhausted
const FALLBACK_QUESTIONS = [
    "Agar tujhe ek anonymous message milti abhi, kya likhna chahoge?",
    "What's something you'd only say to a stranger but never to a friend?",
    "First impression toh batao — main kaisa/kaisi lagta/lagti hoon honestly? 👀"
]

export async function POST(req: Request) {
    try {
        const prompt = "Create exactly three open-ended, highly engaging questions formatted as a single string, with each question separated by '||'. These questions are specifically for an anonymous social messaging platform like Qooh.me, so they should feel scroll-stopping, reply-worthy, playful, and easy for strangers or mutuals to answer. Use a natural blend of English and Hinglish, with a Gen Z tone that feels casual, witty, and current. Add a light flirty touch to some questions, but keep it subtle, cute, and non-explicit. The questions should spark curiosity, invite fun anonymous replies, and make people feel tempted to respond with something interesting, teasing, or charming. Avoid sensitive, deeply personal, offensive, or uncomfortable topics. Focus on vibes, crush energy, personality, texting style, attraction, first impressions, fun hypotheticals, and relatable everyday thoughts. Make sure the questions feel like something people would actually want to answer. Output ONLY the three questions separated by || with absolutely no surrounding quotes, no extra text, no markdown, no numbering. Example output format: Question 1||Question 2||Question 3"

        const response = await ai.models.generateContentStream({
            model: 'gemini-2.0-flash',
            config: {
                maxOutputTokens: 300,
            },
            contents: [
                {
                    role: 'user',
                    parts: [{ text: prompt }],
                },
            ],
        });

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of response) {
                        if (chunk.text) {
                            controller.enqueue(new TextEncoder().encode(chunk.text));
                        }
                    }
                    controller.close();
                } catch (err) {
                    controller.error(err);
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Cache-Control': 'no-cache, no-transform',
            },
        });

    } catch (error: any) {
        console.error('suggest-messages error:', error);

        // On quota exhaustion (429), return fallback questions instead of crashing
        const statusCode = error?.status ?? error?.code ?? 500;
        if (statusCode === 429) {
            const fallback = FALLBACK_QUESTIONS.join('||');
            return new Response(fallback, {
                status: 200,
                headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            });
        }

        return new Response(
            JSON.stringify({ error: error?.message ?? 'Unknown error occurred' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}
