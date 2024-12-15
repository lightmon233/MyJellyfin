import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Show {
    @PrimaryColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    first_air_date: string;

    @Column()
    poster_path: string;

    @Column()
    overview: string;

    @Column('float')
    vote_average: number;

    @Column()
    original_name: string;
}