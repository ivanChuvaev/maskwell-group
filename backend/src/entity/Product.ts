import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm'

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    article: string

    @Column()
    name: string

    @Column()
    price: number

    @Column()
    quantity: number

    @CreateDateColumn()
    createdAt: Date
}
