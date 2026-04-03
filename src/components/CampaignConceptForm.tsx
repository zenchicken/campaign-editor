import React, { useState } from 'react';

interface CampaignConceptFormProps {
  onSubmit: (concept: string) => void;
  isGenerating: boolean;
}

const EXAMPLE_CONCEPTS = [
  'A dark fantasy campaign where a once-great empire has fallen to a mysterious plague that turns the dead into sentient, suffering undead, and the players must find the cure before their own city falls.',
  'A swashbuckling pirate adventure across enchanted seas where the players seek a legendary treasure that grants the power to reshape reality, while rival factions and sea gods stand in their way.',
  'A political intrigue campaign set in a city of floating sky islands where noble houses compete for control of ancient weather-controlling machines, and revolution is brewing from below.',
];

export function CampaignConceptForm({ onSubmit, isGenerating }: CampaignConceptFormProps) {
  const [concept, setConcept] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = concept.trim();
    if (!trimmed) {
      setError('Please describe your campaign concept.');
      return;
    }
    if (trimmed.length < 20) {
      setError('Please provide a more detailed description (at least 20 characters).');
      return;
    }
    setError('');
    onSubmit(trimmed);
  };

  const applyExample = (example: string) => {
    setConcept(example);
    setError('');
  };

  return (
    <div className="card concept-card">
      <div className="card-header">
        <h2>🗡️ Campaign Concept</h2>
        <p>
          Describe the overarching idea for your tabletop RPG campaign. The AI will use
          this as the foundation to generate a complete story arc and game master materials.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="field-group">
          <label htmlFor="concept" className="field-label">
            Campaign Concept
          </label>
          <textarea
            id="concept"
            className="textarea-input"
            value={concept}
            onChange={(e) => {
              setConcept(e.target.value);
              setError('');
            }}
            placeholder="Describe your campaign idea... What is the core conflict? What kind of world is it set in? What tone are you going for?"
            rows={6}
            disabled={isGenerating}
          />
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
          <p className="char-count">{concept.length} characters</p>
        </div>

        <div className="examples-section">
          <p className="examples-label">💡 Need inspiration? Try an example:</p>
          <div className="examples-list">
            {EXAMPLE_CONCEPTS.map((example, i) => (
              <button
                key={i}
                type="button"
                className="example-btn"
                onClick={() => applyExample(example)}
                disabled={isGenerating}
              >
                {example.slice(0, 80)}…
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <span className="spinner" aria-hidden="true" /> Generating Campaign…
            </>
          ) : (
            '✨ Generate My Campaign'
          )}
        </button>
      </form>
    </div>
  );
}
