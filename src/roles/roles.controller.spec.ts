import { Test, TestingModule } from '@nestjs/testing';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { ERole } from 'src/enums/role.enum';
import { UsersService } from 'src/users/users.service';

describe('RoleController', () => {
  let controller: RolesController;
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: {
            create: jest.fn().mockImplementation((dto: CreateRoleDto) => Promise.resolve({ id: 1, ...dto })),
            findAll: jest.fn().mockResolvedValue([new Role()]),
            findOne: jest.fn().mockResolvedValue(new Role()),
            update: jest.fn().mockResolvedValue({ id: 1, roleName: ERole.ADMIN, description: 'Updated' }),
            remove: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a role', async () => {
    const dto: CreateRoleDto = { roleName: ERole.ADMIN, description: 'Administrator' };
    await expect(controller.create(dto)).resolves.toEqual({ id: 1, ...dto });
  });

  it('should return an array of roles', async () => {
    await expect(controller.findAll()).resolves.toEqual([new Role()]);
  });

  it('should return a single role', async () => {
    await expect(controller.findOne('1')).resolves.toEqual(new Role());
  });

  it('should update a role', async () => {
    const dto: Partial<CreateRoleDto> = { description: 'Updated' };
    await expect(controller.update('1', dto)).resolves.toEqual({ id: 1, roleName: ERole.ADMIN, description: 'Updated' });
  });

  it('should remove a role', async () => {
    await expect(controller.remove('1')).resolves.toEqual({});
  });
});
