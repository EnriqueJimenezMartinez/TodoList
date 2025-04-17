<template>
  <div class="card z-depth-3">
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
            @click="eraseListEvent"
          >
            <i class="material-icons">delete</i>
          </a>
        </div>
      </div>

      <div class="input-field">
        <input
          v-model="newTask"
          type="text"
          placeholder="Nueva tarea"
          @keyup.enter="addItem"
        />
      </div>

      <ul class="special collection" style=" display: flex; flex-direction: column; gap: 10px;vertical-align: middle">
        <Task
          v-for="(task, index) in limitedTasks"
          :key="index"
          :task="task"
          :index="index"
          @eraseItem="dropItem"
        />
        <li v-if="tasks.length > 3" class="collection-item center-align">
          <a href="#modal-tasks" class="modal-trigger">Ver todas las tareas...</a>
        </li>
      </ul>
    </div>
  </div>


  <div :id="'modal-tasks'" class="modal">
    <div class="modal-content">
      <h5>Todas las tareas</h5>
      <ul class="collection">
        <Task
          v-for="(task, index) in tasks"
          :key="index"
          :task="task"
          :index="index"
          @eraseItem="dropItem"
        />
      </ul>
    </div>
    <div class="modal-footer">
      <a href="#!" class="modal-close btn-flat">Cerrar</a>
    </div>
  </div>
</template>

<script>
import Task from './TodoItem.vue'
import M from 'materialize-css'

export default {
  components: {
    Task,
  },
  props: {
    title: String,
    id: [String],
  },
  data() {
    return {
      newTask: '',
      tasks: [],
    }
  },
  computed: {
    limitedTasks() {
      return this.tasks.slice(0, 3)
    },
  },
  mounted() {
    M.Tooltip.init(document.querySelectorAll('.tooltipped'), {})
    M.Modal.init(document.querySelectorAll('.modal'), {})

    const savedTasks = localStorage.getItem(`task_${this.id}`)
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks)
    }
  },
  methods: {
    eraseListEvent() {
      const tooltipElems = document.querySelectorAll('.tooltipped')
      tooltipElems.forEach((elem) => {
        const instance = M.Tooltip.getInstance(elem)
        if (instance) instance.destroy()
      })

      this.$emit('eraseTodoListEvent', this.id)
      localStorage.removeItem(`task_${this.id}`)
    },
    addItem() {
      if (this.newTask.trim() !== '') {
        this.tasks.push(this.newTask)
        this.saveItems()
        this.newTask = ''
      }
    },
    dropItem(index) {
      this.tasks.splice(index, 1)
      this.saveItems()
    },
    saveItems() {
      localStorage.setItem(`task_${this.id}`, JSON.stringify(this.tasks))
    },
  },
}
</script>

<style>
.special{
  border: none !important;
}
.card {
  margin: 0;
  height: 100%;
  width: 100%;
  border-radius: 20px !important;
}
</style>
