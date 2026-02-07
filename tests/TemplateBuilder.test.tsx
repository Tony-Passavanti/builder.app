import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../src/App'

const login = async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.click(screen.getByRole('button', { name: /login/i }))
  await user.type(screen.getByLabelText(/username/i), 'Tony{enter}')
  return user
}

describe('workout template builder', () => {
  it('creates and reopens a saved template', async () => {
    const user = await login()

    await user.click(screen.getByRole('button', { name: /create template/i }))
    const templateNameInput = screen.getByLabelText(/template name/i)
    expect(templateNameInput).toBeInTheDocument()
    await user.clear(templateNameInput)
    await user.type(templateNameInput, 'Leg Day')

    await user.click(screen.getByRole('button', { name: /\+ add block/i }))
    await user.click(screen.getByRole('button', { name: /exercise/i }))

    await user.type(screen.getByLabelText(/exercise/i), 'Back Squat')
    const setsInput = screen.getByLabelText(/^sets$/i)
    await user.clear(setsInput)
    await user.type(setsInput, '3')

    const repsInput = screen.getByLabelText(/target reps/i)
    await user.clear(repsInput)
    await user.type(repsInput, '8')

    await user.type(screen.getByLabelText(/notes/i), 'Slow tempo')

    const saveButton = screen.getByRole('button', { name: /save template/i })
    expect(saveButton).toBeEnabled()
    await user.click(saveButton)

    const savedSection = screen.getByRole('region', { name: /saved templates/i })
    expect(within(savedSection).getByText('Leg Day')).toBeInTheDocument()

    await user.click(within(savedSection).getByRole('button', { name: /open/i }))
    expect(screen.getByLabelText(/template name/i)).toHaveValue('Leg Day')
    expect(screen.getByLabelText(/exercise/i)).toHaveValue('Back Squat')
    expect(screen.getByLabelText(/^sets$/i)).toHaveValue('3')
    expect(screen.getByLabelText(/target reps/i)).toHaveValue('8')
    expect(screen.getByLabelText(/notes/i)).toHaveValue('Slow tempo')
  })

  it('removes rest blocks when duration is set to zero', async () => {
    const user = await login()

    await user.click(screen.getByRole('button', { name: /create template/i }))
    await user.click(screen.getByRole('button', { name: /\+ add block/i }))
    await user.click(screen.getByRole('button', { name: /rest timer/i }))

    const restInput = screen.getByLabelText(/rest timer/i)
    await user.clear(restInput)
    await user.type(restInput, '0')
    await user.tab()

    expect(screen.queryByLabelText(/rest timer/i)).toBeNull()
  })
})
