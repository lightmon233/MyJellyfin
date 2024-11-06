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

    @Column('float')
    vote_average: number;
}