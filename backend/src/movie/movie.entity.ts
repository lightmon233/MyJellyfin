import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    release_date: string;

    @Column()
    poster_path: string;

    @Column()
    overview: string;

    @Column()
    vote_average: number;
}