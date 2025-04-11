<template>
  <div class="card">
    <div class="card-content">
      <span class="card-title">{{ title }}</span>

      <div class="input-field">
        <input
          v-model="nuevaTarea"
          type="text"
          placeholder="Nueva tarea"
          @keyup.enter="agregarTarea"
        />
      </div>

      <ul class="collection">
        <Tarea
          v-for="(tarea, index) in tareas"
          :key="index"
          :tarea="tarea"
          :index="index"
          @borrarTarea="borrarTarea"
        />
      </ul>
    </div>
    <div class="card-action">
      <a class="btn-floating btn-small waves-effect waves-light red" @click="borrarLista">
        <i class="material-icons">delete</i>
      </a>
    </div>
  </div>
</template>

<script>
import Tarea from './TodoItem.vue'

export default {
  components: {
    Tarea,
  },
  props: {
    title: String,
    id: [String],
  },
  data() {
    return {
      nuevaTarea: '',
      tareas: [],
    }
  },
  mounted() {
    const savedTareas = localStorage.getItem(`tareas_${this.id}`)
    if (savedTareas) {
      this.tareas = JSON.parse(savedTareas)
    }
  },
  methods: {
    borrarLista() {
      this.$emit('borrarTodoList', this.id)
      localStorage.removeItem(`tareas_${this.id}`)
    },
    agregarTarea() {
      if (this.nuevaTarea.trim() !== '') {
        this.tareas.push(this.nuevaTarea)
        this.guardarTareas()
        this.nuevaTarea = ''
      }
    },
    borrarTarea(index) {
      this.tareas.splice(index, 1)
      this.guardarTareas()
    },
    guardarTareas() {
      localStorage.setItem(`tareas_${this.id}`, JSON.stringify(this.tareas))
    },
  },
}
</script>
