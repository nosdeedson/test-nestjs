import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("user")
export class User{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    document: string;

    @Column()
    salary: string;


    @Column()
    test: string;

    @Column()
    test2: string;

    @Column()
    test3: string;
}