declare global {
    interface Window {
        deleteTask: (taskId: string) => void;
        editTask: (taskId: string) => void;
    }
}
export {};
