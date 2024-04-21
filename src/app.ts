import { TaskManager } from "./managers/TaskManager.js";
import { CategoryManager } from "./managers/CategoryManager.js";

declare global {
    interface Window {
        deleteTask: (taskId: string) => void;
        editTask: (taskId: string) => void;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const taskManager = new TaskManager();
    const categoryManager = new CategoryManager(); // Inutile pour le moment car pas de catégories

    const searchButton = document.getElementById('searchButton') as HTMLButtonElement;
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;

    searchButton.addEventListener('click', () => {
        const searchQuery = (searchInput).value.trim().toLowerCase();
        

        renderTasks(undefined, undefined, searchQuery); 
    });

    function highlight(text: string, keyword: string): string {
        if (!keyword) {
            return text;
        }
    
        const regex = new RegExp(`(${keyword})`, 'gi'); 
        return text.replace(regex, '<span class="highlight">$1</span>'); 
    }
    

    // Fonction pour afficher les tâches
    function renderTasks(priorityFilter?: string, dateFilter?: Date, searchQuery?: string): void {
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
        } else {
            console.error('Tasks container not found');
        }
    }
    renderTasks(); 

    const taskForm = document.getElementById('taskForm') as HTMLFormElement;
    const submitButton = taskForm.querySelector('button[type="submit"]') as HTMLButtonElement; 

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const taskId = (document.getElementById('taskId') as HTMLInputElement).value;
        const title = (document.getElementById('taskTitle') as HTMLInputElement).value;
        const description = (document.getElementById('taskDescription') as HTMLTextAreaElement).value;
        const dueDate = new Date((document.getElementById('taskDueDate') as HTMLInputElement).value);

        const priority = (document.getElementById('taskPriority') as HTMLSelectElement).value as 'Low' | 'Medium' | 'High';

        if (taskId) {
            const updatedTask = {
                id: taskId,
                title,
                description,
                dueDate,
                priority,
            };

            taskManager.editTask(taskId, updatedTask);
        } else {
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
        (document.getElementById('taskId') as HTMLInputElement).value = '';
        submitButton.textContent = "Ajouter Tâche"; 

    });
    

    function deleteTask(taskId: string): void {
        taskManager.deleteTask(taskId);
        renderTasks(); 
    }
    
    function editTask(taskId: string): void {
        const task = taskManager.getTasks().find(task => task.id === taskId);
        if (task) {
            (document.getElementById('taskTitle') as HTMLInputElement).value = task.title;
            (document.getElementById('taskDescription') as HTMLTextAreaElement).value = task.description;
            (document.getElementById('taskDueDate') as HTMLInputElement).value = task.dueDate.toISOString().substring(0, 10);
            (document.getElementById('taskPriority') as HTMLSelectElement).value = task.priority;
            (document.getElementById('taskId') as HTMLInputElement).value = task.id;
            submitButton.textContent = "Modifier Tâche"; 

        }
    }
    

    window.deleteTask = deleteTask;
    window.editTask = editTask;



    const applyFilterButton = document.getElementById('applyFilter') as HTMLButtonElement;
    applyFilterButton.addEventListener('click', () => {
        const priority = (document.getElementById('filterPriority') as HTMLSelectElement).value;
        const dateString = (document.getElementById('filterDate') as HTMLInputElement).value;
        let filterDate = dateString ? new Date(dateString) : undefined;    
        renderTasks(priority, filterDate); 
    
    });
});
