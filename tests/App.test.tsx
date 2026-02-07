import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'

describe('login flow', () => {
  it('prompts for username on first click and logs in on second', async () => {
    const user = userEvent.setup()

    render(<App />)

    const loginButton = screen.getByRole('button', { name: /login/i })
    expect(screen.queryByLabelText(/username/i)).toBeNull()

    await user.click(loginButton)
    const input = screen.getByLabelText(/username/i)
    expect(input).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /login/i })).toBeNull()

    await user.type(input, 'Tony{enter}')

    expect(screen.getByText('Tony')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create template/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /login/i })).toBeNull()
  })
})
