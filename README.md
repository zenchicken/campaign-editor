# Campaign Editor

An AI-powered tabletop RPG campaign generator built with React, TypeScript, and Vite.

## What it does

Campaign Editor helps game masters design rich, detailed RPG campaigns using generative AI. Enter a high-level campaign concept and the app walks you through generating:

- 📜 **Campaign Title & Tagline**
- 🌍 **World & Setting**
- ⚔️ **Main Conflict & Antagonist**
- 🗺️ **Story Arc** (three-act structure)
- 🧙 **Key NPCs** with motivations and secrets
- 🏰 **Key Locations** with atmosphere and plot significance
- 🎲 **Encounters & Sessions** with varied encounter types
- 🪝 **Plot Hooks & Twists** for player engagement

Each section is AI-generated but fully editable — add your own GM notes and regenerate any section as needed. Export your campaign as a printable summary.

## Getting started

You need an [OpenAI API key](https://platform.openai.com/api-keys) to use the app.

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Development

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run lint      # Lint
npm test          # Run tests
```

## Tech stack

- **React 19** + **TypeScript**
- **Vite** for bundling
- **OpenAI SDK** (gpt-4o-mini) for AI generation
- **Vitest** + **React Testing Library** for tests
