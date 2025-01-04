import { ApiProperty } from '@nestjs/swagger';
import { ERole } from '../../enums/role.enum';

export class RoleResponseDto {
  @ApiProperty({ description: 'The unique ID of the role', example: 1 })
  id: number;

  @ApiProperty({
    description: 'The name of the role',
    enum: ERole,
    example: ERole.USER,
  })
  role: ERole;

  @ApiProperty({
    description: 'A brief description of the role',
    example: 'Has full access to all resources',
    nullable: true,
  })
  description?: string;
}
