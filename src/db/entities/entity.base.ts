import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export interface IEntityBase {
    id: number;
    isActive: boolean;
    createdDate: Date;
}

export abstract class EntityBase {
    @PrimaryGeneratedColumn('increment')
    public id: number = 0;

    @Column({ name: 'is_active' })
    public isActive: boolean = true;

    @CreateDateColumn({ name: 'created_date' })
    public createdDate: Date = new Date();
}
