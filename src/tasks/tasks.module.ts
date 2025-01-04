import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskService } from './tasks.service';
import { TaskController } from './tasks.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), UsersModule, AuthModule],
  controllers: [TaskController],
  providers: [TaskService, JwtService],
  exports: [TaskService],
})
export class TaskModule {}
