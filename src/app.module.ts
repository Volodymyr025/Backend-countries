import { Module } from '@nestjs/common';
import { CountriesModule } from './countries/countries.module';

@Module({
  imports: [CountriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
