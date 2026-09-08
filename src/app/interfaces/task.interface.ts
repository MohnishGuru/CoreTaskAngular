export interface Task {
  taskId: string;         
  taskName: string;
  description: string;     
  priority: string;
  status: string;
  assignedToName: string; 
  assigneeName: string;   
  dueDate: Date;
  createdDate: Date;       
}