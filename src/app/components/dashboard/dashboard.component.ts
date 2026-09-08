import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { Dashboard } from '../../interfaces/dashboard.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  dashboardData!: Dashboard;

  userName: string = 'User';
  greetingText: string = 'Welcome';

  todoCount: number = 0;
  inProgressCount: number = 3;
  reviewCount: number = 1.5;
  doneCount: number = 0;
  invalid: number = 1;

  highPriority: number = 0;
  mediumPriority: number = 0;
  lowPriority: number = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.setGreeting();
    this.loadUserData();
    this.getDashboard();
  }

  setGreeting() {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      this.greetingText = 'Good Morning';
    } else if (currentHour < 16) {
      this.greetingText = 'Good Afternoon';
    } else {
      this.greetingText = 'Good Evening';
    }
  }

  loadUserData() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      const userObj = user.data || user.Data || user;
      this.userName = userObj.userName || userObj.UserName || 'User';
    }
  }

  getDashboard() {
    this.dashboardService.getDashboardData().subscribe({
      next: (res) => {
        this.dashboardData = res;
        this.processChartData(res);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  processChartData(data: Dashboard) {
    this.todoCount = (data.tasksByStatus['0'] || 0) + (data.tasksByStatus['ToDo'] || 0);
    this.inProgressCount = (data.tasksByStatus['1'] || 0) + (data.tasksByStatus['InProgress'] || 0);
    this.doneCount = (data.tasksByStatus['2'] || 0) + (data.tasksByStatus['Done'] || 0);
    this.reviewCount = 0; 

    this.highPriority = data.tasksByPriority['High'] || 0;
    this.mediumPriority = data.tasksByPriority['Medium'] || 0;
    this.lowPriority = data.tasksByPriority['Low'] || 0;
  }

  getBarHeight(count: number): string {
    const max = Math.max(this.todoCount, this.inProgressCount, this.reviewCount, this.doneCount, 1);
    return `${(count / max) * 100}%`;
  }

  getPriorityPercent(count: number): number {
    const total = this.highPriority + this.mediumPriority + this.lowPriority;
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  }
}