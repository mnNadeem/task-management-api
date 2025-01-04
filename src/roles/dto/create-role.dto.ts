import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ERole } from '../../enums/role.enum';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Role of the user',
    enum: ERole,
    example: ERole.USER,
  })
  @IsNotEmpty()
  @IsEnum(ERole)
  role: ERole;

  @ApiProperty({
    description: 'Description of the role',
    example: 'Administrator role',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
