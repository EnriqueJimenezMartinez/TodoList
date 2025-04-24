<template>
  <li class="taskLine" :class="{ done: task.completed }">
    <label class="flex-grow-1" style="margin: 0">
      <input
        type="checkbox"
        class="filled-in"
        :checked="task.completed"
        @change="updateTaskStatus"
      />
      <span :class="{ 'grey-text text-darken-1': task.completed }">
        {{ task.task }}
      </span>
    </label>
    <div class="center-align">
      <a
        class="btn-floating btn-small red tooltipped"
        :data-tooltip="'Borrar Tarea: ' + task.task"
        data-position="bottom"
        @click="eraseItemEvent"
      >
        <i class="material-icons">delete</i>
      </a>
    </div>
  </li>
</template>

<script>
import M from 'materialize-css'
export default {
  props: {
    task: Object,
    index: Number,
  },
  mounted() {
    M.Tooltip.init(document.querySelectorAll('.tooltipped'), {})
    M.Modal.init(document.querySelectorAll('.modal'), {})
  },
  methods: {
    eraseItemEvent() {
      const tooltipElems = document.querySelectorAll('.tooltipped')
      tooltipElems.forEach((elem) => {
        const instance = M.Tooltip.getInstance(elem)
        if (instance) instance.destroy()
      })
      this.$emit('eraseItem', this.index)
    },
    updateTaskStatus() {
      this.$emit('toggleCompleted', this.index)
    },
  },
}
</script>

<style scoped>
.done {
  text-decoration: line-through;
  opacity: 0.6;
}

.taskLine {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: none;
  padding: 0 10px;
}

.taskLine > label {
  border: none;
}

.taskLine > label > input {
  margin-top: 10px;
}
</style>
