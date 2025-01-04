import { ApiProperty } from '@nestjs/swagger';
import { ETaskStatus } from 'src/enums/task.enum';

export class TaskResponseDto {
  @ApiProperty({ description: 'Unique identifier for the task', example: 1 })
  id: number;

  @ApiProperty({ description: 'Title of the task', example: 'Complete project documentation' })
  title: string;

  @ApiProperty({ description: 'Detailed description of the task', example: 'Document all API endpoints and their usage.' })
  description: string;

  @ApiProperty({ description: 'Current status of the task', example: ETaskStatus.PENDING })
  status: ETaskStatus;

  @ApiProperty({ description: 'Deadline for the task', example: '2025-01-15T15:30:00.000Z' })
  deadline: Date;

  @ApiProperty({ description: 'ID of the user assigned to the task', example: 42 })
  userId: number;
}
