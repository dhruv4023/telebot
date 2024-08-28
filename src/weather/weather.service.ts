import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import * as NodeCache from 'node-cache';

@Injectable()
export class WeatherService {
  private readonly apiKey: string = process.env.WEATHER_API_KEY;
  private readonly apiUrl: string = process.env.WEATHER_API_URL;
  private readonly cache: NodeCache;

  constructor(private readonly httpService: HttpService) {
    this.cache = new NodeCache({ stdTTL: 3600 }); // Cache items for 1 hour (3600 seconds)
  }

  async fetchWeatherData(city: string): Promise<string> {
    const cacheKey = `weather_${city.toLowerCase()}`;

    // Check if the data is in the cache
    const cachedData = this.cache.get(cacheKey);
    if (cachedData) {
      return cachedData as string;
    }

    // Fetch the data if not in cache
    try {
      const url = `${this.apiUrl}?key=${this.apiKey}&q=${city}`;

      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(url),
      );
      const weatherData = response.data;

      const weatherMessage = `
      **Weather Update for ${weatherData.location.name}, ${weatherData.location.region}, ${weatherData.location.country}**
      - **Temperature:** ${weatherData.current.temp_c}°C (${weatherData.current.temp_f}°F)
      - **Condition:** ${weatherData.current.condition.text}
      - **Feels Like:** ${weatherData.current.feelslike_c}°C (${weatherData.current.feelslike_f}°F)
      - **Wind:** ${weatherData.current.wind_kph} kph (${weatherData.current.wind_mph} mph) from ${weatherData.current.wind_dir}
      - **Humidity:** ${weatherData.current.humidity}%
      - **Pressure:** ${weatherData.current.pressure_mb} mb (${weatherData.current.pressure_in} in)
      - **Precipitation:** ${weatherData.current.precip_mm} mm (${weatherData.current.precip_in} in)
      - **Visibility:** ${weatherData.current.vis_km} km (${weatherData.current.vis_miles} miles)
      - **UV Index:** ${weatherData.current.uv}
      - **Last Updated:** ${weatherData.current.last_updated}
     `;

      // Store the data in the cache
      this.cache.set(cacheKey, weatherMessage);

      return weatherMessage.trim();
    } catch (error) {
      if (error.response) {
        throw new HttpException(
          `Error fetching weather data: ${error.response.status} - ${error.response.statusText}`,
          HttpStatus.BAD_GATEWAY,
        );
      } else if (error.request) {
        throw new HttpException(
          'Error fetching weather data: No response received from API',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      } else {
        throw new HttpException(
          `Error fetching weather data: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
