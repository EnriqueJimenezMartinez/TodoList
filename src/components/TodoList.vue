<template>
  <div class="card z-depth-3" :class="{ 'completed-list': allCompleted }">
    <div class="card-content">
      <div class="row" style="margin-bottom: 0">
        <div class="col s10">
          <span
            v-if="title.length > 20"
            class="card-title black-text truncate tooltipped"
            :data-tooltip="title"
            data-position="top"
          >
            <strong>{{ title }}</strong>
          </span>

          <span v-else class="card-title black-text truncate">
            <strong>{{ title }}</strong>
          </span>
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
        <input v-model="newTask" type="text" placeholder="Nueva tarea" @keyup.enter="addItem" />
      </div>

      <ul class="special collection" style="display: flex; flex-direction: column; gap: 10px">
        <Task
          v-for="(task, index) in limitedTasks"
          :key="index"
          :task="task"
          :index="index"
          @eraseItem="dropItem"
          @toggleCompleted="toggleCompleted"
        />
        <li v-if="tasks.length > 3" class="collection-item center-align">
          <a :href="`#modal-tasks-${id}`" class="modal-trigger"> Ver todas las tareas... </a>
        </li>
      </ul>
    </div>
  </div>

  <div :id="`modal-tasks-${id}`" class="modal">
    <div class="modal-content">
      <h5>Todas las tareas</h5>
      <ul class="collection">
        <Task
          v-for="(task, index) in tasks"
          :key="index"
          :task="task"
          :index="index"
          @eraseItem="dropItem"
          @toggleCompleted="toggleCompleted"
        />
      </ul>
    </div>
    <div class="modal-footer">
      <a href="#!" class="modal-close btn-flat">Cerrar</a>
    </div>
  </div>

  <div :id="`modal-confirm-${id}`" class="modal">
    <div class="modal-content">
      <h5>¿Eliminar lista vacía?</h5>
      <p>La lista está vacía. ¿Quieres eliminarla?</p>
    </div>
    <div class="modal-footer">
      <a href="#!" class="modal-close btn-flat" @click="confirmEraseList">Sí</a>
      <a href="#!" class="modal-close btn-flat" @click="eraseOnlyTask">No</a>
    </div>
  </div>
</template>

<script>
import Task from './TodoItem.vue'
import M from 'materialize-css'

export default {
  components: { Task },
  props: {
    title: String,
    id: [String],
    list: Object,
  },
  emits: ['eraseTodoListEvent', 'guardar'],
  data() {
    return {
      newTask: '',
      localList: { ...this.list },
      taskToRemoveIndex: null,
    }
  },
  computed: {
    tasks() {
      return this.localList.tasks || []
    },
    limitedTasks() {
      return this.tasks.slice(0, 3)
    },
    allCompleted() {
      return this.tasks.every((task) => task.completed)
    },
  },
  mounted() {
    M.Tooltip.init(document.querySelectorAll('.tooltipped'), {})
    M.Modal.init(document.querySelectorAll('.modal'), {})

    const savedTasks = localStorage.getItem(`task_${this.id}`)
    if (savedTasks) {
      this.localList.tasks = JSON.parse(savedTasks)
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
    },
    addItem() {
      if (this.newTask.trim() !== '') {
        this.localList.tasks.push({ task: this.newTask, completed: false })
        this.$emit('guardar', this.localList)
        this.newTask = ''
      }
    },
    dropItem(index) {
      if (this.localList.tasks.length === 1) {
        this.taskToRemoveIndex = index
        const modalElem = document.getElementById(`modal-confirm-${this.id}`)
        const instance = M.Modal.getInstance(modalElem)
        instance.open()
      } else {
        this.localList.tasks.splice(index, 1)
        this.$emit('guardar', this.localList)
      }
    },
    confirmEraseList() {
      this.eraseListEvent()
    },
    toggleCompleted(index) {
      const task = this.localList.tasks[index]
      task.completed = !task.completed
      this.$emit('guardar', this.localList)
    },
    eraseOnlyTask() {
      if (this.taskToRemoveIndex !== null) {
        this.localList.tasks.splice(this.taskToRemoveIndex, 1)
        this.taskToRemoveIndex = null
        this.$emit('guardar', this.localList)
      }
    },
  },
}
</script>

<style>
div.card {
  margin: 0;
  height: 100%;
  width: 100%;
  border-radius: 20px;
}

ul.special.collection {
  border: none;
}

.completed-list {
  background-color: #d4edda;
  border: 2px solid #28a745;
}
</style>
