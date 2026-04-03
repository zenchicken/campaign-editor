import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PromptSection } from '../components/PromptSection';
import type { CampaignSection } from '../types/campaign';

const baseSection: CampaignSection = {
  id: 'world',
  title: '🌍 World & Setting',
  systemPrompt: 'You are a worldbuilder.',
  userPromptTemplate: 'Build a world for: {concept}',
  aiResponse: '',
  userNotes: '',
  isLoading: false,
  isExpanded: true,
};

describe('PromptSection', () => {
  it('shows loading state when isLoading is true', () => {
    render(
      <PromptSection
        section={{ ...baseSection, isLoading: true }}
        index={0}
        onNotesChange={vi.fn()}
        onRegenerate={vi.fn()}
      />
    );
    expect(screen.getByText(/generating/i)).toBeInTheDocument();
    expect(document.querySelector('[aria-busy="true"]')).toBeTruthy();
  });

  it('shows pending state when there is no response', () => {
    render(
      <PromptSection
        section={baseSection}
        index={0}
        onNotesChange={vi.fn()}
        onRegenerate={vi.fn()}
      />
    );
    expect(screen.getByText(/waiting to generate/i)).toBeInTheDocument();
  });

  it('shows AI response when aiResponse is set', () => {
    render(
      <PromptSection
        section={{ ...baseSection, aiResponse: 'A sprawling fantasy world of magic and danger.' }}
        index={0}
        onNotesChange={vi.fn()}
        onRegenerate={vi.fn()}
      />
    );
    expect(screen.getByText(/sprawling fantasy world/i)).toBeInTheDocument();
    expect(screen.getByText(/generated content/i)).toBeInTheDocument();
  });

  it('shows regenerate button when aiResponse is set', () => {
    render(
      <PromptSection
        section={{ ...baseSection, aiResponse: 'Some content.' }}
        index={0}
        onNotesChange={vi.fn()}
        onRegenerate={vi.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /regenerate/i })).toBeInTheDocument();
  });

  it('calls onRegenerate when regenerate button is clicked', () => {
    const mockRegenerate = vi.fn();
    render(
      <PromptSection
        section={{ ...baseSection, aiResponse: 'Some content.' }}
        index={0}
        onNotesChange={vi.fn()}
        onRegenerate={mockRegenerate}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /regenerate/i }));
    expect(mockRegenerate).toHaveBeenCalledWith('world');
  });

  it('shows notes textarea when Add Notes is clicked', async () => {
    render(
      <PromptSection
        section={{ ...baseSection, aiResponse: 'Some content.' }}
        index={0}
        onNotesChange={vi.fn()}
        onRegenerate={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /\+ add notes/i }));
    expect(screen.getByRole('textbox', { name: /your notes/i })).toBeInTheDocument();
  });

  it('calls onNotesChange when notes are typed', async () => {
    const mockNotesChange = vi.fn();
    render(
      <PromptSection
        section={{ ...baseSection, aiResponse: 'Some content.' }}
        index={0}
        onNotesChange={mockNotesChange}
        onRegenerate={vi.fn()}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /\+ add notes/i }));
    await userEvent.type(screen.getByRole('textbox', { name: /your notes/i }), 'My notes');
    expect(mockNotesChange).toHaveBeenCalledWith('world', expect.stringContaining('M'));
  });

  it('displays section number', () => {
    render(
      <PromptSection
        section={baseSection}
        index={2}
        onNotesChange={vi.fn()}
        onRegenerate={vi.fn()}
      />
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
