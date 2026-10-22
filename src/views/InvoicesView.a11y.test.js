import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { axe } from 'jest-axe'
import InvoicesView from './InvoicesView.vue'

vi.mock('../services/api', () => ({
  fetchInvoices: vi.fn().mockResolvedValue([
    { id: 'F-2026-06', period: 'Juni 2026', amount: 512, due: '2026-06-30', status: 'Betald' }
  ])
}))

describe('InvoicesView – tillgänglighet', () => {
  it('har inga axe-överträdelser', async () => {
    const { container } = render(InvoicesView)
    await screen.findByText('F-2026-06') // vänta tills raderna finns
    expect(await axe(container)).toHaveNoViolations()
  })

  it('Ladda ner är en knapp som säger vilken faktura den gäller', async () => {
    render(InvoicesView)
    expect(await screen.findByRole('button', { name: 'Ladda ner faktura F-2026-06' })).toBeInTheDocument()
  })

  // axe klagar inte på en enkel tabell utan scope – browsern gissar oftast rätt. Vi testar det vi vill ha.
  it('kolumnrubrikerna gäller sina kolumner', async () => {
    render(InvoicesView)
    expect(await screen.findByRole('columnheader', { name: 'Belopp' })).toHaveAttribute('scope', 'col')
  })
})
