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
  };
}

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const API_URL = import.meta.env.VITE_WEATHER_API_URL;

export const userLocation = async () => {
  const response = await axios.get<UserLocation>('https://ipapi.co/json/');
  return response.data.city;
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
    label: `${el.name}, ${el.country}`
  }));
};

export const getCurrentWeather = async (searchCity: string) => {
  const response = await axios.get<CurrentWeatherResponse>(`${API_URL}/current.json`, {
    params: {
      q: searchCity,
      lang: 'ru',
      key: API_KEY
    }
  });

  return response.data;
};
