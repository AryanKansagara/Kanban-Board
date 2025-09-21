


function addTask(columnId, taskText = null) {
  if (!taskText) {
    taskText = prompt("Enter task:");
  }
  if (!taskText) return;

  const task = document.createElement("div");
  task.className = "task";
  task.draggable = true;

  // unique ID
  task.id = "task-" + Date.now();

  // Task content container
  const span = document.createElement("span");
  span.innerText = taskText;

  // ✏️ Edit button
  const editBtn = document.createElement("button");
  editBtn.innerText = "✏️";
  editBtn.className = "edit-btn";
  editBtn.onclick = () => {
    const newText = prompt("Edit task:", span.innerText);
    if (newText) {
      span.innerText = newText;
      saveBoard();
    }
  };

  // Delete button
  const delBtn = document.createElement("button");
  delBtn.innerText = "❌";
  delBtn.className = "del-btn";
  delBtn.onclick = () => {
    task.remove();
    saveBoard();
  };

  // Build task element
  task.appendChild(span);
  task.appendChild(editBtn);
  task.appendChild(delBtn);

  // Drag start
  task.addEventListener("dragstart", e => {
    e.dataTransfer.setData("text", task.id);
  });

  document.querySelector(`#${columnId} .task-list`).appendChild(task);

  saveBoard();
}

//  Save board state to localStorage
function saveBoard() {
  const boardData = {};
  document.querySelectorAll(".column").forEach(col => {
    const colId = col.id;
    const tasks = Array.from(col.querySelectorAll(".task span")).map(span => span.innerText);
    boardData[colId] = tasks;
  });
  localStorage.setItem("kanbanBoard", JSON.stringify(boardData));
}

// Load board state from localStorage
function loadBoard() {
  const saved = localStorage.getItem("kanbanBoard");
  if (!saved) return;
  const boardData = JSON.parse(saved);

  for (const colId in boardData) {
    boardData[colId].forEach(taskText => {
      addTask(colId, taskText);
    });
  }
}

// Attach drop events to all columns (works even if empty!)
document.querySelectorAll(".task-list").forEach(list => {
  list.addEventListener("dragover", e => {
    e.preventDefault();
    list.style.background = "#dfe6e9";
  });

  list.addEventListener("dragleave", () => {
    list.style.background = "#fff";
  });

  list.addEventListener("drop", e => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text");
    const task = document.getElementById(taskId);
    if (task) {
      list.appendChild(task);
      saveBoard();
    }
    list.style.background = "#fff";
  });
});

// Load tasks on page refresh
window.onload = loadBoard;

//  Clear board button
document.getElementById("clearBoardBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear the entire board?")) {
    // remove all tasks
    document.querySelectorAll(".task-list").forEach(list => {
      list.innerHTML = "";
    });

    // clear localStorage
    localStorage.removeItem("kanbanBoard");
  }
});
