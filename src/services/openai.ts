import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

export function initOpenAI(apiKey: string): void {
  openaiClient = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
}

export function isInitialized(): boolean {
  return openaiClient !== null;
}

export async function generateCampaignContent(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  if (!openaiClient) {
    throw new Error('OpenAI client is not initialized. Please provide an API key.');
  }

  const completion = await openaiClient.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.8,
    max_tokens: 1500,
  });

  return completion.choices[0]?.message?.content ?? 'No content generated.';
}

export function buildUserPrompt(template: string, concept: string): string {
  return template.replace(/\{concept\}/g, concept);
}
