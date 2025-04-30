<template>
  <div class="page-wrapper">
    <div class="had-container">
      <div class="row">
        <div class="col s12 black z-depth-2">
          <div class="col s1">
            <LanguageSelector />
          </div>
          <div class="col s10 center-align">
            <h2 class="white-text" style="margin-top: 0">{{ $t('message.tusListas') }}</h2>
          </div>
        </div>
      </div>

      <div class="row center-align parentWrapper">
        <div
          id="btnWrapper"
          class="z-depth-2"
          :style="{ width: todolists.length === 0 ? '100px' : '255px' }"
        >
          <a
            class="btn-floating waves-effect waves-light btn modal-trigger tooltipped"
            data-position="bottom"
            :data-tooltip="$t('message.nuevaLista')"
            href="#modalLista"
          >
            <i class="material-icons left">add</i>
          </a>

          <a
            v-if="todolists.length > 0"
            class="btn-floating waves-effect red tooltipped"
            data-position="bottom"
            :data-tooltip="$t('message.eliminarLocalStorage')"
            @click="removeLocalStorage"
          >
            <i class="material-icons left">delete_forever</i>
          </a>
          <a
            v-if="todolists.length > 0"
            class="btn-floating waves-effect blue tooltipped"
            data-position="bottom"
            :data-tooltip="$t('message.pdf')"
            @click="exportToPDF"
          >
            <i class="material-icons left">picture_as_pdf</i>
          </a>
          <a
            v-if="todolists.length > 0"
            class="btn-floating waves-effect green tooltipped"
            data-position="bottom"
            :data-tooltip="$t('message.excel')"
            @click="exportToExcel"
          >
            <i class="material-icons left">grid_on</i>
          </a>
          <a
            v-if="todolists.length > 0"
            class="btn-floating waves-effect yellow tooltipped"
            data-position="bottom"
            :data-tooltip="$t('message.csv')"
            @click="exportToCSV"
          >
            <i class="material-icons left">insert_drive_file</i>
          </a>
        </div>
      </div>

      <div id="modalLista" class="modal">
        <div class="modal-content">
          <h4>{{ $t('message.crearLista') }}</h4>
          <form @submit.prevent="addList">
            <div class="input-field">
              <input
                v-model="newTodoList"
                type="text"
                :placeholder="$t('message.nuevaLista')"
                required
              />
            </div>
            <button type="button" class="modal-close waves-effect waves-red btn-flat">
              {{ $t('message.cancelar') }}
            </button>
            <button type="submit" class="waves-effect waves-green btn-flat">
              {{ $t('message.crear') }}
            </button>
          </form>
        </div>
      </div>

      <div class="lista-flex-container" @dragover.prevent @drop="onDrop($event, 2)">
        <div
          v-for="list in todolists"
          :key="list.id"
          class="lista-flex-item"
          draggable="true"
          @dragstart="startDrag($event, list)"
          :data-id="list.id"
        >
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
    <SpeedInsights />
    <footer>
      <FooterComponent />
    </footer>
  </div>
</template>

<script setup>
import { Analytics } from '@vercel/analytics/vue'
import { SpeedInsights } from '@vercel/speed-insights/vue'
</script>

<script>
import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'
import TodoList from './components/TodoList.vue'
import FooterComponent from './components/Footer.vue'
import LanguageSelector from './components/LanguageSelector.vue'
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
      draggedItemId: null,
    }
  },
  mounted() {
    M.Tooltip.init(document.querySelectorAll('.tooltipped'), {})
    const modalElems = document.querySelectorAll('.modal')
    M.Modal.init(modalElems)

    const savedLists = localStorage.getItem('todolists')
    if (savedLists) {
      this.todolists = JSON.parse(savedLists).map((list) => {
        if (!list.id) {
          list.id = crypto.randomUUID()
        }
        return list
      })
    }
  },
  methods: {
    exportToCSV() {
      let csv = 'Lista,Tarea,Estado\n'

      this.todolists.forEach((list) => {
        list.tasks.forEach((task) => {
          const estado = task.completed
            ? this.$t('message.completada')
            : this.$t('message.noCompletada')
          csv += `"${list.title}","${task.task}","${estado}"\n`
        })
      })

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'listas.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    exportToExcel() {
      const wb = XLSX.utils.book_new()

      this.todolists.forEach((list) => {
        const rows = list.tasks.map((task) => ({
          Tarea: task.task,
          Estado: task.completed ? this.$t('message.completada') : this.$t('message.noCompletada'),
        }))

        const ws = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{ Tarea: '', Estado: '' }])
        XLSX.utils.book_append_sheet(wb, ws, list.title.substring(0, 31))
      })

      XLSX.writeFile(wb, 'listas.xlsx')
    },
    exportToPDF() {
      const doc = new jsPDF()
      doc.setFontSize(18)
      doc.text(this.$t('message.tusListas'), 10, 10)

      let y = 20
      this.todolists.forEach((list, index) => {
        doc.setFontSize(14)
        doc.text(`${index + 1}. ${list.title}`, 10, y)
        y += 10

        list.tasks.forEach((task) => {
          const taskStatus = task.completed
            ? this.$t('message.completada')
            : this.$t('message.noCompletada')

          doc.setFontSize(12)
          doc.text(`   - ${task.task} (${taskStatus})`, 12, y)
          y += 8
        })
        y += 5
        if (y > 270) {
          doc.addPage()
          y = 20
        }
      })

      doc.save('listas.pdf')
    },

    startDrag(evt, list) {
      this.draggedItemId = list.id
      evt.dataTransfer.effectAllowed = 'move'
    },
    onDrop(evt) {
      const itemID = this.draggedItemId
      const draggedList = this.todolists.find((i) => i.id === itemID)
      if (!draggedList) return

      const targetElement = evt.target.closest('.lista-flex-item')
      if (!targetElement) return

      const targetId = targetElement.dataset.id
      if (targetId === itemID) return

      const draggedIndex = this.todolists.findIndex((i) => i.id === itemID)
      const targetIndex = this.todolists.findIndex((i) => i.id === targetId)

      if (draggedIndex !== targetIndex) {
        this.todolists.splice(draggedIndex, 1)
        this.todolists.splice(targetIndex, 0, draggedList)
        this.saveTodoLists()
      }
    },
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
        if (instance) instance.close()
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
  width: 200px;
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
