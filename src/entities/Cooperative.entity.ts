import {Column, Entity, PrimaryGeneratedColumn, Unique} from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'Cooperatives'})
export class Cooperative {
    constructor() {
        // Generate a UUID for the new user instance
        this.id = uuidv4();
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Unique(['name'])
    name: string

    @Column()
    community: string

    @Column()
    registrationFee: string

    @Column()
    monthlyFee: string

    @Column()
    minimalShare: string

}
