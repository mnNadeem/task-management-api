import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { ERole } from '../enums/role.enum';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    try {
      const role = await this.findOneByRole(createRoleDto.roleName);
      if (role) {
        throw new HttpException(
          `Role ${createRoleDto.roleName} already exists`,
          HttpStatus.BAD_REQUEST,
        );
      }
      const newRole = this.roleRepository.create(createRoleDto);
      const savedRole = await this.roleRepository.save(newRole);

      return savedRole;
    } catch (error) {
      throw error;
    }
  }

  findAll(): Promise<RoleResponseDto[]> {
    return this.roleRepository.find({
      select: { id: true, roleName: true, description: true },
    });
  }

  async findOne(id: number): Promise<RoleResponseDto> {
    try {
      const role = await this.roleRepository.findOne({
        where: { id },
        select: { id: true, roleName: true, description: true },
      });

      return role;
    } catch (error) {
      throw error;
    }
  }

  async findOneByRole(role: ERole) {
    try {
      const newRole = await this.roleRepository.findOneBy({ roleName: role });
      return newRole;
    } catch (error) {
      throw error;
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      await this.findOne(id);
      const updatedRole = await this.roleRepository.update(id, updateRoleDto);

      if (!updatedRole.affected) {
        return { message: 'Could not update the Role' };
      }

      return this.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      const deletedRole = await this.roleRepository.delete(id);

      if (!deletedRole.affected) {
        throw new HttpException('Role not deleted', HttpStatus.NOT_FOUND);
      }

      return { message: 'Role is deleted' };
    } catch (error) {
      throw error;
    }
  }
}
