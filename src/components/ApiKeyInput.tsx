import React, { useState } from 'react';

interface ApiKeyInputProps {
  onSubmit: (token: string) => void;
}

export function ApiKeyInput({ onSubmit }: ApiKeyInputProps) {
  const [token, setToken] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = token.trim();
    if (!trimmed) {
      setError('Please enter your GitHub personal access token.');
      return;
    }
    if (!trimmed.startsWith('ghp_') && !trimmed.startsWith('github_pat_')) {
      setError(
        'Token should start with "ghp_" (classic) or "github_pat_" (fine-grained). Check your token and try again.'
      );
      return;
    }
    setError('');
    onSubmit(trimmed);
  };

  return (
    <div className="card api-key-card">
      <div className="card-header">
        <h2>🔑 GitHub Token</h2>
        <p>
          Enter a GitHub personal access token with the <code>models:read</code> scope to
          power the AI campaign generation via GitHub Models. Your token is used directly
          from your browser and is never stored on any server.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="api-key" className="field-label">
            Personal Access Token
          </label>
          <div className="api-key-input-wrapper">
            <input
              id="api-key"
              type={showKey ? 'text' : 'password'}
              className="text-input"
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setError('');
              }}
              placeholder="ghp_... or github_pat_..."
              autoComplete="off"
              autoFocus
            />
            <button
              type="button"
              className="toggle-visibility-btn"
              onClick={() => setShowKey((v) => !v)}
              aria-label={showKey ? 'Hide token' : 'Show token'}
            >
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
        </div>
        <p className="hint">
          Need a token?{' '}
          <a
            href="https://github.com/settings/tokens/new?scopes=models:read&description=Campaign+Editor"
            target="_blank"
            rel="noopener noreferrer"
          >
            Create one at github.com/settings/tokens
          </a>{' '}
          with the <code>models:read</code> scope.
        </p>
        <button type="submit" className="btn btn-primary btn-full">
          Continue →
        </button>
      </form>
    </div>
  );
}
