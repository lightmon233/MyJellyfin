import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    title: string;

    @Column()
    year: number;

    @Column()
    poster: string;

    @Column()
    overview: string;

    @Column()
    rating: number;
}