import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { createTestingPinia } from '@pinia/testing'
import { axe } from 'jest-axe'
import DashboardView from './DashboardView.vue'

vi.mock('chart.js', () => ({
  Chart: class ChartMock {
    static register() {}
    destroy() {}
  },
  BarController: {},
  BarElement: {},
  CategoryScale: {},
  LinearScale: {},
  Tooltip: {}
}))

const renderDashboard = () =>
  render(DashboardView, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            user: { user: { name: 'Anna Andersson', contract: 'Rörligt pris' } },
            consumption: { data: { pricePerKwh: 1.42, months: ['Jan', 'Feb'], values: [310, 280] } }
          },
          createSpy: vi.fn
        })
      ]
    }
  })

describe('DashboardView – tillgänglighet', () => {
  it('har inga axe-överträdelser', async () => {
    const { container } = renderDashboard()
    expect(await axe(container)).toHaveNoViolations()
  })

  // axe var grönt även när "Fler spartips" var en <div> med @click – en div har ingen roll
  // som axe kan kontrollera. getByRole('button') hittar bara riktiga knappar.
  it('Fler spartips är en knapp', () => {
    renderDashboard()
    expect(screen.getByRole('button', { name: 'Fler spartips' })).toBeInTheDocument()
  })
})
