<template>
  <footer class="age-footer black custom-footer">
    <div class="container">
      <div class="row">
        <div class="col l6 s12">
          <p class="grey-text text-lighten-4">
            {{ $t('message.footText') }}
          </p>
        </div>
        <div class="col l4 offset-l2 s12">
          <ul>
            <li>
              <a
                class="btn-small grey darken-3 waves-effect"
                href="https://github.com/EnriqueJimenezMartinez"
                target="_blank"
              >
                <i class="bi bi-github"></i>
                {{ $t('message.github') }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
}
</script>

<style scoped>
.custom-footer {
  padding: 10px 0;
  font-size: 0.9rem;
}
</style>
