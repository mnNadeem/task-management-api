import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsDate, IsOptional } from 'class-validator';
import { ETaskStatus } from 'src/enums/task.enum';

export class CreateTaskDto {
  @ApiProperty({ description: 'Title of the task', example: 'Complete documentation' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Description of the task', example: 'Complete the project documentation', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Deadline for the task', example: '2025-01-10T23:59:59Z' })
  @IsNotEmpty()
  @IsString()
  deadline: Date;
}
