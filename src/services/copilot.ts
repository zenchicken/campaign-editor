import ModelClient, { isUnexpected } from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';

const GITHUB_MODELS_ENDPOINT = 'https://models.github.ai/inference';
const MODEL_ID = 'openai/gpt-4o-mini';

let copilotClient: ReturnType<typeof ModelClient> | null = null;

export function initCopilot(token: string): void {
  copilotClient = ModelClient(
    GITHUB_MODELS_ENDPOINT,
    new AzureKeyCredential(token)
  );
}

export function isInitialized(): boolean {
  return copilotClient !== null;
}

export async function generateCampaignContent(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  if (!copilotClient) {
    throw new Error(
      'GitHub Models client is not initialized. Please provide a GitHub token.'
    );
  }

  const response = await copilotClient.path('/chat/completions').post({
    body: {
      model: MODEL_ID,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 1500,
    },
  });

  if (isUnexpected(response)) {
    throw new Error(
      `GitHub Models API error: ${response.body.error?.message ?? 'Unknown error'}`
    );
  }

  return response.body.choices[0]?.message?.content ?? 'No content generated.';
}

export function buildUserPrompt(template: string, concept: string): string {
  return template.replace(/\{concept\}/g, concept);
}
