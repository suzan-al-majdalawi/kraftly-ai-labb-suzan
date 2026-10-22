import ConsumptionChart from './ConsumptionChart.vue'

export default {
  title: 'Komponenter/ConsumptionChart',
  component: ConsumptionChart,
  tags: ['autodocs'],
  // Diagrammet ritas en gång när komponenten monteras – ändrade args under Controls
  // syns först när storyn laddas om.
  decorators: [() => ({ template: '<div style="max-width: 640px"><story /></div>' })]
}

export const TolvManader = {
  name: 'Tolv månader',
  args: {
    months: ['Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun'],
    values: [210, 195, 260, 340, 520, 680, 730, 640, 470, 320, 240, 205]
  }
}
