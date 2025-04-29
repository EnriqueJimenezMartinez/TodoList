<template>
  <footer class="age-footer black custom-footer">
    <div class="container">
      <div class="row">
        <div class="col l6 s12">
          <p class="grey-text text-lighten-4">
            Proyecto de gestión de listas de tareas hecho por Enrique Jiménez.
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
                <i class="material-icons left">code</i>
                Mi GitHub
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
