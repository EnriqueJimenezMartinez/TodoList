<template>
  <li class="valign-wrapper" :class="{ done: isDone }" style="margin-bottom: 10px; display: flex; justify-content: space-between;">
    <label class="flex-grow-1" style="margin: 0;">
      <input type="checkbox" class="filled-in" v-model="isDone" />
      <span>{{ tarea }}</span>
    </label>
    <a
      class="btn-floating btn-small waves-effect waves-light red tooltipped"
      :data-tooltip="'Borrar Tarea: ' + tarea"
      data-position="bottom"
      @click="borrarTarea"
    >
      <i class="material-icons">delete</i>
    </a>
  </li>
</template>





<script>
import M from 'materialize-css'
export default {
  props: {
    tarea: String,
    index: Number,
  },
  data() {
    return {
      isDone: false,
    }
  },
  mounted() {
    M.Tooltip.init(document.querySelectorAll('.tooltipped'), {})
    M.Modal.init(document.querySelectorAll('.modal'), {})

    const savedTareas = localStorage.getItem(`tareas_${this.id}`)
    if (savedTareas) {
      this.tareas = JSON.parse(savedTareas)
    }
  },

  methods: {
    borrarTarea() {
      const tooltipElems = document.querySelectorAll('.tooltipped')
      tooltipElems.forEach((elem) => {
        const instance = M.Tooltip.getInstance(elem)
        if (instance) instance.destroy()
      })
      this.$emit('borrarTarea', this.index)
    },
  },
}
</script>

<style scoped>
.done {
  text-decoration: line-through;
  opacity: 0.6;
}
</style>
