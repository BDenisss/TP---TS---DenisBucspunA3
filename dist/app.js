import { TaskManager } from "./managers/TaskManager.js";
import { CategoryManager } from "./managers/CategoryManager.js";
document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();
    const categoryManager = new CategoryManager(); // Inutile pour le moment car pas de catégories
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    searchButton.addEventListener('click', () => {
        const searchQuery = (searchInput).value.trim().toLowerCase();
        renderTasks(undefined, undefined, searchQuery);
    });
    function highlight(text, keyword) {
        if (!keyword) {
            return text;
        }
        const regex = new RegExp(`(${keyword})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }
    // Fonction pour afficher les tâches
    function renderTasks(priorityFilter, dateFilter, searchQuery) {
        const tasksContainer = document.getElementById('tasks');
        if (tasksContainer) {
            tasksContainer.innerHTML = '';
            taskManager.getTasks().forEach(task => {
                if (priorityFilter && priorityFilter !== 'all' && task.priority.toLowerCase() !== priorityFilter) {
                    return;
                }
                if (dateFilter && task.dueDate > dateFilter) {
                    return;
                }
                if (searchQuery && !task.title.toLowerCase().includes(searchQuery) && !task.description.toLowerCase().includes(searchQuery)) {
                    return;
                }
                const highlightedTitle = highlight(task.title, searchQuery || '');
                const highlightedDescription = highlight(task.description, searchQuery || '');
                const taskElement = document.createElement('div');
                taskElement.className = `task ${task.priority.toLowerCase()}`;
                taskElement.innerHTML = `
                <h3>${highlightedTitle} <span>– Priorité ${task.priority}</span></h3>
                <p>Date d'échéance: ${task.dueDate.toISOString().split('T')[0]}</p>
                <p>${highlightedDescription}</p>
                <button type="button" onclick="window.deleteTask('${task.id}')">Supprimer</button>
                <button class="edit-btn" type="button" onclick="window.editTask('${task.id}')">Modifier</button>
            `;
                tasksContainer.appendChild(taskElement);
            });
        }
        else {
            console.error('Tasks container not found');
        }
    }
    renderTasks();
    const taskForm = document.getElementById('taskForm');
    const submitButton = taskForm.querySelector('button[type="submit"]');
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const taskId = document.getElementById('taskId').value;
        const title = document.getElementById('taskTitle').value;
        const description = document.getElementById('taskDescription').value;
        const dueDate = new Date(document.getElementById('taskDueDate').value);
        const priority = document.getElementById('taskPriority').value;
        if (taskId) {
            const updatedTask = {
                id: taskId,
                title,
                description,
                dueDate,
                priority,
            };
            taskManager.editTask(taskId, updatedTask);
        }
        else {
            const newTask = {
                id: crypto.randomUUID(),
                title,
                description,
                dueDate,
                priority,
            };
            taskManager.addTask(newTask);
        }
        renderTasks();
        taskForm.reset();
        document.getElementById('taskId').value = '';
        submitButton.textContent = "Ajouter Tâche";
    });
    function deleteTask(taskId) {
        taskManager.deleteTask(taskId);
        renderTasks();
    }
    function editTask(taskId) {
        const task = taskManager.getTasks().find(task => task.id === taskId);
        if (task) {
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDescription').value = task.description;
            document.getElementById('taskDueDate').value = task.dueDate.toISOString().substring(0, 10);
            document.getElementById('taskPriority').value = task.priority;
            document.getElementById('taskId').value = task.id;
            submitButton.textContent = "Modifier Tâche";
        }
    }
    window.deleteTask = deleteTask;
    window.editTask = editTask;
    const applyFilterButton = document.getElementById('applyFilter');
    applyFilterButton.addEventListener('click', () => {
        const priority = document.getElementById('filterPriority').value;
        const dateString = document.getElementById('filterDate').value;
        let filterDate = dateString ? new Date(dateString) : undefined;
        renderTasks(priority, filterDate);
    });
});
