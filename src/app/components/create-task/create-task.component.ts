import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../../services/task.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,MatSnackBarModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent implements OnInit {

  taskForm: FormGroup;
  isEditMode: boolean = false;
  editTaskId: string = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateTaskComponent>,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
    this.isEditMode = !!(this.data && this.data.taskId);

    if (this.isEditMode) {
      this.editTaskId = this.data.taskId;
    }

    this.taskForm = this.fb.group({
      taskName:   ['', Validators.required],
      description:[''],
      priority:   ['2', Validators.required],
      status:     ['0', Validators.required],
      assigneeId: ['', Validators.required],
      dueDate:    ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data) {
      this.taskForm.patchValue({
        taskName:    this.data.taskName    || '',
        description: this.data.description || '',
        priority:    this.mapPriority(this.data.priority),
        status:      this.mapStatus(this.data.status),
        assigneeId:  this.data.assignedToId || '',
        dueDate:     this.data.dueDate
                       ? this.data.dueDate.substring(0, 10)
                       : ''
      });
    }
  }

  mapPriority(priority: string): string {
    const map: { [key: string]: string } = {
      'High':     '1',
      'Critical': '1',
      'Medium':   '2',
      'Low':      '3',
      '1':        '1',
      '2':        '2',
      '3':        '3'
    };
    return map[priority] || '2';
  }

 
mapStatus(status: string): string {
    const map: { [key: string]: string } = {
      'ToDo':       '0',
      'InProgress': '1',
      'Review':     '2',
      'Done':       '3',
      '0':          '0',
      '1':          '1',
      '2':          '2',
      '3':          '3'
    };
    return map[status] || '0';
  }

saveTask() {
    if (this.taskForm.valid) {
      const payload = {
        taskName:     this.taskForm.value.taskName,
        description:  this.taskForm.value.description,
        priority:     Number(this.taskForm.value.priority),
        status:       Number(this.taskForm.value.status),
        assignedToId: this.taskForm.value.assigneeId,
        dueDate:      this.taskForm.value.dueDate
      };

      if (this.isEditMode) {
        this.taskService.updateTask(this.editTaskId, payload).subscribe({
          next: () => {
            this.showToast('Task has been updated successfully.');
            this.dialogRef.close(true);
          },
          error: (err) => {
            console.error("UPDATE API ERROR:", err);
            this.showToast('Failed to update task. Please try again.', true);
          }
        });
      } else {
        this.taskService.createTask(payload).subscribe({
          next: () => { 
            this.showToast('New task has been created successfully.');
            this.dialogRef.close(true);
          },
          error: (err) => { 
            console.error("API Error Response:", err); 
            this.showToast('Failed to create task. Please try again.', true);
          }
        });
      }
    } else {
        this.showToast('Please fill all the required fields.', true);
    }
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  showToast(message: string, isError: boolean = false) {
    this.snackBar.open(message, 'Close', {
      duration: 3000, 
      horizontalPosition: 'right', 
      verticalPosition: 'top',
      panelClass: isError ? ['error-snackbar'] : ['success-snackbar'] 
    });
  }
}