import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; 
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { TaskService } from '../../services/task.service';
import { Task } from '../../interfaces/task.interface';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { ViewTaskComponent } from '../view-task/view-task.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSnackBarModule,
    ViewTaskComponent
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'taskName',
    'priority',
    'assignee',
    'dueDate',
    'status',
    'action'
  ];

  dataSource = new MatTableDataSource<Task>();
  allTasks: Task[] = [];
  activeTab: string = 'all';
  searchFilterValue: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (res) => {
        const sortedTasks = res.sort((a: any, b: any) => {
          const getPriorityWeight = (p: any) => {
            if (p === 'High' || p === '1' || p === 1) return 1;
            if (p === 'Medium' || p === '2' || p === 2) return 2;
            if (p === 'Low' || p === '3' || p === 3) return 3;
            return 4; 
          };
          return getPriorityWeight(a.priority) - getPriorityWeight(b.priority);
        });
        
        this.allTasks = sortedTasks;
        this.applyFilters();
      },
      error: (err) => {
        console.log("Error loading tasks:", err);
      }
    });
  }

  changeTab(tabName: string) {
    this.activeTab = tabName;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.allTasks];

    if (this.activeTab === 'active') {
      filtered = filtered.filter(t => t.status !== '3' && t.status !== 'Done');
    } else if (this.activeTab === 'completed') {
      filtered = filtered.filter(t => t.status === '3' || t.status === 'Done');
    }

    if (this.searchFilterValue) {
      const search = this.searchFilterValue.toLowerCase();
      filtered = filtered.filter(t => 
        t.taskName.toLowerCase().includes(search) || 
        (t.assignedToName && t.assignedToName.toLowerCase().includes(search))
      );
    }

    this.dataSource.data = filtered;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchFilterValue = filterValue.trim().toLowerCase();
    this.applyFilters();
  }

  getStatusText(status: string): string {
    if (status === '0' || status === 'ToDo') return 'To Do';
    if (status === '1' || status === 'InProgress') return 'In Progress';
    if (status === '2' || status === 'Review') return 'Review';
    if (status === '3' || status === 'Done') return 'Completed';
    return status;
  }

  getStatusClass(status: string): string {
    const text = this.getStatusText(status);
    if (text === 'To Do') return 'todo-badge';
    if (text === 'In Progress') return 'progress-badge';
    if (text === 'Review') return 'review-badge';
    if (text === 'Completed') return 'completed-badge done-badge'; 
    return '';
  }

  openTaskDialog() {
    const dialogRef = this.dialog.open(CreateTaskComponent, {
      width: '750px',
      data: null 
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) this.loadTasks();
    });
  }

  editTask(task: any) {
    if (!task || (!task.taskId && !task.TaskId)) {
       this.snackBar.open('Task ID missing!', 'Close', {
         duration: 3000,
         horizontalPosition: 'right',
         verticalPosition: 'top',
         panelClass: ['error-snackbar']
       });
       return; 
    }

    const dialogRef = this.dialog.open(CreateTaskComponent, {
      width: '750px',
      data: task 
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) this.loadTasks();
    });
  }

  viewTask(task: any) {
    const dialogRef = this.dialog.open(ViewTaskComponent, {
      width: '950px', 
      data: task 
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res === 'edit') {
        this.editTask(task);
      } else {
        this.loadTasks();
      }
    });
  }
}