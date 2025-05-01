import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicationsModule } from './medications/medications.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PharmaciesModule } from './pharmacies/pharmacies.module';
import { DoctorsModule } from './doctors/doctors.module';
import { MedicinesModule } from './medicines/medicines.module';
import { CountriesModule } from './countries/countries.module';
import { PharmacyMedicinesModule } from './pharmacy-medicines/pharmacy-medicines.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import databaseConfig from './config/database.config';
import { AssetsController } from './common/controllers/assets.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    MedicationsModule,
    UsersModule,
    AuthModule,
    NotificationsModule,
    PharmaciesModule,
    DoctorsModule,
    MedicinesModule,
    CountriesModule,
    PharmacyMedicinesModule,
    DeliveriesModule,
  ],
  controllers: [AppController, AssetsController],
  providers: [AppService],
})
export class AppModule {}
