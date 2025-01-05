import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { RolesService } from './roles.service';
import { ERole } from 'src/enums/role.enum';
import { UsersService } from 'src/users/users.service';

describe('RolesService', () => {
  let service: RolesService;
  let repo: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    repo = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a role', async () => {
    const dto: CreateRoleDto = {
      roleName: ERole.ADMIN,
      description: 'Administrator',
    };
    jest.spyOn(repo, 'findOneBy').mockResolvedValue(null);
    jest.spyOn(repo, 'create').mockReturnValue({ id: 1, ...dto });
    jest.spyOn(repo, 'save').mockResolvedValue({ id: 1, ...dto });
    expect(await service.create(dto)).toEqual({ id: 1, ...dto });
  });

  it('should find all roles', async () => {
    jest.spyOn(repo, 'find').mockResolvedValue([new Role()]);
    expect(await service.findAll()).toEqual([new Role()]);
  });

  it('should find one role', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValue(new Role());
    expect(await service.findOne(1)).toEqual(new Role());
  });

  it('should update a role', async () => {
    const dto: Partial<CreateRoleDto> = { description: 'Updated' };
    jest
      .spyOn(repo, 'update')
      .mockResolvedValue({ generatedMaps: [], raw: [], affected: 1 });
    jest.spyOn(repo, 'findOne').mockResolvedValue({
      id: 1,
      roleName: ERole.ADMIN,
      description: 'Updated',
    });
    expect(await service.update(1, dto)).toEqual({
      id: 1,
      roleName: ERole.ADMIN,
      description: 'Updated',
    });
  });

  it('should remove a role', async () => {
    jest
      .spyOn(repo, 'findOne')
      .mockResolvedValue({
        id: 1,
        roleName: ERole.ADMIN,
        description: 'Administrator',
      });
    jest.spyOn(repo, 'delete').mockResolvedValue({ raw: [], affected: 1 });
    expect(await service.remove(1)).toEqual({ "message": "Role is deleted" });
  });
});
