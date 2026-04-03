import { useState, useCallback } from 'react';
import { ApiKeyInput } from './components/ApiKeyInput';
import { CampaignConceptForm } from './components/CampaignConceptForm';
import { PromptSection } from './components/PromptSection';
import { CampaignSummary } from './components/CampaignSummary';
import { initCopilot, generateCampaignContent, buildUserPrompt } from './services/copilot';
import {
  CAMPAIGN_SECTION_DEFINITIONS,
  type CampaignPhase,
  type CampaignSection,
} from './types/campaign';
import './App.css';

function createInitialSections(): CampaignSection[] {
  return CAMPAIGN_SECTION_DEFINITIONS.map((def) => ({
    ...def,
    aiResponse: '',
    userNotes: '',
    isLoading: false,
    isExpanded: true,
  }));
}

export function App() {
  const [phase, setPhase] = useState<CampaignPhase>('api-key');
  const [concept, setConcept] = useState('');
  const [sections, setSections] = useState<CampaignSection[]>(createInitialSections);
  const [globalError, setGlobalError] = useState('');

  const handleApiKey = useCallback((token: string) => {
    initCopilot(token);
    setPhase('concept');
  }, []);

  const generateSection = useCallback(
    async (sectionId: string, campaignConcept: string) => {
      const sectionDef = CAMPAIGN_SECTION_DEFINITIONS.find((d) => d.id === sectionId);
      if (!sectionDef) return;

      setSections((prev) =>
        prev.map((s) =>
          s.id === sectionId ? { ...s, isLoading: true, aiResponse: '' } : s
        )
      );

      try {
        const userPrompt = buildUserPrompt(sectionDef.userPromptTemplate, campaignConcept);
        const response = await generateCampaignContent(
          sectionDef.systemPrompt,
          userPrompt
        );
        setSections((prev) =>
          prev.map((s) =>
            s.id === sectionId ? { ...s, isLoading: false, aiResponse: response } : s
          )
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        setSections((prev) =>
          prev.map((s) =>
            s.id === sectionId
              ? {
                  ...s,
                  isLoading: false,
                  aiResponse: `⚠️ Error generating content: ${message}`,
                }
              : s
          )
        );
      }
    },
    []
  );

  const handleConceptSubmit = useCallback(
    async (campaignConcept: string) => {
      setConcept(campaignConcept);
      setSections(createInitialSections());
      setGlobalError('');
      setPhase('generating');

      // Generate all sections sequentially so each can be seen as it arrives
      try {
        for (const sectionDef of CAMPAIGN_SECTION_DEFINITIONS) {
          await generateSection(sectionDef.id, campaignConcept);
        }
      } catch {
        setGlobalError('Generation interrupted. You can regenerate individual sections.');
      }

      setPhase('prompts');
    },
    [generateSection]
  );

  const handleRegenerate = useCallback(
    (sectionId: string) => {
      generateSection(sectionId, concept);
    },
    [generateSection, concept]
  );

  const handleNotesChange = useCallback((sectionId: string, notes: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, userNotes: notes } : s))
    );
  }, []);

  const handleStartOver = useCallback(() => {
    setConcept('');
    setSections(createInitialSections());
    setGlobalError('');
    setPhase('concept');
  }, []);

  const handleViewSummary = useCallback(() => {
    setPhase('summary');
  }, []);

  const handleBackToEdit = useCallback(() => {
    setPhase('prompts');
  }, []);

  const isGenerating = phase === 'generating' || sections.some((s) => s.isLoading);
  const hasContent = sections.some((s) => s.aiResponse && !s.isLoading);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="header-icon" aria-hidden="true">
              🎲
            </span>
            <div>
              <h1 className="header-title">Campaign Editor</h1>
              <p className="header-subtitle">AI-Powered Tabletop RPG Campaign Generator</p>
            </div>
          </div>
          {(phase === 'prompts' || phase === 'summary' || phase === 'generating') && (
            <nav className="header-nav">
              {phase !== 'summary' ? (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleViewSummary}
                  disabled={!hasContent}
                >
                  📚 View Summary
                </button>
              ) : (
                <button className="btn btn-secondary btn-sm" onClick={handleBackToEdit}>
                  ✏️ Back to Edit
                </button>
              )}
              <button className="btn btn-ghost btn-sm" onClick={handleStartOver}>
                ↩ New Campaign
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="app-main">
        {globalError && (
          <div className="global-error" role="alert">
            ⚠️ {globalError}
          </div>
        )}

        {phase === 'api-key' && <ApiKeyInput onSubmit={handleApiKey} />}

        {phase === 'concept' && (
          <CampaignConceptForm onSubmit={handleConceptSubmit} isGenerating={false} />
        )}

        {(phase === 'generating' || phase === 'prompts') && (
          <div className="prompts-layout">
            <aside className="prompts-sidebar">
              <div className="sidebar-concept card">
                <h3>📖 Your Concept</h3>
                <p>{concept}</p>
                <button
                  className="btn btn-ghost btn-sm btn-full"
                  onClick={handleStartOver}
                >
                  ↩ Change Concept
                </button>
              </div>
              <nav className="sidebar-nav">
                <h4>Sections</h4>
                <ul>
                  {sections.map((section, i) => (
                    <li key={section.id}>
                      <a
                        href={`#section-${section.id}`}
                        className={`sidebar-link ${
                          section.isLoading
                            ? 'sidebar-link-loading'
                            : section.aiResponse
                              ? 'sidebar-link-done'
                              : 'sidebar-link-pending'
                        }`}
                      >
                        <span className="sidebar-num">{i + 1}</span>
                        {section.title}
                        {section.isLoading && (
                          <span className="sidebar-spinner" aria-label="loading" />
                        )}
                        {section.aiResponse && !section.isLoading && (
                          <span className="sidebar-check" aria-label="complete">
                            ✓
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <div className="prompts-content">
              {isGenerating && (
                <div className="generation-banner" role="status" aria-live="polite">
                  <span className="spinner" aria-hidden="true" />
                  Generating your campaign… This may take a minute.
                </div>
              )}
              {sections.map((section, i) => (
                <PromptSection
                  key={section.id}
                  section={section}
                  index={i}
                  onNotesChange={handleNotesChange}
                  onRegenerate={handleRegenerate}
                />
              ))}
              {!isGenerating && hasContent && (
                <div className="bottom-actions">
                  <button className="btn btn-primary btn-lg" onClick={handleViewSummary}>
                    📚 View Full Campaign Summary
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {phase === 'summary' && (
          <CampaignSummary
            concept={concept}
            sections={sections}
            onStartOver={handleStartOver}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Campaign Editor · AI-Powered Tabletop RPG Campaign Generator</p>
      </footer>
    </div>
  );
}

export default App;
