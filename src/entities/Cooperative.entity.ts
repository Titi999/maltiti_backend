import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'Cooperatives' })
export class Cooperative {
  constructor() {
    // Generate a UUID for the new user instance
    this.id = uuid();
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  community: string;

  @Column()
  registrationFee: string;

  @Column()
  monthlyFee: string;

  @Column()
  minimalShare: string;
}
