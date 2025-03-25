document.addEventListener("DOMContentLoaded", () => {
  const addTaskButton = document.getElementById("addTask");
  const taskList = document.getElementById("taskList");
  const showPendingButton = document.getElementById("showPending");
  const showCompletedButton = document.getElementById("showCompleted");
  const showAllButton = document.getElementById("showAll");
  const editWrapper = document.getElementById("editWrapper");
  const editTitle = document.getElementById("editTitle");
  const updateTaskButton = document.getElementById("updateTask");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentEditIndex = null;

  function renderTasks(filter) {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      if (
        filter === "all" ||
        (filter === "pending" && !task.completed) ||
        (filter === "completed" && task.completed)
      ) {
        const li = document.createElement("li");
        li.className = task.completed ? "completed" : "";
        li.innerHTML = `
          <div>
            <strong>${task.title}</strong>
          </div>
          <div>
            <i class="fas fa-trash" onclick="deleteTask(${index})" title="Delete"></i>
            <i class="fas ${
              task.completed ? "fa-undo" : "fa-check"
            }" onclick="toggleComplete(${index})" title="${
          task.completed ? "Undo" : "Complete"
        }"></i>
            <i class="fas fa-edit" onclick="editTask(${index})" title="Edit"></i>
          </div>
        `;
        taskList.appendChild(li);
      }
    });
  }

  function saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  window.deleteTask = function (index) {
    tasks.splice(index, 1);
    saveToLocalStorage();
    updateFilter();
  };

  window.toggleComplete = function (index) {
    tasks[index].completed = !tasks[index].completed;
    saveToLocalStorage();
    updateFilter();
  };

  window.editTask = function (index) {
    currentEditIndex = index;
    const task = tasks[index];
    editTitle.value = task.title;
    editWrapper.style.display = "block";
  };

  updateTaskButton.addEventListener("click", () => {
    if (currentEditIndex !== null) {
      tasks[currentEditIndex] = {
        title: editTitle.value,
        completed: tasks[currentEditIndex].completed,
      };
      currentEditIndex = null;
      editWrapper.style.display = "none";
      saveToLocalStorage();
      updateFilter();
    }
  });

  addTaskButton.addEventListener("click", () => {
    const title = document.getElementById("taskTitle").value;
    if (title) {
      tasks.push({ title, completed: false });
      document.getElementById("taskTitle").value = "";
      saveToLocalStorage();
      updateFilter();
    }
  });

  function updateFilter() {
    if (showPendingButton.classList.contains("active")) {
      renderTasks("pending");
    } else if (showCompletedButton.classList.contains("active")) {
      renderTasks("completed");
    } else {
      renderTasks("all");
    }
  }

  showPendingButton.addEventListener("click", () => {
    showPendingButton.classList.add("active");
    showCompletedButton.classList.remove("active");
    showAllButton.classList.remove("active");
    updateFilter();
  });

  showCompletedButton.addEventListener("click", () => {
    showPendingButton.classList.remove("active");
    showCompletedButton.classList.add("active");
    showAllButton.classList.remove("active");
    updateFilter();
  });

  showAllButton.addEventListener("click", () => {
    showPendingButton.classList.remove("active");
    showCompletedButton.classList.remove("active");
    showAllButton.classList.add("active");
    updateFilter();
  });

  renderTasks("all");
});
