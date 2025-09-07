import axios from 'axios';

interface UserLocation {
  ip: string;
  network: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  country_code: string;
  country_code_iso3: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
}

interface AutocompleteItem {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

export interface CurrentWeatherResponse {
  // Object structure based on the weather API response
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_mph: number;
    gust_kph: number;
    short_rad: number;
    diff_rad: number;
    dni: number;
    gti: number;
  },
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        maxtemp_f: number;
        mintemp_c: number;
        mintemp_f: number;
        avgtemp_c: number;
        avgtemp_f: number;
        maxwind_mph: number;
        maxwind_kph: number;
        totalprecip_mm: number;
        totalprecip_in: number;
        avgvis_km: number;
        avgvis_miles: number;
        avghumidity: number;
        daily_will_it_rain: number;
        daily_chance_of_rain: number;
        daily_will_it_snow: number;
        daily_chance_of_snow: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        },
        uv: number;
      },
      astro: {
        sunrise: string;
        sunset: string;
        moonrise: string;
        moonset: string;
        moon_phase: string;
        moon_illumination: number;
        is_moon_up: number;
        is_sun_up: number;
      },
      hour: Array<{
        time_epoch: number;
        time: string;
        temp_c: number;
        temp_f: number;
        is_day: number;
        condition: {
          text: string;
          icon: string;
          code: number;
        };
        wind_mph: number;
        wind_kph: number;
        wind_degree: number;
        wind_dir: string;
        pressure_mb: number;
        pressure_in: number;
        precip_mm: number;
        precip_in: number;
        humidity: number;
        cloud: number;
        feelslike_c: number;
        feelslike_f: number;
        windchill_c: number;
        windchill_f: number;
        heatindex_c: number;
        heatindex_f: number;
        dewpoint_c: number;
        dewpoint_f: number;
        vis_km: number;
        vis_miles: number;
        uv: number;
        gust_mph: number;
        gust_kph: number;
        short_rad: number;
        diff_rad: number;
        dni: number;
        gti: number;
      }>;
    }>;
  };
}

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const API_URL = import.meta.env.VITE_WEATHER_API_URL;

export const userLocation = async (): Promise<string> => {
  // Список сервисов для получения местоположения пользователя
  const locationServices = [
    // Сервис 1: ipapi.co (подробная информация)
    async () => {
      const response = await axios.get<UserLocation>('https://ipapi.co/json/');
      return response.data.city;
    },
    
    // Сервис 2: ipify + ip-api.com
    async () => {
      const ipResponse = await axios.get('https://api.ipify.org?format=json');
      const locationResponse = await axios.get(`https://ip-api.com/json/${ipResponse.data.ip}?fields=city`);
      return locationResponse.data.city;
    },
    
    // Сервис 3: ipgeolocation.io (требует регистрации, но есть бесплатный план)
    async () => {
      const response = await axios.get('https://api.ipgeolocation.io/ipgeo?apiKey=free&fields=city');
      return response.data.city;
    },
    
    // Сервис 4: freeipapi.com
    async () => {
      const response = await axios.get('https://freeipapi.com/api/json');
      return response.data.cityName;
    },
    
    // Сервис 5: Геолокация браузера + Weather API
    async () => {
      if (!navigator.geolocation) {
        throw new Error('Геолокация не поддерживается');
      }
      
      return new Promise<string>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const weatherResponse = await axios.get(`${API_URL}/current.json`, {
                params: {
                  q: `${latitude},${longitude}`,
                  key: API_KEY
                }
              });
              resolve(weatherResponse.data.location.name);
            } catch (error) {
              reject(error);
            }
          },
          (error) => reject(error),
          { timeout: 10000, enableHighAccuracy: false }
        );
      });
    }
  ];

  // Пробуем сервисы по очереди
  for (let i = 0; i < locationServices.length; i++) {
    try {
      console.log(`Попытка получения местоположения через сервис ${i + 1}...`);
      const city = await locationServices[i]();
      if (city && city.trim()) {
        console.log(`Успешно получен город: ${city} (сервис ${i + 1})`);
        return city;
      }
    } catch (error) {
      console.warn(`Сервис ${i + 1} недоступен:`, error);
      // Продолжаем со следующим сервисом
    }
  }
  
  // Если все сервисы не сработали
  console.log('Все сервисы геолокации недоступны, используется Москва по умолчанию');
  return "Москва";
}

export const searchAutocomplete = async (queryText: string) => {
  const response = await axios.get<AutocompleteItem[]>(`${API_URL}/search.json`, {
    params: {
      q: queryText,
      key: API_KEY
    }
  });

  return response.data.map((el: AutocompleteItem) => ({ 
    key: el.id.toString(),
    value: el.name,
    label: `${el.name}, ${el.country}`,
    lat: el.lat,
    lon: el.lon
  }));
};

export const getCurrentWeather = async (searchCity: string) => {
  console.log(searchCity);
  
  const response = await axios.get<CurrentWeatherResponse>(`${API_URL}/forecast.json`, {
    params: {
      q: searchCity,
      lang: 'ru',
      days: 14,
      key: API_KEY
    }
  });

  return response.data;
};
