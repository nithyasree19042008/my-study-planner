const STORAGE_KEY = "tasks";

let tasks = [];

try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) {
        tasks = saved.map(item => {
            if (typeof item === "string") {
                return { text: item, completed: false };
            }
            return {
                text: String(item.text ?? ""),
                completed: Boolean(item.completed)
            };
        }).filter(item => item.text.trim() !== "");
    }
} catch (error) {
    console.error("Could not load saved tasks:", error);
}

let currentFilter = "all";

const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");

// Display today's date
document.getElementById("date").textContent =
    new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

// Save tasks
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Add a new task
function addTask() {
    const text = input.value.trim();

    if (!text) {
        alert("Please enter a task first! 💜");
        return;
    }

    tasks.push({
        text: text,
        completed: false
    });

    input.value = "";
    saveTasks();
    renderTasks();
    input.focus();
}

// Add tasks using Enter
input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Complete or uncomplete task
function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

// Delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Filter tasks
function setFilter(filter) {
    currentFilter = filter;

    document.querySelectorAll(".filter").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.filter === filter
        );
    });

    renderTasks();
}

// Clear completed tasks
function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

// Update progress
function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;

    const percent = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("progressFill").style.width =
        percent + "%";

    document.getElementById("progressText").textContent =
        percent + "%";

    document.getElementById("taskCount").textContent =
        `${completed} of ${total} tasks completed`;

    const motivation = document.getElementById("motivation");

    if (total === 0) {
        motivation.textContent = "A fresh start awaits! 🌸";
    } else if (percent === 100) {
        motivation.textContent = "Amazing! All tasks completed! 🎉";
    } else if (percent >= 50) {
        motivation.textContent = "You're making great progress! 💜";
    } else {
        motivation.textContent = "One step at a time. You've got this! ✨";
    }
}

// Display tasks
function renderTasks() {
    list.innerHTML = "";

    tasks.forEach((task, index) => {

        if (currentFilter === "pending" && task.completed) return;
        if (currentFilter === "completed" && !task.completed) return;

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggleTask(index));

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-btn";
        deleteButton.textContent = "🗑️";
        deleteButton.setAttribute("aria-label", "Delete " + task.text);
        deleteButton.addEventListener("click", () => deleteTask(index));

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);

        list.appendChild(li);
    });

    document.getElementById("emptyMessage").style.display =
        list.children.length === 0 ? "block" : "none";

    updateProgress();
}

// Start the website
renderTasks();