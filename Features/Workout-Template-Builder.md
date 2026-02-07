# Workout Template Builder

## Summary
A canvas-style builder where users assemble a workout template that can be saved and later used to complete templated workouts.

## Goals
- Provide a flexible, visual way to build workout templates.
- Enable saving a template for later use.

## Non-Goals (for now)
- Advanced analytics or coaching logic.
- Sharing templates between users.

## User Stories
- As a user, I can create a workout template by adding and arranging exercise and rest blocks.
- As a user, I can edit a workout template (rename, reorder, adjust exercise and rest details).
- As a user, I can save the template for later use.
- As a user, I can reopen a saved template and continue editing.

## Core Use Cases
1. Create a new template from scratch.
2. Add blocks to the canvas (exercise, rest).
3. Reorder or remove blocks.
4. Save the template with a name.
5. Load and edit an existing template.

## Acceptance Criteria
- A user can create a new template and add at least one block to the canvas.
- The Template Builder canvas loads when the user clicks a "Create Template" button.
- A user can edit exercise details (name, sets, target reps per set, notes).
- A user can edit rest timer duration.
- A user can reorder or delete blocks.
- A user can save a template with a required name.
- A user can reopen a saved template and see the same structure and values.
- Validation errors are shown for missing required fields.
- Each exercise has at least one set.
- Target reps default to 10 for new exercise sets.
- Sets have a maximum of 6.
- Rest timers default to 60 seconds.
- Rest timers must be greater than 0 seconds; a 0 value removes the rest block.
- Drag-and-drop reordering works on mobile web.
- The template name is editable at the top of the canvas.
- A remove control (e.g., "x") is available on each block.
- A "+" control at the bottom prompts for Exercise or Rest.
- A Save button at the bottom saves the template into local in-memory storage.

## Data (Draft)
Template
- id: string
- name: string
- blocks: Block[]
- createdAt: string
- updatedAt: string
- userId: string

Block (type-specific)
- id: string
- type: "exercise" | "rest"
- name: string
- sets?: number
- reps?: number
- durationSec?: number
- notes?: string

## UX Notes (Draft)
- Canvas with vertical list of blocks; drag and drop to reorder.
- Add block button to insert exercise or rest blocks.
- Inline editing for block fields.
- Save button disabled until valid.
- Primary target is mobile web, so drag handles and hit targets should be touch-friendly.
- Editable template name at the top of the canvas.
- Each block has a visible remove control.
- "+" button at the bottom opens a choice (Exercise or Rest).
- Save button at the bottom persists to local in-memory storage.

## Open Questions
- Should the canvas support sections or groups (e.g., warmup, main, finisher)?

## Dependencies / Risks
- Need persistence layer for saving templates (local storage or backend).
- Ensure validation rules are defined clearly for each block type.
