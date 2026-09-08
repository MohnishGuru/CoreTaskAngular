export interface Dashboard {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  hoursLogged: number;
  tasksByStatus: { [key: string]: number };
  tasksByPriority: { [key: string]: number };
}