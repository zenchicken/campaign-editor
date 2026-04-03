export type CampaignPhase =
  | 'api-key'
  | 'concept'
  | 'generating'
  | 'prompts'
  | 'summary';

export interface CampaignSection {
  id: string;
  title: string;
  systemPrompt: string;
  userPromptTemplate: string;
  aiResponse: string;
  userNotes: string;
  isLoading: boolean;
  isExpanded: boolean;
}

export interface CampaignData {
  concept: string;
  sections: CampaignSection[];
}

export const CAMPAIGN_SECTION_DEFINITIONS: Omit<
  CampaignSection,
  'aiResponse' | 'userNotes' | 'isLoading' | 'isExpanded'
>[] = [
  {
    id: 'title',
    title: '📜 Campaign Title & Tagline',
    systemPrompt:
      'You are a creative tabletop RPG campaign designer. Generate evocative, memorable content for game masters.',
    userPromptTemplate:
      'Based on this campaign concept: "{concept}"\n\nGenerate a compelling campaign title and a one-sentence tagline that captures the essence of the adventure. Format your response as:\nTitle: [title]\nTagline: [tagline]\n\nThen provide a brief 2-3 sentence overview of what makes this campaign unique.',
  },
  {
    id: 'world',
    title: '🌍 World & Setting',
    systemPrompt:
      'You are an expert worldbuilder for tabletop RPG campaigns. Create vivid, detailed settings that inspire game masters and immerse players.',
    userPromptTemplate:
      'For a campaign centered on: "{concept}"\n\nDescribe the world and setting in detail:\n- The geography and landscape\n- The political/social climate\n- The tone and atmosphere (dark, heroic, mysterious, etc.)\n- Any unique rules, magic systems, or technologies\n- What makes this world feel alive and dangerous\n\nKeep it practical for a game master running sessions.',
  },
  {
    id: 'conflict',
    title: '⚔️ Main Conflict & Antagonist',
    systemPrompt:
      'You are a master storyteller specializing in tabletop RPG campaigns. Create compelling conflicts and memorable antagonists.',
    userPromptTemplate:
      'For a campaign centered on: "{concept}"\n\nDesign the central conflict and main antagonist:\n- Who or what is the primary antagonist (villain, force, faction)?\n- What is their ultimate goal and motivation?\n- Why do they believe they are justified?\n- What resources and power do they command?\n- How does this conflict threaten the world/community the players care about?\n- What is the point of no return if the players fail?\n\nMake the antagonist feel real, menacing, and complex.',
  },
  {
    id: 'arc',
    title: '🗺️ Story Arc',
    systemPrompt:
      'You are a narrative designer for tabletop RPG campaigns. Create compelling three-act story structures that give campaigns satisfying momentum.',
    userPromptTemplate:
      'For a campaign centered on: "{concept}"\n\nOutline a complete three-act story arc:\n\n**Act 1 – The Hook (Sessions 1-3)**\nHow do the players get drawn in? What inciting incident starts the adventure?\n\n**Act 2 – Escalation (Sessions 4-8)**\nWhat challenges, revelations, and setbacks occur? What twists raise the stakes?\n\n**Act 3 – Climax & Resolution (Sessions 9-12)**\nWhat is the final confrontation? What does victory look like? What does failure mean?\n\nInclude 2-3 major milestone moments per act.',
  },
  {
    id: 'npcs',
    title: '🧙 Key NPCs',
    systemPrompt:
      'You are a character designer for tabletop RPG campaigns. Create memorable, three-dimensional non-player characters that enhance the story.',
    userPromptTemplate:
      'For a campaign centered on: "{concept}"\n\nCreate 5-6 key NPCs the players will encounter:\n\nFor each NPC include:\n- **Name & Role** (ally, antagonist, neutral, merchant, quest giver, etc.)\n- **Brief Description** (appearance, demeanor)\n- **Motivation** (what do they want?)\n- **Secret** (what are they hiding?)\n- **Hook** (how do they connect to the main conflict?)\n\nMake each NPC memorable and useful across multiple sessions.',
  },
  {
    id: 'locations',
    title: '🏰 Key Locations',
    systemPrompt:
      'You are a dungeon master and location designer for tabletop RPG campaigns. Create atmospheric, detail-rich locations.',
    userPromptTemplate:
      'For a campaign centered on: "{concept}"\n\nDesign 5-6 key locations the players will visit:\n\nFor each location include:\n- **Name & Type** (dungeon, city, wilderness, etc.)\n- **Atmosphere** (what does it look, sound, smell like?)\n- **Key Features** (what makes it unique or dangerous?)\n- **Inhabitants** (who or what lives/lurks here?)\n- **Plot Significance** (why do the players need to come here?)\n\nInclude at least one safe haven and one dangerous dungeon/encounter area.',
  },
  {
    id: 'encounters',
    title: '🎲 Encounters & Sessions',
    systemPrompt:
      'You are an experienced tabletop RPG game master. Design engaging, varied encounters that balance combat, exploration, and roleplay.',
    userPromptTemplate:
      'For a campaign centered on: "{concept}"\n\nDesign 8-10 varied encounter ideas across the campaign:\n\nFor each encounter:\n- **Encounter Name**\n- **Type** (combat, social, exploration, puzzle, moral dilemma)\n- **Setup** (what situation do the players walk into?)\n- **Complication** (what makes this harder than expected?)\n- **Stakes** (what do they gain/lose?)\n\nEnsure a mix of combat-heavy, roleplay-heavy, and environmental/exploration encounters.',
  },
  {
    id: 'hooks',
    title: '🪝 Plot Hooks & Twists',
    systemPrompt:
      'You are a master plotter for tabletop RPG campaigns. Create surprising revelations, dramatic twists, and compelling hooks that keep players engaged.',
    userPromptTemplate:
      'For a campaign centered on: "{concept}"\n\nGenerate:\n\n**5 Opening Hooks** – Different ways to introduce this campaign to various player groups (mercenaries, heroes, criminals, scholars, etc.)\n\n**4 Mid-Campaign Revelations** – Surprising truths that flip assumptions and raise stakes\n\n**3 Dramatic Twists** – Major story reversals that could happen in the final act\n\n**2 Alternate Endings** – How the campaign might resolve differently based on player choices\n\nMake each hook and twist feel earned and surprising.',
  },
];
