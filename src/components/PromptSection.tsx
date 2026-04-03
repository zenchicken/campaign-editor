import { useState } from 'react';
import type { CampaignSection } from '../types/campaign';

interface PromptSectionProps {
  section: CampaignSection;
  index: number;
  onNotesChange: (id: string, notes: string) => void;
  onRegenerate: (id: string) => void;
}

export function PromptSection({
  section,
  index,
  onNotesChange,
  onRegenerate,
}: PromptSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  const statusClass = section.isLoading
    ? 'status-loading'
    : section.aiResponse
      ? 'status-done'
      : 'status-pending';

  return (
    <div className={`prompt-section ${statusClass}`} id={`section-${section.id}`}>
      <div className="section-header">
        <div className="section-title-row">
          <span className="section-number">{index + 1}</span>
          <h3 className="section-title">{section.title}</h3>
        </div>
        <div className="section-actions">
          {section.aiResponse && !section.isLoading && (
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onRegenerate(section.id)}
              title="Regenerate this section"
              aria-label={`Regenerate ${section.title}`}
            >
              🔄 Regenerate
            </button>
          )}
        </div>
      </div>

      <div className="section-body">
        {section.isLoading ? (
          <div className="loading-state" aria-live="polite" aria-busy="true">
            <div className="loading-dots">
              <span />
              <span />
              <span />
            </div>
            <p>Generating {section.title.replace(/^[^\s]+ /, '')}…</p>
          </div>
        ) : section.aiResponse ? (
          <>
            <div className="ai-response">
              <div className="ai-label">
                <span className="ai-badge">AI</span> Generated Content
              </div>
              <div className="ai-response-text">
                <FormattedText text={section.aiResponse} />
              </div>
            </div>

            <div className="notes-section">
              <div className="notes-header">
                <label htmlFor={`notes-${section.id}`} className="notes-label">
                  📝 Your Notes & Customizations
                </label>
                {!isEditing ? (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setIsEditing(true)}
                  >
                    {section.userNotes ? '✏️ Edit' : '+ Add Notes'}
                  </button>
                ) : (
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setIsEditing(false)}
                  >
                    ✓ Done
                  </button>
                )}
              </div>
              {isEditing ? (
                <textarea
                  id={`notes-${section.id}`}
                  className="textarea-input notes-textarea"
                  value={section.userNotes}
                  onChange={(e) => onNotesChange(section.id, e.target.value)}
                  placeholder="Add your own notes, modifications, or ideas for this section..."
                  rows={4}
                  autoFocus
                />
              ) : section.userNotes ? (
                <div
                  className="notes-display"
                  onClick={() => setIsEditing(true)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditing(true)}
                >
                  {section.userNotes}
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <div className="pending-state">
            <p>Waiting to generate…</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Renders AI response text with support for **bold** markdown and paragraph breaks.
 * No raw HTML is injected — all content is rendered as React elements.
 */
function FormattedText({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/);
  return (
    <>
      {paragraphs.map((para, pi) => (
        <p key={pi}>
          {para.split(/\n/).map((line, li, arr) => (
            <span key={li}>
              <BoldLine text={line} />
              {li < arr.length - 1 && <br />}
            </span>
          ))}
        </p>
      ))}
    </>
  );
}

function BoldLine({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          part
        )
      )}
    </>
  );
}
