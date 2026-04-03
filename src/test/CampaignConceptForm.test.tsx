import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CampaignConceptForm } from '../components/CampaignConceptForm';

describe('CampaignConceptForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders the concept textarea and submit button', () => {
    render(<CampaignConceptForm onSubmit={mockOnSubmit} isGenerating={false} />);
    expect(screen.getByLabelText(/campaign concept/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate my campaign/i })).toBeInTheDocument();
  });

  it('shows error when submitted with empty concept', async () => {
    render(<CampaignConceptForm onSubmit={mockOnSubmit} isGenerating={false} />);
    fireEvent.click(screen.getByRole('button', { name: /generate my campaign/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/please describe/i);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error when concept is too short', async () => {
    render(<CampaignConceptForm onSubmit={mockOnSubmit} isGenerating={false} />);
    await userEvent.type(screen.getByLabelText(/campaign concept/i), 'short');
    fireEvent.click(screen.getByRole('button', { name: /generate my campaign/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/more detailed/i);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with valid concept', async () => {
    render(<CampaignConceptForm onSubmit={mockOnSubmit} isGenerating={false} />);
    const validConcept = 'A dark fantasy campaign in a crumbling empire under siege by undead forces.';
    await userEvent.type(screen.getByLabelText(/campaign concept/i), validConcept);
    fireEvent.click(screen.getByRole('button', { name: /generate my campaign/i }));
    expect(mockOnSubmit).toHaveBeenCalledWith(validConcept);
  });

  it('shows generating state when isGenerating is true', () => {
    render(<CampaignConceptForm onSubmit={mockOnSubmit} isGenerating={true} />);
    expect(screen.getByRole('button', { name: /generating campaign/i })).toBeDisabled();
  });

  it('fills textarea when example is clicked', async () => {
    render(<CampaignConceptForm onSubmit={mockOnSubmit} isGenerating={false} />);
    const exampleButtons = screen.getAllByRole('button').filter(
      (btn) => !btn.textContent?.includes('Generate')
    );
    expect(exampleButtons.length).toBeGreaterThan(0);
    fireEvent.click(exampleButtons[0]);
    const textarea = screen.getByLabelText(/campaign concept/i) as HTMLTextAreaElement;
    expect(textarea.value.length).toBeGreaterThan(20);
  });

  it('shows character count', async () => {
    render(<CampaignConceptForm onSubmit={mockOnSubmit} isGenerating={false} />);
    await userEvent.type(screen.getByLabelText(/campaign concept/i), 'hello');
    expect(screen.getByText(/5 characters/i)).toBeInTheDocument();
  });
});
