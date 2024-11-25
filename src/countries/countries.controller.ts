import { Controller, Get, Query } from '@nestjs/common';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get('available')
  findAll() {
    return this.countriesService.getCountryNames();
  }
  @Get('info')
  async getCountryInfo(@Query('countryCode') countryCode: string) {
    if (!countryCode) {
      throw new Error('country code and countryName are required parameters');
    }

    return this.countriesService.getInfo(countryCode);
  }
}
