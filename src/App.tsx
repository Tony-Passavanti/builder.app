import { useMemo, useState } from 'react'
import './App.css'
import TemplateBuilder, { type Template } from './components/TemplateBuilder'

const MENU_ITEMS = ['Log Workout', 'Workout History']

function App() {
  const [isPrompting, setIsPrompting] = useState(false)
  const [usernameInput, setUsernameInput] = useState('')
  const [username, setUsername] = useState<string | null>(null)
  const [view, setView] = useState<'menu' | 'builder'>('menu')
  const [templates, setTemplates] = useState<Template[]>([])
  const [activeTemplate, setActiveTemplate] = useState<Template | null>(null)

  const loggedIn = username !== null
  const userTemplates = useMemo(
    () => templates.filter((template) => template.userId === username),
    [templates, username],
  )

  const handleLoginClick = () => {
    if (!isPrompting) {
      setIsPrompting(true)
      return
    }

    const trimmed = usernameInput.trim()
    if (!trimmed) return

    setUsername(trimmed)
    setIsPrompting(false)
  }

  const handleCreateTemplate = () => {
    if (!username) return
    const now = new Date().toISOString()
    const newTemplate: Template = {
      id: `template-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: '',
      blocks: [],
      userId: username,
      createdAt: now,
      updatedAt: now,
    }
    setActiveTemplate(newTemplate)
    setView('builder')
  }

  const handleOpenTemplate = (templateId: string) => {
    const existing = templates.find((template) => template.id === templateId)
    if (!existing) return
    setActiveTemplate(existing)
    setView('builder')
  }

  const handleSaveTemplate = (template: Template) => {
    setTemplates((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === template.id)
      if (existingIndex === -1) {
        return [...prev, template]
      }
      const next = [...prev]
      next[existingIndex] = template
      return next
    })
    setActiveTemplate(template)
    setView('menu')
  }

  const handleExitBuilder = () => {
    setView('menu')
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      handleLoginClick()
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-spacer" aria-hidden="true" />
        <h1 className="app__title">BUILDER.APP</h1>
        <div className="app__user">
          {loggedIn ? <span className="user-chip">{username}</span> : null}
        </div>
      </header>

      <main className="app__main">
        {!loggedIn ? (
          <section className="login">
            {isPrompting ? (
              <label className="login__label">
                Username
                <input
                  className="login__input"
                  type="text"
                  placeholder="Enter your username"
                  value={usernameInput}
                  onChange={(event) => setUsernameInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              </label>
            ) : null}

            {!isPrompting ? (
              <button className="primary-button" onClick={handleLoginClick}>
                Login
              </button>
            ) : null}

            {isPrompting ? (
              <p className="login__hint">Enter a username, then press Enter.</p>
            ) : null}
          </section>
        ) : view === 'menu' ? (
          <section className="menu-screen">
            <nav className="menu" aria-label="Primary">
              <button
                className="menu__item"
                type="button"
                onClick={handleCreateTemplate}
              >
                Create Template
              </button>
              {MENU_ITEMS.map((item) => (
                <button className="menu__item" key={item} type="button">
                  {item}
                </button>
              ))}
            </nav>

            <section className="templates" aria-label="Saved templates">
              <div className="templates__header">
                <h2>Saved Workout Templates</h2>
                <span>{userTemplates.length} total</span>
              </div>
              {userTemplates.length === 0 ? (
                <p className="templates__empty">No templates yet. Create your first one.</p>
              ) : (
                <div className="templates__list">
                  {userTemplates.map((template) => (
                    <button
                      className="templates__item"
                      key={template.id}
                      type="button"
                      onClick={() => handleOpenTemplate(template.id)}
                    >
                      <div>
                        <strong>{template.name}</strong>
                        <span>{template.blocks.length} blocks</span>
                      </div>
                      <span className="templates__action">Open</span>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </section>
        ) : activeTemplate ? (
          <TemplateBuilder
            template={activeTemplate}
            onSave={handleSaveTemplate}
            onExit={handleExitBuilder}
          />
        ) : null}
      </main>
    </div>
  )
}

export default App
