import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import KField from './KField.vue'

describe('KField', () => {
  it('har en label som är kopplad till fältet', () => {
    render(KField, { props: { label: 'E-postadress' }, attrs: { type: 'email' } })
    expect(screen.getByLabelText('E-postadress')).toHaveAttribute('type', 'email')
  })

  it('klick på labeln ger fältet fokus', async () => {
    const user = userEvent.setup()
    render(KField, { props: { label: 'Ort' } })
    await user.click(screen.getByText('Ort'))
    expect(screen.getByLabelText('Ort')).toHaveFocus()
  })

  it('kopplar hjälptexten med aria-describedby', () => {
    render(KField, { props: { label: 'Inflyttningsdatum', hint: 'Skriv som ÅÅÅÅ-MM-DD' } })
    expect(screen.getByLabelText('Inflyttningsdatum')).toHaveAccessibleDescription('Skriv som ÅÅÅÅ-MM-DD')
  })

  it('markerar fel med aria-invalid och läser upp felet', () => {
    render(KField, { props: { label: 'Postnummer', error: 'Postnummer ska vara fem siffror' } })
    const input = screen.getByLabelText('Postnummer')
    expect(input).toBeInvalid()
    expect(input).toHaveAccessibleDescription('Postnummer ska vara fem siffror')
  })

  it('är inte markerat som fel när det inte finns något fel', () => {
    render(KField, { props: { label: 'Postnummer' } })
    expect(screen.getByLabelText('Postnummer')).not.toHaveAttribute('aria-invalid')
  })

  it('har inga axe-överträdelser, med hjälptext och fel', async () => {
    const { container } = render(KField, {
      props: { label: 'Postnummer', hint: 'Fem siffror', error: 'Postnummer ska vara fem siffror' }
    })
    expect(await axe(container)).toHaveNoViolations()
  })
})
