import {Column, Entity, PrimaryGeneratedColumn, Unique} from 'typeorm';
import * as bcrypt from 'bcrypt'
import {classToPlain, Exclude} from "class-transformer";
import {IsDate, IsEmail, IsStrongPassword, MinLength} from "class-validator";
import { v4 as uuidv4 } from 'uuid';

@Entity({ name: 'users' })
export class User {
    constructor() {
        // Generate a UUID for the new user instance
        this.id = uuidv4();
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsEmail()
    @Unique(['email'])
    email: string;

    @Column()
    name: string;

    @Column()
    @Exclude()
    password: string;

    async validatePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

    @Column()
    userType: string;

    @Column({nullable: true})
    permissions: string;

    @Column({nullable: true})
    rememberToken: string

    @Column({default: 'active'})
    status: string

    @Column({nullable: true})
    dob: Date

    @Column({ default: new Date() })
    createdAt: Date;


    @Column({nullable: true})
    emailVerifiedAt: Date;

    @Column({ default: new Date() })
    updatedAt: Date;
}
