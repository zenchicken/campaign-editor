import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiKeyInput } from '../components/ApiKeyInput';

describe('ApiKeyInput', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders the GitHub token input form', () => {
    render(<ApiKeyInput onSubmit={mockOnSubmit} />);
    expect(screen.getByPlaceholderText(/ghp_/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('shows error when submitted with empty token', async () => {
    render(<ApiKeyInput onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/please enter/i);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error when token does not start with ghp_ or github_pat_', async () => {
    render(<ApiKeyInput onSubmit={mockOnSubmit} />);
    await userEvent.type(screen.getByPlaceholderText(/ghp_/i), 'invalid-token');
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/ghp_/i);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with a valid classic PAT', async () => {
    render(<ApiKeyInput onSubmit={mockOnSubmit} />);
    await userEvent.type(screen.getByPlaceholderText(/ghp_/i), 'ghp_testtoken12345');
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(mockOnSubmit).toHaveBeenCalledWith('ghp_testtoken12345');
  });

  it('calls onSubmit with a valid fine-grained PAT', async () => {
    render(<ApiKeyInput onSubmit={mockOnSubmit} />);
    await userEvent.type(screen.getByPlaceholderText(/ghp_/i), 'github_pat_testtoken12345');
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(mockOnSubmit).toHaveBeenCalledWith('github_pat_testtoken12345');
  });

  it('toggles token visibility', async () => {
    render(<ApiKeyInput onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText(/ghp_/i);
    expect(input).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByRole('button', { name: /show token/i }));
    expect(input).toHaveAttribute('type', 'text');
    fireEvent.click(screen.getByRole('button', { name: /hide token/i }));
    expect(input).toHaveAttribute('type', 'password');
  });
});
