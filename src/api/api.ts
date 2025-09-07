import axios from 'axios';

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

export const userLocation = async (): Promise<string | null> => {
  // Проверяем поддержку геолокации
  if (!navigator.geolocation) {
    console.log('❌ Сервисы геолокации недоступны');
    return null;
  }
  
  try {
    console.log('Попытка получения местоположения через геолокацию браузера...');
    
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        { timeout: 10000, enableHighAccuracy: false }
      );
    });

    const { latitude, longitude } = position.coords;
    const weatherResponse = await axios.get(`${API_URL}/current.json`, {
      params: {
        q: `${latitude},${longitude}`,
        key: API_KEY
      }
    });
    
    const city = weatherResponse.data.location.name;
    console.log(`Успешно получен город: ${city}`);
    return city;
    
  } catch (error) {
    console.warn('Не удалось получить местоположение:', error);
    console.log('❌ Все сервисы геолокации недоступны');
    return null;
  }
};

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
