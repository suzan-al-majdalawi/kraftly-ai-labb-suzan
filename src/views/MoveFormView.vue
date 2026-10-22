<template>
  <div>
    <h1>Flyttanmälan</h1>
    <form class="card" style="max-width:560px" novalidate @submit.prevent="submit">
      <p style="margin-bottom:14px">Fyll i uppgifterna nedan så flyttar vi ditt elavtal.</p>

      <KField id="address" v-model="form.address" label="Ny adress" type="text" autocomplete="street-address" :error="errors.address" />
      <KField id="zip" v-model="form.zip" label="Postnummer" type="text" inputmode="numeric" autocomplete="postal-code" :error="errors.zip" />
      <KField id="city" v-model="form.city" label="Ort" type="text" autocomplete="address-level2" :error="errors.city" />
      <KField id="date" v-model="form.date" label="Inflyttningsdatum (ÅÅÅÅ-MM-DD)" type="text" :error="errors.date" />

      <!-- Listan är ingen KField (KField är bara textfält) men får samma koppling för fel -->
      <label for="contract" class="select-label">Avtal</label>
      <select
        id="contract"
        v-model="form.contract"
        :aria-invalid="errors.contract ? 'true' : undefined"
        :aria-describedby="errors.contract ? 'contract-error' : undefined"
      >
        <option disabled value="">Välj avtal</option>
        <option>Rörligt pris</option>
        <option>Fast pris 1 år</option>
        <option>Fast pris 3 år</option>
      </select>
      <p v-if="errors.contract" id="contract-error" class="field-error">{{ errors.contract }}</p>

      <ul v-if="errorList.length" role="alert" class="errors">
        <li v-for="msg in errorList" :key="msg">{{ msg }}</li>
      </ul>

      <KButton type="submit">Skicka flyttanmälan</KButton>
      <p class="hint" style="margin-top:8px">Anmälan måste göras senast 14 dagar före flytt</p>
      <!-- Live region: finns i DOM:en från start (tom), så att skärmläsaren läser upp texten när den dyker upp -->
      <p role="status" class="success"><template v-if="reference">Tack! Referensnummer: {{ reference }}</template></p>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import KButton from '../components/KButton.vue'
import KField from '../components/KField.vue'
import { submitMove } from '../services/api'
import { validateMove } from '../utils/validateMove'

const form = reactive({ address: '', zip: '', city: '', date: '', contract: '' })
const reference = ref(null)
const errors = ref({})

const errorList = computed(() => Object.values(errors.value))

const submit = async () => {
  errors.value = validateMove(form)
  if (errorList.value.length) return
  const res = await submitMove(form)
  reference.value = res.ref
}
</script>

<style scoped>
.select-label { display: block; font-size: 13px; color: #5c6679; margin: 10px 0 4px; }
.field-error { color: #b42318; font-size: 13px; margin: -8px 0 12px; }
.errors { color: #d92d20; margin: 8px 0 12px 18px; font-size: 14px; }
.success { color: #067647; margin-top: 10px; } /* 5,7:1 mot vitt (var #12b76a, 2,6:1) */
</style>
