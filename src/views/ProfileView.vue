<template>
  <div>
    <h1>Mina uppgifter</h1>
    <div class="card" style="max-width:560px" v-if="store.user">
      <div class="field">
        <span class="field-label">Kundnummer</span>
        <span>{{ store.user.customerNo }}</span>
      </div>
      <KField v-model="name" label="Namn" type="text" autocomplete="name" />
      <KField v-model="email" label="E-postadress" type="email" autocomplete="email" />
      <KField v-model="address" label="Adress" type="text" autocomplete="street-address" />
      <div class="actions">
        <KButton @click="save">Spara ändringar</KButton>
        <KButton variant="secondary" @click="reset">Ångra</KButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import KButton from '../components/KButton.vue'
import KField from '../components/KField.vue'
import { useUserStore } from '../stores/user'

const store = useUserStore()
const name = ref('')
const email = ref('')
const address = ref('')

const reset = () => {
  name.value = store.user.name
  email.value = store.user.email
  address.value = store.user.address
}

const save = () => {
  store.save({ name: name.value, email: email.value, address: address.value })
}

onMounted(async () => {
  if (!store.user) await store.load()
  reset()
})
</script>

<style scoped>
.field { display: flex; justify-content: space-between; padding: 8px 0 14px; font-size: 14px; }
.field-label { color: #5c6679; }
.actions { display: flex; gap: 10px; }
</style>
