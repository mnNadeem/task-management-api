import { Test, TestingModule } from '@nestjs/testing';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { TaskController } from './tasks.controller';
import { TaskService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('TasksController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: {
            create: jest
              .fn()
              .mockImplementation((dto: CreateTaskDto) =>
                Promise.resolve({ id: 1, ...dto }),
              ),
            findAll: jest.fn().mockResolvedValue([new Task()]),
            findOne: jest.fn().mockResolvedValue(new Task()),
            update: jest
              .fn()
              .mockResolvedValue({ id: 1, title: 'Updated Task' }),
            remove: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: UsersService,
          useValue: {
            someMethod: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            someMethod: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a task', async () => {
    const dto: CreateTaskDto = {
      title: 'Task 1',
      description: 'Description 1',
      deadline: new Date(),
    };
    await expect(controller.create(dto)).resolves.toEqual({ id: 1, ...dto });
  });

  it('should return an array of tasks', async () => {
    await expect(controller.findAll()).resolves.toEqual([new Task()]);
  });

  it('should return a single task', async () => {
    await expect(controller.findOne(1)).resolves.toEqual(new Task());
  });

  it('should update a task', async () => {
    const dto: Partial<UpdateTaskDto> = { title: 'Updated Task' };
    await expect(controller.update(1, dto)).resolves.toEqual({
      id: 1,
      title: 'Updated Task',
    });
  });

  it('should remove a task', async () => {
    await expect(controller.remove(1)).resolves.toEqual({});
  });
});
