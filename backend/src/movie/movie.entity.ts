import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Movie {
    @PrimaryColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    release_date: string;

    @Column()
    poster_path: string;

    @Column()
    overview: string;

    @Column('float')
    vote_average: number;
}