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
            <input
              v-model="newTodoList"
              type="text"
              :placeholder="placeholderSuggestion"
              required
            />
          </div>
          <button type="button" class="modal-close waves-effect waves-red btn-flat">
            Cancelar
          </button>
          <button type="submit" class="waves-effect waves-green btn-flat">Crear lista</button>
        </form>
      </div>
    </div>

    <div class="lista-flex-container">
      <div v-for="list in todolists" :key="list.id" class="lista-flex-item">
        <TodoList
          :title="list.title"
          :id="list.id"
          :list="list"
          @eraseTodoListEvent="eraseList"
          @guardar="saveTodoLists"
        />
      </div>
    </div>
  </div>
  <Analytics />
  <SpeedInsights/>
</template>

<script setup>
import { Analytics } from '@vercel/analytics/vue'
import { SpeedInsights } from '@vercel/speed-insights/vue';
</script>

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
      placeholderSuggestion: 'Nombre de la lista',
    }
  },
  mounted() {
    M.Tooltip.init(document.querySelectorAll('.tooltipped'), {})
    const modalElems = document.querySelectorAll('.modal')
    M.Modal.init(modalElems)

    const savedLists = localStorage.getItem('todolists')
    if (savedLists) {
      this.todolists = JSON.parse(savedLists).map(list => {

        if (!list.id) {
          list.id = crypto.randomUUID()
        }
        return list
      })
    }
  },
  methods: {
    addList() {
      const newList = {
        id: crypto.randomUUID(),
        title: this.newTodoList,
        tasks: [],
      }
      this.todolists.push(newList)
      this.saveTodoLists()
      this.newTodoList = ''
      M.Modal.getInstance(document.querySelector('#modalLista')).close()
    },
    eraseList(id) {
      this.todolists = this.todolists.filter((list) => list.id !== id)
      this.saveTodoLists()
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

.parentWrapper {
  display: flex;
  justify-content: center;
}

#btnWrapper {
  display: flex;
  gap: 10px;
  justify-content: center;
  width: 150px;
  background: black;
  padding: 0 0 20px 0;
  border-radius: 50px;
  margin-top: -40px;
}

.lista-flex-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  justify-items: start;
  padding: 20px;
}

.lista-flex-item {
  width: 100%;
}
</style>
