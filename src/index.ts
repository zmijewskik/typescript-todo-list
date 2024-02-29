import { v4 as uuidV4} from 'uuid'

type Task = {
  id: string
  title: string
  completed: boolean
  createdAt: Date
}

const list = document.querySelector<HTMLUListElement>("#list")
const form = document.getElementById("new-task-form") as HTMLFormElement | null
const input = document.querySelector<HTMLInputElement>("#new-task-title")

const tasks: Task[] = loadTasks()
tasks.forEach(addListItem)

form?.addEventListener("submit", e => {
  e.preventDefault()

  if(input?.value == "" || input?.value == null) return

  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
  }
  tasks.push(newTask)
  saveTasks()

  addListItem(newTask)
  input.value = ""
})

function addListItem(task: Task){
  const item = document.createElement("li")
  const label = document.createElement("label")
  const checkbox = document.createElement("input")

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Delete";
  deleteButton.addEventListener("click", () => {
    deleteTask(task.id);
  })

  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked
    saveTasks()
  })
  checkbox.type = "checkbox"
  checkbox.checked = task.completed
  label.append(checkbox, task.title)
  item.append(label)
  item.append(deleteButton)
  list?.append(item)
}

function deleteTask(taskId: string) {
  const index = tasks.findIndex((task) => task.id === taskId);
  if(index !== -1){
    tasks.splice(index, 1);
    saveTasks();
    refreshList();
  }
}

function refreshList() {
  if(list) {
    list.innerHTML = "";
    tasks.forEach(addListItem);
  }
}

function saveTasks(){
  localStorage.setItem("TASKS", JSON.stringify(tasks))
}

function loadTasks(): Task[]{
  const taskJSON = localStorage.getItem("TASKS")
  if(taskJSON == null) return []
  return JSON.parse(taskJSON)
}