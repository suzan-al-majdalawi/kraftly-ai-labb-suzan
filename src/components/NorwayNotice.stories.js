import NorwayNotice from './NorwayNotice.vue'

// Kortet syns bara när flaggan norway är på. Flaggan läses från window.__KRAFTLY__ när
// komponenten skapas – beforeEach sätter den före varje story och städar efteråt.
const withFlag = (on) => () => {
  window.__KRAFTLY__ = { env: 'storybook', features: { norway: on } }
  return () => delete window.__KRAFTLY__
}

export default {
  title: 'Komponenter/NorwayNotice',
  component: NorwayNotice,
  tags: ['autodocs']
}

export const FlagganPa = { name: 'Flaggan på', beforeEach: withFlag(true) }

export const FlagganAv = { name: 'Flaggan av (visar ingenting)', beforeEach: withFlag(false) }
