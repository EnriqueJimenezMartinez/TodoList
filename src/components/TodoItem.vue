<template>
  <li class="taskLine" :class="{ done: isDone }" >
    <label class="flex-grow-1" style="margin: 0;">
      <input type="checkbox" class="filled-in" v-model="isDone" />
      <span>{{ task }}</span>
    </label>
    <a
      class="btn-floating btn-small waves-effect waves-light red tooltipped"
      :data-tooltip="'Borrar Tarea: ' + task"
      data-position="bottom"
      @click="eraseItemEvent"
    >
      <i class="material-icons">delete</i>
    </a>
  </li>
</template>

<script>
import M from 'materialize-css'
export default {
  props: {
    task: String,
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

    const itemsSaved = localStorage.getItem(`tasks_${this.id}`)
    if (itemsSaved) {
      this.tasks = JSON.parse(itemsSaved)
    }
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
  },
}
</script>

<style scoped>
.done {
  text-decoration: line-through;
  opacity: 0.6;
}

.taskLine{
  display: flex;
  justify-content: space-between;
  vertical-align: middle;
  border: none;
}
.taskLine > label{
  border: none;
}
.taskLine > label > input {
  margin-top: 10px;
 }
</style>
