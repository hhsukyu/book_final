import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({})
export class TypeormModule {
  static forRoot(): DynamicModule {
    const typeormModule: DynamicModule = TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        logging: false,
        legacySpatialSupport: false,
      }),
      inject: [ConfigService],
    });

    // const typeormModule2: DynamicModule = TypeOrmModule.forRootAsync({
    //   useFactory: (configService: ConfigService) => ({
    //     name: 'subConnect',
    //     type: 'mysql',
    //     host: configService.get<string>('GOOGLE_DATABASE_HOST'),
    //     port: configService.get<number>('GOOGLE_DATABASE_PORT'),
    //     username: configService.get<string>('GOOGLE_DATABASE_USERNAME'),
    //     password: configService.get<string>('GOOGLE_DATABASE_PASSWORD'),
    //     database: configService.get<string>('GOOGLE_DATABASE_NAME'),
    //     autoLoadEntities: true,
    //     // synchronize: true,
    //     logging: false,
    //   }),
    //   inject: [ConfigService],
    // });

    return {
      module: TypeOrmModule,
      imports: [typeormModule],
      exports: [typeormModule],
    };
  }
}
