import { Module } from "@nestjs/common";
import { StoreService } from "./store.service";
import { StoreController } from "./store.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { Store } from "../entity/store.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Store])],
    providers: [StoreService],
    controllers: [StoreController],
})
export class StoreModule {}
