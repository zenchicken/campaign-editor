import React, { useState } from 'react';

interface ApiKeyInputProps {
  onSubmit: (apiKey: string) => void;
}

export function ApiKeyInput({ onSubmit }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setError('Please enter your OpenAI API key.');
      return;
    }
    if (!trimmed.startsWith('sk-')) {
      setError('API key should start with "sk-". Check your key and try again.');
      return;
    }
    setError('');
    onSubmit(trimmed);
  };

  return (
    <div className="card api-key-card">
      <div className="card-header">
        <h2>🔑 OpenAI API Key</h2>
        <p>
          Enter your OpenAI API key to power the AI campaign generation. Your key is used
          directly from your browser and is never stored on any server.
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="api-key" className="field-label">
            API Key
          </label>
          <div className="api-key-input-wrapper">
            <input
              id="api-key"
              type={showKey ? 'text' : 'password'}
              className="text-input"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError('');
              }}
              placeholder="sk-..."
              autoComplete="off"
              autoFocus
            />
            <button
              type="button"
              className="toggle-visibility-btn"
              onClick={() => setShowKey((v) => !v)}
              aria-label={showKey ? 'Hide API key' : 'Show API key'}
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
          Don't have a key?{' '}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get one at platform.openai.com
          </a>
        </p>
        <button type="submit" className="btn btn-primary btn-full">
          Continue →
        </button>
      </form>
    </div>
  );
}
