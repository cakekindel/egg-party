import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class EntityBase
{
    @PrimaryGeneratedColumn('increment')
    public id: number = 0;

    @Column()
    public isActive: boolean = true;
}
