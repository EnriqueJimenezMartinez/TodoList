<template>
  <div class="had-container">
    <div class="row">
      <div class="col s12 black z-depth-2">
        <h2 class="white-text center-align">Tus Listas</h2>
      </div>
    </div>

    <div class="row">
      <div class="col s12 center-align parentWrapper">
        <div class="center-align z-depth-2" id="btnWrapper">
          <a
            class="btn-floating waves-effect waves-light btn modal-trigger tooltipped"
            data-position="bottom"
            data-tooltip="Añadir Lista"
            href="#modalLista"
          >
            <i class="material-icons left">add</i>
          </a>

          <a
            v-if="todolists.length > 0"
            class="btn-floating waves-effect red tooltipped"
            data-position="bottom"
            data-tooltip="Eliminar todas las listas permanentemente"
            @click="removeLocalStorage"
          >
            <i class="material-icons left">delete_forever</i>
          </a>
        </div>
      </div>
    </div>

    <div id="modalLista" class="modal">
      <div class="modal-content">
        <h4>Crear nueva lista</h4>
        <form @submit.prevent="addList">
          <div class="input-field">
            <input v-model="newTodoList" type="text" placeholder="Nombre de la lista" required />
          </div>
          <button type="button" class="modal-close waves-effect waves-red btn-flat">
            Cancelar
          </button>
          <button type="submit" class="waves-effect waves-green btn-flat">Crear lista</button>
        </form>
      </div>
    </div>

    <div class="row">
      <div v-for="list in todolists" :key="list.id" class="col s12 m6 l4">
        <TodoList :title="list.title" :id="list.id" @eraseTodoListEvent="eraseList" />
      </div>
    </div>
  </div>
</template>

<script>

import TodoList from './components/TodoList.vue'
import M from 'materialize-css'

export default {
  name: 'App',
  components: {
    TodoList,
  },
  data() {
    return {
      newTodoList: '',
      todolists: [],
    }
  },
  mounted() {
    M.Tooltip.init(document.querySelectorAll('.tooltipped'), {})
    M.Modal.init(document.querySelectorAll('.modal'), {})

    const savedLists = localStorage.getItem('todolists')
    if (savedLists) {
      this.todolists = JSON.parse(savedLists)
    }
  },
  methods: {
    addList() {
      const newList = {
        id: crypto.randomUUID(),
        title: this.newTodoList,
      }
      this.todolists.push(newList)
      localStorage.setItem('todolists', JSON.stringify(this.todolists))
      this.newTodoList = ''
      M.Modal.getInstance(document.querySelector('#modalLista')).close()
    },
    eraseList(id) {
      this.todolists = this.todolists.filter((list) => list.id !== id)
      localStorage.setItem('todolists', JSON.stringify(this.todolists))
    },
    saveTodoLists() {
      localStorage.setItem('todolists', JSON.stringify(this.todolists))
    },
    removeLocalStorage() {
      localStorage.clear()
      this.todolists = []
      const tooltipElems = document.querySelectorAll('.tooltipped')
      tooltipElems.forEach((elem) => {
        const instance = M.Tooltip.getInstance(elem)
        if (instance) instance.destroy()
      })
    },
  },
}
</script>

<style>
.grid-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}


.parentWrapper{
  display: flex;
  justify-content: center;
}

#btnWrapper{
  display: flex;
  gap: 10px;
  justify-content: center;
  width: 150px;
  background: black;
  padding: 0 0 20px 0;
  border-radius: 50px;
  margin-top: -40px;
}
</style>
