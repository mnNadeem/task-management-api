import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { ETaskStatus } from 'src/enums/task.enum';
import { TaskService } from './tasks.service';
import { UsersService } from 'src/users/users.service';
import { AssignTaskDto } from './dto/assign-task.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('TaskService', () => {
  let service: TaskService;
  let repo: Repository<Task>;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useClass: Repository,
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repo = module.get<Repository<Task>>(getRepositoryToken(Task));
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task', async () => {
    const dto = {
      title: 'Task 1',
      description: 'Description 1',
      deadline: new Date(),
      status: ETaskStatus.PENDING,
      userId: 1,
    };
    jest.spyOn(repo, 'create').mockReturnValue({ id: 1, ...dto });
    jest.spyOn(repo, 'save').mockResolvedValue({ id: 1, ...dto });
    expect(await service.create(dto)).toEqual({ id: 1, ...dto });
  });

  it('should throw error on task creation failure', async () => {
    const dto = {
      title: 'Task 1',
      description: 'Description 1',
      deadline: new Date(),
      status: ETaskStatus.PENDING,
      userId: 1,
    };
    jest.spyOn(repo, 'create').mockImplementation(() => {
      throw new Error('Task creation failed');
    });

    await expect(service.create(dto)).rejects.toThrow('Task creation failed');
  });

  it('should find all tasks', async () => {
    jest.spyOn(repo, 'find').mockResolvedValue([new Task()]);
    expect(await service.findAll()).toEqual([new Task()]);
  });

  it('should find one task', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(new Task());
    expect(await service.findOne(1)).toEqual(new Task());
  });

  it('should throw error if task not found in findOne', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toThrow(
      new HttpException('Task not found', HttpStatus.NOT_FOUND),
    );
  });

  it('should update a task', async () => {
    const dto: Partial<CreateTaskDto> = { title: 'Updated Task' };
    const updateTaskPayload = {
      id: 1,
      title: 'Updated Task',
      description: 'Description 1',
      deadline: new Date('2025-01-10T23:59:59Z'),
      status: ETaskStatus.IN_PROGRESS,
      userId: 1,
    };
    jest
      .spyOn(repo, 'update')
      .mockResolvedValue({ generatedMaps: [], raw: [], affected: 1 });
    jest.spyOn(repo, 'findOne').mockResolvedValue(updateTaskPayload);
    expect(await service.update(1, dto)).toEqual(updateTaskPayload);
  });

  it('should throw error if task not found in update', async () => {
    const dto: Partial<CreateTaskDto> = { title: 'Updated Task' };
    jest.spyOn(repo, 'findOne').mockResolvedValue(null);
    await expect(service.update(1, dto)).rejects.toThrow(
      new HttpException('Task not found', HttpStatus.NOT_FOUND),
    );
  });

  it('should throw error on task update failure', async () => {
    const dto: Partial<CreateTaskDto> = { title: 'Updated Task' };
    jest
      .spyOn(repo, 'update')
      .mockResolvedValue({ generatedMaps: [], raw: [], affected: 0 });
    jest.spyOn(repo, 'findOne').mockResolvedValue({
      id: 1,
      title: 'Old Task',
      description: 'Description 1',
      deadline: new Date('2025-01-10T23:59:59Z'),
      status: ETaskStatus.IN_PROGRESS,
      userId: 1,
    });

    await expect(service.update(1, dto)).rejects.toThrow(
      new HttpException('Failed to update task', HttpStatus.BAD_REQUEST),
    );
  });

  it('should remove a task', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue({
      id: 1,
      title: 'Updated Task',
      description: 'Description 1',
      deadline: new Date(),
      status: ETaskStatus.IN_PROGRESS,
      userId: 1,
    });
    jest.spyOn(repo, 'delete').mockResolvedValue({ raw: [], affected: 1 });
    expect(await service.remove(1)).toEqual({
      message: 'Task deleted successfully',
    });
  });

  it('should throw error if task not found in remove', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(null);
    await expect(service.remove(1)).rejects.toThrow(
      new HttpException('Task not found', HttpStatus.NOT_FOUND),
    );
  });

  it('should assign a task to a user', async () => {
    const assignTaskDto: AssignTaskDto = { userId: 1 };
    const task = {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      deadline: new Date(),
      status: ETaskStatus.PENDING,
      userId: null,
    };
    const user = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashedpassword',
      roleId: 1,
    };

    // Mock the task and user service methods
    jest.spyOn(repo, 'findOne').mockResolvedValue(task);
    jest.spyOn(userService, 'findOne').mockResolvedValue(user);
    jest.spyOn(repo, 'save').mockResolvedValue({ ...task, userId: user.id });

    expect(await service.assignTask(1, assignTaskDto)).toEqual({
      ...task,
      userId: user.id,
    });
  });

  it('should throw error when assigning task to a non-existent user', async () => {
    const assignTaskDto: AssignTaskDto = { userId: 999 }; // Non-existent user ID
    const task = {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      deadline: new Date(),
      status: ETaskStatus.PENDING,
      userId: null,
    };

    jest.spyOn(repo, 'findOne').mockResolvedValue(task);
    jest.spyOn(userService, 'findOne').mockResolvedValue(null); // User not found

    await expect(service.assignTask(1, assignTaskDto)).rejects.toThrow(
      new HttpException('User not found', HttpStatus.NOT_FOUND),
    );
  });
});
