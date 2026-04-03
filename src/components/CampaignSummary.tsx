import type { CampaignSection } from '../types/campaign';

interface CampaignSummaryProps {
  concept: string;
  sections: CampaignSection[];
  onStartOver: () => void;
}

export function CampaignSummary({ concept, sections, onStartOver }: CampaignSummaryProps) {
  const completedSections = sections.filter((s) => s.aiResponse && !s.isLoading);
  const titleSection = sections.find((s) => s.id === 'title');

  const handlePrint = () => {
    window.print();
  };

  const handleCopyToClipboard = async () => {
    const text = buildPlainText(concept, sections);
    try {
      await navigator.clipboard.writeText(text);
      alert('Campaign summary copied to clipboard!');
    } catch {
      alert('Could not copy to clipboard. Please use the print option instead.');
    }
  };

  return (
    <div className="campaign-summary">
      <div className="summary-header card">
        <div className="summary-title-row">
          <h2>📚 Campaign Summary</h2>
          <div className="summary-actions">
            <button className="btn btn-secondary" onClick={handleCopyToClipboard}>
              📋 Copy
            </button>
            <button className="btn btn-secondary" onClick={handlePrint}>
              🖨️ Print
            </button>
            <button className="btn btn-ghost" onClick={onStartOver}>
              ↩ Start Over
            </button>
          </div>
        </div>

        <div className="summary-concept">
          <h3>Original Concept</h3>
          <p>{concept}</p>
        </div>

        {titleSection?.aiResponse && (
          <div className="summary-byline">
            <div className="ai-response-text summary-title-text">
              {titleSection.aiResponse}
            </div>
          </div>
        )}

        <p className="summary-stats">
          {completedSections.length} of {sections.length} sections generated
        </p>
      </div>

      <div className="summary-sections print-only-sections">
        {completedSections.map((section) => (
          <div key={section.id} className="summary-section">
            <h3 className="summary-section-title">{section.title}</h3>
            <div className="summary-section-content">
              <div className="ai-response-text">{section.aiResponse}</div>
              {section.userNotes && (
                <div className="summary-notes">
                  <strong>GM Notes:</strong> {section.userNotes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function buildPlainText(concept: string, sections: CampaignSection[]): string {
  const lines: string[] = [
    'TABLETOP RPG CAMPAIGN',
    '='.repeat(60),
    '',
    'CAMPAIGN CONCEPT:',
    concept,
    '',
    '='.repeat(60),
    '',
  ];

  for (const section of sections) {
    if (section.aiResponse && !section.isLoading) {
      lines.push(section.title.toUpperCase());
      lines.push('-'.repeat(40));
      lines.push(section.aiResponse);
      if (section.userNotes) {
        lines.push('');
        lines.push('GM NOTES:');
        lines.push(section.userNotes);
      }
      lines.push('');
      lines.push('');
    }
  }

  return lines.join('\n');
}
