<template>
  <!-- Ett diagram är en bild för en skärmläsare. role="img" + aria-label ger den siffrorna som text. -->
  <canvas ref="canvas" height="120" role="img" :aria-label="summary"></canvas>
</template>

<script setup>
// Bara det vi ritar: ett stapeldiagram. chart.js/auto registrerar alla diagramtyper och plugins.
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({ months: Array, values: Array })

const summary = computed(
  () =>
    'Förbrukning per månad i kWh: ' +
    (props.months ?? []).map((month, i) => `${month} ${props.values?.[i]}`).join(', ')
)
const canvas = ref(null)
let chart = null

onMounted(() => {
  chart = new Chart(canvas.value, {
    type: 'bar',
    data: {
      labels: props.months,
      datasets: [{
        label: 'Förbrukning (kWh)',
        data: props.values,
        backgroundColor: '#2f54eb',
        borderRadius: 4
      }]
    },
    options: { plugins: { legend: { display: false } } }
  })
})

onBeforeUnmount(() => {
  if (chart) chart.destroy()
})
</script>
