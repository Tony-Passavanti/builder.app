# Workout Template Builder

## Overview
The Workout Template Builder provides a canvas where a user can assemble a workout template using exercise and rest blocks. Templates are saved to in-memory storage and can be reopened for editing.

## How It Works
- Click `Create Template` from the main menu to open the builder canvas.
- Edit the template name at the top.
- Use `+ Add Block` to add Exercise or Rest Timer blocks.
- Reorder blocks via the drag handle and remove blocks with the `×` button.
- Click `Save Template` to store the template in memory and return to the menu.

## Validation Rules
- Template name is required.
- Exercise name is required.
- Exercise sets must be between 1 and 6.
- Target reps default to 10 for new exercises.
- Rest between sets defaults to 60 seconds per exercise.
- Rest timers default to 60 seconds; setting a rest timer to 0 removes the block.
- Numeric inputs are free-text with validation (no spinner controls).

## Notes
- Storage is in-memory only (not persisted across reloads).
- Drag-and-drop uses pointer events to support mobile web interactions.
