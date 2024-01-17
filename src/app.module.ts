import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ConfigProjectModule } from "./config/config.module";
import { TypeormModule } from "./typeorm/typeorm.module";
import { StoreModule } from "./store/store.module";
import { MenuModule } from "./menu/menu.module";
import { StoreReviewModule } from './store-review/store-review.module';

@Module({
    imports: [
        ConfigModule,
        ConfigProjectModule,
        TypeormModule.forRoot(),
        UserModule,
        AuthModule,
        StoreModule,
        MenuModule,
        StoreReviewModule,
    ],
    controllers: [AppController],
    providers: [AppService, ConfigService],
    exports: [ConfigService],
})
export class AppModule {}
