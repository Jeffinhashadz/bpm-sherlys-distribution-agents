# Sherlys Business OS — Business Operations & Automation Blueprint

Static presentation site for Sherlys Distribution & Agents. It explains the six operational modules, the gaps between them, the interactive workflows, the planned ERP architecture, and the release sequence.

This site is not the operational ERP. It does not connect to Tally, Supabase, or a database. Blueprint content lives in typed files under `src/data`.

## Scripts

```bash
npm install
npm run dev
npm test
npm run build
npm run preview
```

The production build writes to `dist`.

## Netlify

`netlify.toml` builds with `npm run build` and publishes `dist`. A SPA redirect sends every path to `index.html`, so a refresh on `/modules/order-to-delivery` still loads the app.

1. Push the repository to the Git host Netlify will read.
2. Create a Netlify site from that repository.
3. Leave the build command and publish directory as set in `netlify.toml`.
4. Deploy. No environment variables are required for this presentation build.

## Source documents

The content is grounded in the six Excel prototypes and user manuals for Order to Delivery, Damage Management, Stock Receiving, Daily Stock Verification, Admin Dashboard, and Accounts & TallyPrime. See `docs/source-mapping.md`.

Labels in the interface distinguish documented manual text, identified gaps, proposed controls, and items that still need confirmation.

## Stack

React 19, TypeScript, Vite, Tailwind CSS, React Router, React Flow, Dagre, Mermaid, and Lucide. Mermaid diagrams are generated from the same flow data as the interactive diagram. Mermaid is initialized with `securityLevel: 'strict'`.
