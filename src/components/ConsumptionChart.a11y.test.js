import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/vue'
import { axe } from 'jest-axe'
import ConsumptionChart from './ConsumptionChart.vue'

// jsdom har ingen canvas – Chart.js mockas, vi testar bara textalternativet.
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

describe('ConsumptionChart – tillgänglighet', () => {
  it('har siffrorna som text för en skärmläsare', () => {
    render(ConsumptionChart, { props: { months: ['Jan', 'Feb'], values: [730, 640] } })
    expect(screen.getByRole('img', { name: 'Förbrukning per månad i kWh: Jan 730, Feb 640' })).toBeInTheDocument()
  })

  it('har inga axe-överträdelser', async () => {
    const { container } = render(ConsumptionChart, { props: { months: ['Jan'], values: [730] } })
    expect(await axe(container)).toHaveNoViolations()
  })
})
