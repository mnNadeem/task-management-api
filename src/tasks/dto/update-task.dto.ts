import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ETaskStatus } from 'src/enums/task.enum';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    description: 'Status of the task',
    example: ETaskStatus.IN_PROGRESS,
  })
  @IsOptional()
  @IsEnum(ETaskStatus)
  status?: ETaskStatus;
}
