import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ETaskStatus } from 'src/enums/task.enum';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  deadline: Date;

  @Column({ type: 'enum', enum: ETaskStatus, default: ETaskStatus.PENDING })
  status: ETaskStatus;

  @ManyToOne(() => User, (user) => user.tasks)
  user: User;

  @Column({ name: 'user_id', nullable: true })
  userId: number;
}
