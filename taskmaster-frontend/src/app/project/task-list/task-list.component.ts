import { Component, inject } from '@angular/core';
import { Task } from '../../task.model';
import { DatePipe, AsyncPipe } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { Observable, Subscription } from 'rxjs';

const emptyTask: Task = {
  name: '',
  description: '',
  dueDate: new Date(),
  completed: false,
  project: 1,
  id: 0,
};

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [DatePipe, AsyncPipe, TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  tasks: Task[] = [];
  showModal = false;
  selectedTask: Task = emptyTask;
  formType: 'CREATE' | 'UPDATE' = 'CREATE';
  tasks$!: Observable<Array<Task>>;

  private taskService = inject(TaskService);

  constructor() {
    this.updateTasks();
  }

  updateTasks() {
    this.tasks$ = this.taskService.getTasks();

    // Subscribe to the tasks observable and update the tasks array
    this.tasks$.subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
      },
      error: (error) => {
        console.error('Error fetching tasks', error);
      },
    });
  }

  handleCheckBox(id: number) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);

    if (taskIndex !== -1) {
      const updatedTask = { ...this.tasks[taskIndex] };
      updatedTask.completed = !updatedTask.completed;
      this.taskService.updateTask(updatedTask).subscribe({
        next: () => {
          this.tasks[taskIndex] = updatedTask;

          this.updateTasks();
        },
        error: (error) => {
          console.error('Error updating task', error);
        },
      });
    }
  }

  updateTask(task: Task) {
    this.selectedTask = task;
    this.formType = 'UPDATE';

    this.showModal = true;
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.updateTasks();
    });
  }

  handleModalClose(type: 'SUBMIT' | 'CANCEL') {
    if (type === 'SUBMIT') {
      this.updateTasks();
    }
    this.showModal = false;
  }
}
