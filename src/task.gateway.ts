import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WsResponse,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { TaskService } from './tasks/tasks.service';
import { Task } from './tasks/entities/task.entity';

@Injectable()
@WebSocketGateway()
export class TaskGateway {
  constructor(private readonly taskService: TaskService) {}

  @SubscribeMessage('updateTask')
  async handleUpdateTask(@MessageBody() task: Task): Promise<WsResponse<Task>> {
    return { event: 'taskUpdated', data: task };
  }

  @SubscribeMessage('getAllTasks')
  async handleGetAllTasks(): Promise<WsResponse<Task[]>> {
    const tasks = await this.taskService.findAll();
    return { event: 'allTasks', data: tasks };
  }
}
