import { Task } from "../models/Task";
export declare class TaskManager {
    private tasks;
    constructor();
    addTask(task: Task): void;
    getTasks(): Task[];
    deleteTask(taskId: string): void;
    editTask(taskId: string, updatedTask: Task): void;
    private saveTasks;
    private loadTasks;
}
