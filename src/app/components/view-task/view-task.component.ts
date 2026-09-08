import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-task',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './view-task.component.html',
  styleUrl: './view-task.component.css'
})
export class ViewTaskComponent {

  constructor(
    public dialogRef: MatDialogRef<ViewTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }

  openEdit() {
    this.dialogRef.close('edit');
  }

  getProfilePic(name: string): string {
    if (!name) return 'https://avatar.iran.liara.run/public/avatar';
    
    if (name.includes('Mohanish Guru')) {
      return 'https://avatar.iran.liara.run/public/avatar';
    }
    if (name.includes('Mohanish')) {
      return 'assets/mohanish.jpg';
    }
    if (name.includes('Ajay')) {
      return 'https://avatar.iran.liara.run/public/boy?username=Ajay';
    }
    
    return 'https://avatar.iran.liara.run/public/avatar';
  }

  getStatusText(status: any): string {
    if (status == 0 || status === 'ToDo' || status === '0') return 'To Do';
    if (status == 1 || status === 'InProgress' || status === '1') return 'In Progress';
    if (status == 2 || status === 'Done' || status === '2') return 'Completed';
    return 'To Do'; 
  }

  getPriorityText(priority: any): string {
    if (priority == 1 || priority === 'High' || priority === '1') return 'High';
    if (priority == 2 || priority === 'Medium' || priority === '2') return 'Medium';
    if (priority == 3 || priority === 'Low' || priority === '3') return 'Low';
    return 'Low'; 
  }
}