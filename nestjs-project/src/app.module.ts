import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { PromotionsModule } from './promotions/promotions.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    PromotionsModule,
  ],
})
export class AppModule {}
