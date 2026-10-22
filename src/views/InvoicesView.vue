<template>
  <div>
    <h1>Fakturor</h1>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <!-- Kunden ska se att listan är förkortad, inte tro att fakturor saknas -->
    <p v-if="invoices.length" class="hint">Visar {{ visibleInvoices.length }} av {{ invoices.length }} fakturor, senaste först.</p>
    <div class="card">
      <table>
        <caption class="visually-hidden">Dina fakturor</caption>
        <thead>
          <!-- scope="col": rubriken gäller kolumnen under. En skärmläsare läser "Belopp, 512 kr" i stället för bara "512 kr". -->
          <tr>
            <th scope="col">Faktura</th>
            <th scope="col">Period</th>
            <th scope="col">Belopp</th>
            <th scope="col">Förfaller</th>
            <th scope="col">Status</th>
            <th scope="col"><span class="visually-hidden">Åtgärd</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in visibleInvoices" :key="invoice.id">
            <td>{{ invoice.id }}</td>
            <td>{{ invoice.period }}</td>
            <td>{{ invoice.amount }} kr</td>
            <td>{{ invoice.due }}</td>
            <td><StatusChip :invoice="invoice" /></td>
            <td>
              <!-- "Ladda ner" står på varje rad. Den dolda texten gör att en skärmläsare hör vilken faktura. -->
              <KButton variant="text" @click="downloadInvoice(invoice)">
                Ladda ner <span class="visually-hidden">faktura {{ invoice.id }}</span>
              </KButton>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!showAll && invoices.length > PAGE_SIZE" class="btn show-all" @click="showAll = true">
        Visa alla {{ invoices.length }} fakturor
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import _ from 'lodash'
import { fetchInvoices } from '../services/api'
import StatusChip from '../components/StatusChip.vue'
import KButton from '../components/KButton.vue'

const invoices = ref([])
const error = ref(null)

// Snabbare lista: sortera en gång och rendera bara de senaste tills kunden ber om fler
const PAGE_SIZE = 6
const showAll = ref(false)
const sortedInvoices = computed(() => _.orderBy(invoices.value, ['due'], ['desc']))
const visibleInvoices = computed(() =>
  showAll.value ? sortedInvoices.value : _.take(sortedInvoices.value, PAGE_SIZE)
)

onMounted(async () => {
  try {
    invoices.value = await fetchInvoices()
  } catch {
    error.value = 'Vi kunde inte hämta dina fakturor just nu. Försök igen om en stund.'
  }
})

const downloadInvoice = (invoice) => {
  // PDF generation coming in phase 2 per the quote
  console.log('download', invoice.id)
  alert('Nedladdning kommer snart')
}
</script>

<style scoped>
.error { color: #d92d20; margin-bottom: 12px; }
.show-all { margin-top: 12px; color: #2f54eb; font-weight: 600; cursor: pointer; }
</style>
