<template>
  <div class="locale-changer" @change="changeLocale">
    <select v-model="$i18n.locale">
      <option value="es">Español</option>
      <option value="en">English</option>
      <option value="fr">Français</option>
      <option value="de">Deutsch</option>
      <option value="gl">Galego</option>
    </select>
  </div>
</template>
<script>
export default {
  methods: {
    changeLocale(event) {
      const selected = event.target.value
      this.$i18n.locale = selected
      localStorage.setItem('locale', selected)
    },
  },
}
</script>
<style scoped>
select {
  display: block;
}
.locale-changer {
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  display: flex;
}
</style>
