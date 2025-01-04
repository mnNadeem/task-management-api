import { IsNotEmpty, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ETaskStatus } from 'src/enums/task.enum';

export class AssignTaskDto {
  @ApiProperty({
    description: 'ID of the user to whom the task will be assigned',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
