import { Task } from "../models/Task";

    export class TaskManager {
    private tasks: Task[] = [];

    constructor() {
        this.loadTasks(); 
    }

    public addTask(task: Task): void {
        this.tasks.push(task);
        this.saveTasks();
    }

    public getTasks(): Task[] {
        return this.tasks;
    }

    public deleteTask(taskId: string): void {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
    }

    public editTask(taskId: string, updatedTask: Task): void {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
        this.tasks[taskIndex] = updatedTask;
        this.saveTasks();
        }
    }

    private saveTasks(): void {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    private loadTasks(): void {
        const tasks = localStorage.getItem('tasks');
        if (tasks) {
            this.tasks = JSON.parse(tasks).map((task: any) => ({
                ...task,
                dueDate: new Date(task.dueDate) 
            }));
        } else {
            this.tasks = [];
        }
    }
    }
