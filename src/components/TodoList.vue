<template>
  <div class="card">
    <div class="card-content">
      <div class="row" style="margin-bottom: 0;">
        <div class="col s10">
          <span class="card-title black-text"><strong>{{ title }}</strong></span>
        </div>
        <div class="col s2 right-align">
          <a
            class="btn-floating btn-small waves-effect waves-light red tooltipped"
            data-position="bottom"
            data-tooltip="Borrar Lista"
            @click="borrarLista"
          >
            <i class="material-icons">delete</i>
          </a>
        </div>
      </div>

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
          v-for="(tarea, index) in tareasLimitadas"
          :key="index"
          :tarea="tarea"
          :index="index"
          @borrarTarea="borrarTarea"
        />
        <li v-if="tareas.length > 3" class="collection-item center-align">
          <a href="#modal-tareas" class="modal-trigger">Ver todas las tareas...</a>
        </li>
      </ul>
    </div>
  </div>


  <div :id="'modal-tareas'" class="modal">
    <div class="modal-content">
      <h5>Todas las tareas</h5>
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
    <div class="modal-footer">
      <a href="#!" class="modal-close btn-flat">Cerrar</a>
    </div>
  </div>
</template>

<script>
import Tarea from './TodoItem.vue'
import M from 'materialize-css'

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
  computed: {
    tareasLimitadas() {
      return this.tareas.slice(0, 3)
    },
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
    borrarLista() {
      const tooltipElems = document.querySelectorAll('.tooltipped')
      tooltipElems.forEach((elem) => {
        const instance = M.Tooltip.getInstance(elem)
        if (instance) instance.destroy()
      })

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

