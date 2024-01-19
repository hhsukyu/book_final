import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigProjectModule } from './config/config.module';
import { TypeormModule } from './typeorm/typeorm.module';
import { StoreModule } from './store/store.module';
import { AdminReviewModule } from './admin-review/adminReview.module';
// import { StoreReviewModule } from './storeReview/store-review.module';
import { BookReviewModule } from './bookreview/bookreview.module';
import { MenuModule } from './menu/menu.module';
import { BookModule } from './book/book.module';

@Module({
  imports: [
    ConfigModule,
    ConfigProjectModule,
    TypeormModule.forRoot(),
    UserModule,
    AuthModule,
    StoreModule,
    MenuModule,
    AdminReviewModule,
    // StoreReviewModule,
    BookReviewModule,
    BookModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
  exports: [ConfigService],
})
export class AppModule {}
