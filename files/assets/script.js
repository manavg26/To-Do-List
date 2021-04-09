// Element Declarations

let taskShow = document.getElementById("taskShow")
let taskEntry = document.getElementById("taskEntry")
let fetchTasks = new XMLHttpRequest
let request = new XMLHttpRequest

// Variable Declarations

let tasks = []
let taskNumber = 1

// Defaults

fetchTasks.open("GET", "/tasks")
fetchTasks.send()
fetchTasks.addEventListener("load", function(data) {
    tasks = JSON.parse(data.target.response)
    displayOldTasks()
})

// Event Listeners

taskEntry.addEventListener("keydown", function (event) {
    if(event.key === "Enter") {
        event.preventDefault();
        if(taskEntry.value.trim() === "") {
            alert("Task can't be empty.")
        }
        else {
            displayTask({name: taskEntry.value.trim()})
            taskEntry.value = ""
        }
    }
})

// Functions

function displayOldTasks() {
    tasks.forEach(data => {
        displayTask(data)
        taskNumber = data.number + 1
    })
}

function displayTask(data) {
    taskShow.appendChild(createTask(data))
}

function createTask(data) {
    let taskDiv = document.createElement("div")
    taskDiv.className = "task"
    let parentDiv = document.createElement("div")
    parentDiv.className = "pl-3 pr-1"
    let taskNameDiv = document.createElement("div")
    taskNameDiv.className = "taskName d-inline-block"
    taskNameDiv.innerHTML = data.name
    let taskButtonsDiv = document.createElement("div")
    taskButtonsDiv.className = "taskButtons d-inline-block"
    let checkBox = document.createElement("button")
    checkBox.className = "material-icons-outlined p-0 border-0"
    checkBox.innerHTML = "check_box_outline_blank"
    let close = document.createElement("button")
    close.className = "material-icons-outlined p-0 ml-1 border-0"
    close.innerHTML = "close"
    taskButtonsDiv.append(checkBox, close)
    let hr = document.createElement("hr")
    parentDiv.append(taskNameDiv, taskButtonsDiv)
    taskDiv.append(parentDiv, hr)
    if(data.done == null) {
        data.done = false
        data.number = taskNumber++
        tasks.push(data)
        addTaskRequest(data)
    }
    else {
        taskDoneOrNot(checkBox, taskNameDiv, !data.done)
    }
    checkBox.addEventListener("click", function () {
        data.done = taskDoneOrNot(checkBox, taskNameDiv, data.done)
        updateTaskRequest(data.number)
    })
    close.addEventListener("click", function () {
        taskShow.removeChild(taskDiv)
        removeTask(data.number)
        removeTaskRequest(data.number)
    })
    return taskDiv
}

function taskDoneOrNot(checkBox, taskNameDiv, isDone) {
    if(!isDone) {
        checkBox.innerHTML = "check_box"
        taskNameDiv.style.textDecoration = "line-through"
    }
    else {
        checkBox.innerHTML = "check_box_outline_blank"
        taskNameDiv.style.textDecoration = "none"
    }
    return !isDone
}

function removeTask(number) {
    for(let i=0; i<tasks.length; i++) {
        if(tasks[i].number === number) {
            tasks.splice(i,1);
            break;
        }
    }
}

function addTaskRequest(data) {
    request.open("POST", "/addTask")
    request.send(JSON.stringify(data))
}

function updateTaskRequest(number) {
    request.open("POST", "/updateTask")
    request.send(JSON.stringify(number))
}

function removeTaskRequest(number) {
    request.open("POST", "/removeTask")
    request.send(JSON.stringify(number))
}