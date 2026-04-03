import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiKeyInput } from '../components/ApiKeyInput';

describe('ApiKeyInput', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders the API key input form', () => {
    render(<ApiKeyInput onSubmit={mockOnSubmit} />);
    expect(screen.getByPlaceholderText(/sk-/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('shows error when submitted with empty key', async () => {
    render(<ApiKeyInput onSubmit={mockOnSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/please enter/i);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows error when key does not start with sk-', async () => {
    render(<ApiKeyInput onSubmit={mockOnSubmit} />);
    await userEvent.type(screen.getByPlaceholderText(/sk-/i), 'invalid-key');
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/sk-/i);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with valid key', async () => {
    render(<ApiKeyInput onSubmit={mockOnSubmit} />);
    await userEvent.type(screen.getByPlaceholderText(/sk-/i), 'sk-testkey12345');
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    expect(mockOnSubmit).toHaveBeenCalledWith('sk-testkey12345');
  });

  it('toggles API key visibility', async () => {
    render(<ApiKeyInput onSubmit={mockOnSubmit} />);
    const input = screen.getByPlaceholderText(/sk-/i);
    expect(input).toHaveAttribute('type', 'password');
    fireEvent.click(screen.getByRole('button', { name: /show api key/i }));
    expect(input).toHaveAttribute('type', 'text');
    fireEvent.click(screen.getByRole('button', { name: /hide api key/i }));
    expect(input).toHaveAttribute('type', 'password');
  });
});
