import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { IResponseMessage } from 'src/interfaces/response-message.interface';
import { AssignTaskDto } from './dto/assign-task.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UsersService,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const task = this.taskRepository.create(createTaskDto);
      return await this.taskRepository.save(task);
    } catch (error) {
      throw error;
    }
  }

  async assignTask(id: number, assignTaskDto: AssignTaskDto): Promise<Task> {
    try {
      const task = await this.findOne(id);
      const user = await this.userService.findOne(assignTaskDto.userId);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      task.userId = user.id;
      return await this.taskRepository.save(task);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<Task[]> {
    try {
      return await this.taskRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: number): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
      });

      if (!task) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }

      return task;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      const existingTask = await this.findOne(id);

      if (!existingTask) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }

      const updateResult = await this.taskRepository.update(id, updateTaskDto);

      if (!updateResult.affected) {
        throw new HttpException(
          'Failed to update task',
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number): Promise<IResponseMessage> {
    try {
      const existingTask = await this.findOne(id);

      if (!existingTask) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }

      const deleteResult = await this.taskRepository.delete(id);

      if (!deleteResult.affected) {
        throw new HttpException(
          'Failed to delete task',
          HttpStatus.BAD_REQUEST,
        );
      }

      return { message: 'Task deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
