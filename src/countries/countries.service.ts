import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CountriesService {
  constructor(private readonly httpService: HttpService) {}

  async getCountryNames() {
    const url = 'https://date.nager.at/api/v3/AvailableCountries';

    try {
      const { data } = await firstValueFrom(this.httpService.get(url));
      return data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch countries',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getInfo(countryCode: string) {
    const borderCountriesUrl = `https://date.nager.at/api/v3/CountryInfo/${countryCode}`;
    const populationUrl =
      'https://countriesnow.space/api/v0.1/countries/population';
    const flagUrl = 'https://countriesnow.space/api/v0.1/countries/flag/images';

    try {
      const countriesInfo = await firstValueFrom(
        this.httpService.get(borderCountriesUrl),
      );

      const [populationResponse, flagResponse] = await Promise.all([
        firstValueFrom(
          this.httpService.post(populationUrl, {
            country: countriesInfo.data.commonName,
          }),
        ),
        firstValueFrom(
          this.httpService.post(flagUrl, {
            country: countriesInfo.data.commonName,
          }),
        ),
      ]);

      const { border, ...data } = countriesInfo.data || [];
      const populationData =
        populationResponse.data.data?.populationCounts || [];
      const flagImageUrl = flagResponse.data.data?.flag || '';
      return {
        ...data,
        borderCountries: border,
        populationData,
        flagImageUrl,
      };
    } catch (error) {
      throw new Error(`Failed to fetch country details: ${error.message}`);
    }
  }
}
