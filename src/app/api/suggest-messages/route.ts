import {
    GoogleGenAI,
    ThinkingLevel,
} from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: process.env['GEMINI_API_KEY'],
});

export const runtime = 'edge'


export async function POST(req: Request) {

    try {
        const prompt = "Create exactly three open-ended, highly engaging questions formatted as a single string, with each question separated by '||'. These questions are specifically for an anonymous social messaging platform like Qooh.me, so they should feel scroll-stopping, reply-worthy, playful, and easy for strangers or mutuals to answer. Use a natural blend of English and Hinglish, with a Gen Z tone that feels casual, witty, and current. Add a light flirty touch to some questions, but keep it subtle, cute, and non-explicit. The questions should spark curiosity, invite fun anonymous replies, and make people feel tempted to respond with something interesting, teasing, or charming. Avoid sensitive, deeply personal, offensive, or uncomfortable topics. Focus on vibes, crush energy, personality, texting style, attraction, first impressions, fun hypotheticals, and relatable everyday thoughts. Make sure the questions feel like something people would actually want to answer on Qooh—short, catchy, and conversation-starting. Output only a single string in this format: 'Question 1||Question 2||Question 3'"
        const tools = [
            {
                googleSearch: {
                }
            },
        ];
        const config = {
            thinkingConfig: {
                thinkingLevel: ThinkingLevel.MEDIUM,
            },
            tools,
        };
        const model = 'gemini-3-flash-preview';
        const contents = [
            {
                role: 'user',
                parts: [
                    {
                        text: prompt,
                    },
                ],
            },
        ];

        const response = await ai.models.generateContentStream({
            model,
            config: {
                ...config,
                maxOutputTokens: 500,
            },
            contents,
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
    } catch (error) {
        if (error instanceof Error) {
            const { name, message } = error;
            const { status, headers } = error as any;
            console.log(name, status, headers, message);
            return new Response(JSON.stringify({ error: message }), {
                status: status || 500,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            console.log(error);
            return new Response(JSON.stringify({ error: 'Unknown error occurred' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    }
}

