import { useState } from 'react'
import './App.css'

const MENU_ITEMS = ['Create Template', 'Log Workout', 'Workout History']

function App() {
  const [isPrompting, setIsPrompting] = useState(false)
  const [usernameInput, setUsernameInput] = useState('')
  const [username, setUsername] = useState<string | null>(null)

  const loggedIn = username !== null

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

            <button className="primary-button" onClick={handleLoginClick}>
              Login
            </button>

            {isPrompting ? (
              <p className="login__hint">Enter a username, then click Login again.</p>
            ) : null}
          </section>
        ) : (
          <nav className="menu" aria-label="Primary">
            {MENU_ITEMS.map((item) => (
              <button className="menu__item" key={item} type="button">
                {item}
              </button>
            ))}
          </nav>
        )}
      </main>
    </div>
  )
}

export default App
