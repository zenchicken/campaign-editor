import { describe, it, expect } from 'vitest';
import { buildUserPrompt } from '../services/openai';
import { CAMPAIGN_SECTION_DEFINITIONS } from '../types/campaign';

describe('buildUserPrompt', () => {
  it('replaces {concept} placeholder with campaign concept', () => {
    const template = 'Create a campaign for: {concept}';
    const result = buildUserPrompt(template, 'A dark fantasy campaign');
    expect(result).toBe('Create a campaign for: A dark fantasy campaign');
  });

  it('replaces multiple occurrences of {concept}', () => {
    const template = '{concept} is the focus. Tell me about {concept}.';
    const result = buildUserPrompt(template, 'pirates');
    expect(result).toBe('pirates is the focus. Tell me about pirates.');
  });

  it('returns template unchanged when there is no placeholder', () => {
    const template = 'No placeholder here.';
    const result = buildUserPrompt(template, 'pirates');
    expect(result).toBe('No placeholder here.');
  });
});

describe('CAMPAIGN_SECTION_DEFINITIONS', () => {
  it('contains at least 8 sections', () => {
    expect(CAMPAIGN_SECTION_DEFINITIONS.length).toBeGreaterThanOrEqual(8);
  });

  it('each section has required fields', () => {
    for (const section of CAMPAIGN_SECTION_DEFINITIONS) {
      expect(section.id).toBeTruthy();
      expect(section.title).toBeTruthy();
      expect(section.systemPrompt).toBeTruthy();
      expect(section.userPromptTemplate).toContain('{concept}');
    }
  });

  it('all section ids are unique', () => {
    const ids = CAMPAIGN_SECTION_DEFINITIONS.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
