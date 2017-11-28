import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from './';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public first_name?: string;

  @Column()
  public last_name?: string;

  @OneToMany(type => Task, task => task.user)
  tasks?: Task[] = [];

  constructor(user: User = {} as User) {
    const { first_name, last_name } = user;
    this.first_name = first_name;
    this.last_name = last_name;
  }
}
