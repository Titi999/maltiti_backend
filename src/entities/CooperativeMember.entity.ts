import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Cooperative } from './Cooperative.entity';

@Entity({ name: 'cooperativeMembers' })
export class CooperativeMember {
  constructor() {
    // Generate a UUID for the new user instance
    this.id = uuidv4();
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Cooperative, cooperative => cooperative.id)
  cooperative: string;

  @Column()
  @Unique(['phoneNumber'])
  phoneNumber: string;

  @Column()
  houseNumber: string;

  @Column()
  gpsAddress: string;

  @Column()
  image: string;

  @Column()
  idType: string;

  @Unique(['email'])
  @Column()
  idNumber: string;

  @Column()
  community: string;

  @Column()
  district: string;

  @Column()
  region: string;

  @Column()
  dob: Date;

  @Column()
  education: string;

  @Column()
  occupation: string;

  @Column()
  secondaryOccupation: string;

  @Column()
  crops: string;

  @Column()
  farmSize: number;
}
