const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const toggleTheme = document.getElementById('toggleTheme');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterButtons = document.querySelectorAll('[data-filter]');
const counter = document.getElementById('counter');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';
  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');

    const span = document.createElement('span');
    span.textContent = task.text;
    span.contentEditable = true;
    span.addEventListener('blur', () => {
      tasks[index].text = span.textContent;
      saveTasks();
    });

    li.appendChild(span);

    const timestamp = document.createElement('span');
    timestamp.className = 'timestamp';
    timestamp.textContent = task.timestamp;
    li.appendChild(timestamp);

    li.addEventListener('click', (e) => {
      if (e.target.tagName !== 'BUTTON') {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
      }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });

  updateCounter();
}

function addTask(text) {
  const timestamp = new Date().toLocaleString();
  tasks.push({ text, completed: false, timestamp });
  saveTasks();
  renderTasks();
}

function updateCounter() {
  const activeCount = tasks.filter(t => !t.completed).length;
  counter.textContent = `${activeCount} task(s) remaining.`;
}

taskInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
      addTask(taskText);
      taskInput.value = '';
    }
  }
});

clearCompletedBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.getAttribute('data-filter');
    renderTasks();
  });
});

toggleTheme.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

// Apply saved theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
}

renderTasks();
