# MiYard

A house-management app for your property, projects, tradespeople and important paperwork. Built with React and Vite, with a structured document register, a record inspector and a responsive white, charcoal and teal interface.

## Features

- Property details, rooms and areas, projects, tradespeople, and maintenance records.
- Document categories for ownership, insurance, certificates, plans and warranties.
- Add, edit, delete, search, sort and filter records.
- Assign tradespeople to projects and maintenance tasks; link documents to areas and projects.
- Insurance policy details, renewal dates, premiums and excesses.
- Attach files up to 25 MB, preview images and PDFs, and download originals.
- Local IndexedDB storage for records and original uploaded files.
- Complete JSON backup and atomic restore, including attachments.

## Run locally

Requires Node.js 20.19+ or 22.12+ and npm.

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 4173 --strictPort
```

Open http://127.0.0.1:4173/.

Build and preview the production version:

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

The client build is in `dist/client`. The build also prepares an optional Worker entry point for later Sites hosting. No credentials or API keys are required for local use.

## Storage and backups

MiYard currently runs as a single-browser local workspace. There is no sign-in, server database, multi-device synchronisation, online backup or automatic reminder delivery. Insurance and maintenance dates are stored for reference.

Records and uploaded files remain in the browser's IndexedDB database. They are **not part of this repository**. Browser site-data clearing removes that local data. Storage is specific to the browser and origin, including the hostname and port.

Use **Storage & backup** to download a complete backup regularly. Backups contain your documents and are not encrypted. Backup imports currently have a 200 MB limit. Previous Hearth-format backups remain compatible; the internal database identity is retained to preserve existing records after the MiYard rename.

## Example records

The first run includes labelled example records. Remove them with **Example records included** in the footer. Edited example records are kept as your own records. The generated floor-plan thumbnail is illustrative, not a drawing of your property.

## Tests

```sh
node --test tests/data.test.mjs
npm run test:sites
```

The data tests cover backup validation, missing attachments, duplicate IDs, invalid fields and amounts, binary restoration and date formatting. Browser verification covered record creation, reload persistence, contact/project links, document upload and image preview, complete backup and restore, insurance dates, maintenance completion and responsive layouts.

## Stack

React 19 · Vite 6 · Inter · Phosphor Icons · IndexedDB
