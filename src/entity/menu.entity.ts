import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation,
    UpdateDateColumn,
} from "typeorm";
import { Store } from "./store.entity";

@Entity({
    name: "menus",
})
export class Menu {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Store, (store) => store.menus)
    store: Relation<Store>;

    @Column()
    food_name: string;

    @Column()
    food_img: string;

    @Column()
    food_desc: string;

    @Column()
    food_price: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
