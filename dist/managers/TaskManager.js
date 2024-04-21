export class TaskManager {
    tasks = [];
    constructor() {
        this.loadTasks();
    }
    addTask(task) {
        this.tasks.push(task);
        this.saveTasks();
    }
    getTasks() {
        return this.tasks;
    }
    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
    }
    editTask(taskId, updatedTask) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = updatedTask;
            this.saveTasks();
        }
    }
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
    loadTasks() {
        const tasks = localStorage.getItem('tasks');
        if (tasks) {
            this.tasks = JSON.parse(tasks).map((task) => ({
                ...task,
                dueDate: new Date(task.dueDate)
            }));
        }
        else {
            this.tasks = [];
        }
    }
}
