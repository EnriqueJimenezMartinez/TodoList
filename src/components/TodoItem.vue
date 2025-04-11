<template>
  <li :class="{ done: isDone }">
    <label>
      <input type="checkbox" class="filled-in" v-model="isDone" />
      <span>{{ tarea }}</span>
    </label>
    <button class="btn-floating btn-small red eliminar-btn" @click="borrarTarea">
      <i class="material-icons">delete</i>
    </button>
  </li>
</template>

<script>
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
  methods: {
    borrarTarea() {
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
.eliminar-btn {
  margin-left: 10px;
}
</style>
