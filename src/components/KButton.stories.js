import KButton from './KButton.vue'

export default {
  title: 'Komponenter/KButton',
  component: KButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'text'] },
    type: { control: 'select', options: ['button', 'submit', 'reset'] }
  },
  // Texten i knappen är en slot. render visar hur en story fyller den.
  render: (args) => ({
    components: { KButton },
    setup: () => ({ args }),
    template: '<KButton v-bind="args">{{ args.label }}</KButton>'
  }),
  args: { label: 'Spara ändringar' }
}

export const Primar = { name: 'Primär', args: { variant: 'primary' } }

export const Sekundar = { name: 'Sekundär', args: { variant: 'secondary', label: 'Ångra' } }

export const Text = { args: { variant: 'text', label: 'Ladda ner' } }

export const HelaBredden = { name: 'Hela bredden', args: { block: true, label: 'Logga in', type: 'submit' } }

export const Inaktiverad = { args: { disabled: true, label: 'Loggar in…' } }
