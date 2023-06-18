import Dexie from "https://unpkg.com/dexie@latest/dist/modern/dexie.mjs";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/todo/service-worker.js", {
      scope: "/todo/",
    })
    .then((reg) => console.log("Service worker registered"))
    .catch((err) => console.log("Service worker not registered", err));
}

const db = new Dexie('todo_db');
const tasksPriorityNames = ["urgent", "high", "normal", "low", "none"];

db.version(1).stores({tasks: '++id, name, lvl'});

async function renderTasks() {
    const tasks = await db.tasks.orderBy('lvl').toArray();

    const taskList = document.getElementById('tasks-list');
    taskList.innerHTML = '';
  
    tasks.forEach((task, index) => {
      const task_div = document.createElement('li');
      const task_name = document.createElement('span');
      const task_lvl = document.createElement('span');
    //   const task_edit_button = document.createElement('button');
      const task_delete_button = document.createElement('button');

      task_div.classList.add("task-div");
      task_div.classList.add(`task-lvl-${task.lvl}`);

      task_name.classList.add("task-name");
      task_lvl.classList.add("task-lvl");
    //   task_edit_button.classList.add("task-edit-button");
      task_delete_button.classList.add("task-delete-button");

      task_name.textContent = task.name;
      task_lvl.textContent = tasksPriorityNames[task.lvl];
    //   task_edit_button.textContent = 'edit';
      task_delete_button.textContent = '×';

      task_delete_button.addEventListener('click', () => removeTask(task.id, task.name));
  
      task_div.appendChild(task_delete_button);
    //   task_div.appendChild(task_edit_button);
      task_div.appendChild(task_name);
      task_div.appendChild(task_lvl);

      taskList.appendChild(task_div);
    });
}

function removeTask(primaryKey, taskName){
    db.tasks.delete(primaryKey).then(function(res){
        console.log(`successfully deleted '${taskName}' task`);
        renderTasks();
    }).catch(function(error){
        console.log(`error deleting ${primaryKey} task \n ${error}`);
    });
}

function addTask(taskName, taskLvl){
    db.tasks.add({
		name: taskName,
		lvl: parseInt(taskLvl)
	}).then(function(res){
        console.log(`successfully added '${taskName}' task`);
        renderTasks();
        console.log(document.querySelector('input[name="task_priority"]:checked').value)
    }).catch(function(error){
        console.log(`error adding a task \n ${error}`);
    });
}

document.getElementById("add-new-task-button").addEventListener('click', () => {
    document.getElementById("name").value = "";
    document.getElementById("add-new-task-dialog").showModal();
    document.getElementById("name").focus();
});

document.getElementById("cancel-new-task-button").addEventListener('click', () => {
    document.getElementById("add-new-task-dialog").close();
});

document.getElementById("new-task-form").addEventListener('submit',
    () => addTask(document.getElementById("name").value,
    document.querySelector('input[name="task_priority"]:checked').value));

renderTasks();