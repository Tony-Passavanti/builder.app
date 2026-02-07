import { useEffect, useMemo, useState } from 'react'

type ExerciseBlock = {
  id: string
  type: 'exercise'
  name: string
  sets: number
  reps: number
  notes: string
  restBetweenSetsSec: number
}

type RestBlock = {
  id: string
  type: 'rest'
  name: string
  durationSec: number
}

type Block = ExerciseBlock | RestBlock

type DraftExerciseBlock = {
  id: string
  type: 'exercise'
  name: string
  setsInput: string
  repsInput: string
  notes: string
  restBetweenSetsInput: string
}

type DraftRestBlock = {
  id: string
  type: 'rest'
  name: string
  durationInput: string
}

type DraftBlock = DraftExerciseBlock | DraftRestBlock

export type Template = {
  id: string
  name: string
  blocks: Block[]
  createdAt: string
  updatedAt: string
  userId: string
}

type TemplateBuilderProps = {
  template: Template
  onSave: (template: Template) => void
  onExit: () => void
}

const MAX_SETS = 6

const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`

const createExerciseBlock = (): ExerciseBlock => ({
  id: createId('exercise'),
  type: 'exercise',
  name: '',
  sets: 1,
  reps: 10,
  notes: '',
  restBetweenSetsSec: 60,
})

const createRestBlock = (): RestBlock => ({
  id: createId('rest'),
  type: 'rest',
  name: 'Rest',
  durationSec: 60,
})

const reorderBlocks = (blocks: DraftBlock[], fromId: string, toId: string) => {
  if (fromId === toId) return blocks
  const fromIndex = blocks.findIndex((block) => block.id === fromId)
  const toIndex = blocks.findIndex((block) => block.id === toId)
  if (fromIndex === -1 || toIndex === -1) return blocks
  const next = [...blocks]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

const toDraftBlocks = (blocks: Block[]): DraftBlock[] =>
  blocks.map((block) =>
    block.type === 'exercise'
      ? {
          id: block.id,
          type: 'exercise',
          name: block.name,
          setsInput: String(block.sets),
          repsInput: String(block.reps),
          notes: block.notes,
          restBetweenSetsInput: String(block.restBetweenSetsSec),
        }
      : {
          id: block.id,
          type: 'rest',
          name: block.name,
          durationInput: String(block.durationSec),
        },
  )

const toTemplateBlocks = (blocks: DraftBlock[]): Block[] =>
  blocks.map((block) =>
    block.type === 'exercise'
      ? {
          id: block.id,
          type: 'exercise',
          name: block.name.trim(),
          sets: Number.parseInt(block.setsInput, 10),
          reps: Number.parseInt(block.repsInput, 10),
          notes: block.notes,
          restBetweenSetsSec: Number.parseInt(block.restBetweenSetsInput, 10),
        }
      : {
          id: block.id,
          type: 'rest',
          name: block.name,
          durationSec: Number.parseInt(block.durationInput, 10),
        },
  )

function TemplateBuilder({ template, onSave, onExit }: TemplateBuilderProps) {
  const [name, setName] = useState(template.name)
  const [blocks, setBlocks] = useState<DraftBlock[]>(toDraftBlocks(template.blocks))
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [dragOverId, setDragOverId] = useState<string | null>(null)

  useEffect(() => {
    setName(template.name)
    setBlocks(toDraftBlocks(template.blocks))
  }, [template])

  useEffect(() => {
    if (!draggingId) return

    const handlePointerMove = (event: PointerEvent) => {
      const element = document.elementFromPoint(event.clientX, event.clientY)
      const blockElement = element?.closest('[data-block-id]') as HTMLElement | null
      const nextId = blockElement?.dataset.blockId ?? null
      if (nextId !== dragOverId) {
        setDragOverId(nextId)
      }
    }

    const handlePointerUp = () => {
      if (draggingId && dragOverId) {
        setBlocks((prev) => reorderBlocks(prev, draggingId, dragOverId))
      }
      setDraggingId(null)
      setDragOverId(null)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    window.addEventListener('pointercancel', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerUp)
    }
  }, [draggingId, dragOverId])

  const validation = useMemo(() => {
    const trimmedName = name.trim()
    const templateNameError = trimmedName ? '' : 'Template name is required.'
    const blockErrors = blocks.reduce<Record<string, string>>((acc, block) => {
      if (block.type === 'exercise') {
        if (!block.name.trim()) {
          acc[block.id] = 'Exercise name is required.'
          return acc
        }
        if (!block.setsInput.trim()) {
          acc[block.id] = 'Sets are required.'
          return acc
        }
        if (!/^\d+$/.test(block.setsInput.trim())) {
          acc[block.id] = 'Sets must be a number.'
          return acc
        }
        const setsValue = Number.parseInt(block.setsInput, 10)
        if (setsValue < 1) {
          acc[block.id] = 'Each exercise needs at least 1 set.'
          return acc
        }
        if (setsValue > MAX_SETS) {
          acc[block.id] = `Max sets is ${MAX_SETS}.`
          return acc
        }
        if (!block.repsInput.trim()) {
          acc[block.id] = 'Target reps are required.'
          return acc
        }
        if (!/^\d+$/.test(block.repsInput.trim())) {
          acc[block.id] = 'Target reps must be a number.'
          return acc
        }
        if (!block.restBetweenSetsInput.trim()) {
          acc[block.id] = 'Rest between sets is required.'
          return acc
        }
        if (!/^\d+$/.test(block.restBetweenSetsInput.trim())) {
          acc[block.id] = 'Rest between sets must be a number.'
          return acc
        }
      } else {
        if (!block.durationInput.trim()) {
          acc[block.id] = 'Rest duration is required.'
        } else if (!/^\d+$/.test(block.durationInput.trim())) {
          acc[block.id] = 'Rest duration must be a number.'
        } else if (Number.parseInt(block.durationInput, 10) <= 0) {
          acc[block.id] = 'Rest must be greater than 0 seconds.'
        }
      }
      return acc
    }, {})
    const blocksError =
      blocks.length === 0 ? 'Add at least one block to save a template.' : ''
    const isValid = !templateNameError && !blocksError && Object.keys(blockErrors).length === 0
    return { templateNameError, blockErrors, blocksError, isValid }
  }, [blocks, name])

  const handleAddExercise = () => {
    const block = createExerciseBlock()
    setBlocks((prev) => [
      ...prev,
      {
        id: block.id,
        type: 'exercise',
        name: block.name,
        setsInput: String(block.sets),
        repsInput: String(block.reps),
        notes: block.notes,
        restBetweenSetsInput: String(block.restBetweenSetsSec),
      },
    ])
    setShowAddMenu(false)
  }

  const handleAddRest = () => {
    const block = createRestBlock()
    setBlocks((prev) => [
      ...prev,
      {
        id: block.id,
        type: 'rest',
        name: block.name,
        durationInput: String(block.durationSec),
      },
    ])
    setShowAddMenu(false)
  }

  const handleRemoveBlock = (id: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id))
  }

  const handleSave = () => {
    if (!validation.isValid) return
    const now = new Date().toISOString()
    const updatedTemplate: Template = {
      ...template,
      name: name.trim(),
      blocks: toTemplateBlocks(blocks),
      updatedAt: now,
    }
    onSave(updatedTemplate)
  }

  return (
    <section className="builder" aria-label="Template builder">
      <header className="builder__header">
        <button className="ghost-button" type="button" onClick={onExit}>
          Back
        </button>
        <div className="builder__title">
          <label>
            <span className="builder__label-text">Template Name</span>
            <input
              className={`builder__name ${validation.templateNameError ? 'is-error' : ''}`}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Template name"
            />
          </label>
          {validation.templateNameError ? (
            <span className="builder__error">{validation.templateNameError}</span>
          ) : null}
        </div>
      </header>

      <div className="builder__canvas">
        {blocks.length === 0 ? (
          <div className="builder__empty">
            <p>Add exercise or rest blocks to start building your template.</p>
          </div>
        ) : (
          blocks.map((block) => {
            const error = validation.blockErrors[block.id]
            return (
              <article
                className={`builder__block ${
                  draggingId === block.id ? 'is-dragging' : ''
                } ${dragOverId === block.id ? 'is-over' : ''}`}
                key={block.id}
                data-block-id={block.id}
              >
                <div
                  className="builder__drag"
                  role="button"
                  tabIndex={0}
                  aria-label="Reorder block"
                  onPointerDown={(event) => {
                    event.currentTarget.setPointerCapture(event.pointerId)
                    setDraggingId(block.id)
                    setDragOverId(block.id)
                  }}
                >
                  <span />
                  <span />
                  <span />
                </div>
                <div className="builder__content">
                  {block.type === 'exercise' ? (
                    <>
                      <div className="builder__row">
                        <label>
                          <span className="builder__label-text">Exercise</span>
                          <input
                            type="text"
                            value={block.name}
                            onChange={(event) =>
                              setBlocks((prev) =>
                                prev.map((item) =>
                                  item.id === block.id
                                    ? { ...item, name: event.target.value }
                                    : item,
                                ),
                              )
                            }
                            placeholder="Exercise name"
                          />
                        </label>
                        <label>
                          <span className="builder__label-text">Sets</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={block.setsInput}
                            onChange={(event) => {
                              setBlocks((prev) =>
                                prev.map((item) =>
                                  item.id === block.id
                                    ? {
                                        ...item,
                                        setsInput: event.target.value,
                                      }
                                    : item,
                                ),
                              )
                            }}
                          />
                        </label>
                        <label>
                          <span className="builder__label-text">Target Reps</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={block.repsInput}
                            onChange={(event) => {
                              setBlocks((prev) =>
                                prev.map((item) =>
                                  item.id === block.id
                                    ? {
                                        ...item,
                                        repsInput: event.target.value,
                                      }
                                    : item,
                                ),
                              )
                            }}
                          />
                        </label>
                        <label>
                          <span className="builder__label-text">Rest Between Sets (seconds)</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={block.restBetweenSetsInput}
                            onChange={(event) => {
                              setBlocks((prev) =>
                                prev.map((item) =>
                                  item.id === block.id
                                    ? {
                                        ...item,
                                        restBetweenSetsInput: event.target.value,
                                      }
                                    : item,
                                ),
                              )
                            }}
                          />
                        </label>
                      </div>
                      <label>
                        <span className="builder__label-text">Notes</span>
                        <textarea
                          value={block.notes}
                          onChange={(event) =>
                            setBlocks((prev) =>
                              prev.map((item) =>
                                item.id === block.id
                                  ? { ...item, notes: event.target.value }
                                  : item,
                              ),
                            )
                          }
                          placeholder="Optional cues or reminders"
                        />
                      </label>
                    </>
                  ) : (
                    <div className="builder__row">
                      <label>
                        <span className="builder__label-text">Rest Timer (seconds)</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={block.durationInput}
                          onChange={(event) => {
                            setBlocks((prev) =>
                              prev.map((item) =>
                                item.id === block.id
                                  ? {
                                      ...item,
                                      durationInput: event.target.value,
                                    }
                                  : item,
                              ),
                            )
                          }}
                          onBlur={(event) => {
                            const trimmed = event.target.value.trim()
                            if (!/^\d+$/.test(trimmed)) return
                            const value = Number.parseInt(trimmed, 10)
                            if (value <= 0) {
                              handleRemoveBlock(block.id)
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}
                  {error ? <span className="builder__error">{error}</span> : null}
                </div>
                <button
                  className="builder__remove"
                  type="button"
                  aria-label="Remove block"
                  onClick={() => handleRemoveBlock(block.id)}
                >
                  x
                </button>
              </article>
            )
          })
        )}
      </div>

      {validation.blocksError ? (
        <div className="builder__error builder__error--block">{validation.blocksError}</div>
      ) : null}

      <div className="builder__actions">
        <div className="builder__add">
          <button
            className="ghost-button"
            type="button"
            onClick={() => setShowAddMenu((prev) => !prev)}
          >
            + Add Block
          </button>
          {showAddMenu ? (
            <div className="builder__add-menu">
              <button type="button" onClick={handleAddExercise}>
                Exercise
              </button>
              <button type="button" onClick={handleAddRest}>
                Rest Timer
              </button>
            </div>
          ) : null}
        </div>
        <button
          className="primary-button primary-button--compact"
          type="button"
          onClick={handleSave}
          disabled={!validation.isValid}
        >
          Save Template
        </button>
      </div>
    </section>
  )
}

export default TemplateBuilder

