import styles from './Content.module.css';
import { getCurrentWeather } from '../../../api/api';
import type { CurrentWeatherResponse } from '../../../api/api';
import { useEffect } from 'react';
import { useState } from 'react';

function Content( Props: { searchCity: string } ) {

  const [weatherData, setWeatherData] = useState<CurrentWeatherResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCurrentWeather(Props.searchCity);
        setWeatherData(data);
      } catch (error) {
        console.error('Ошибка получения данных о погоде:', error);
      }
    };
    
    fetchData();
  }, [Props.searchCity]);

  return (
    <main className={styles.content}>
      {weatherData ? (
        <div className={styles.hero}>
          <div className={styles.hero__weather}>
            <img 
              className={styles.hero__img}
              src={weatherData.current?.condition?.icon}
              alt={Props.searchCity}
            />
            <p className={styles.hero__temperature}>
              <span className={styles.hero__tempC}>{weatherData.current?.temp_c}°C/</span>
              <span className={styles.hero__tempF}>{weatherData.current?.temp_f}°F</span>
            </p>
            <p className={styles.hero__location}>{`${weatherData.location?.name}, ${weatherData.location?.country}`}</p>
          </div>
          <div className={styles.hero__date}>
            <p>{new Date().toLocaleTimeString("ru-RU", { hour: '2-digit', minute: '2-digit' })}</p>
            <p>{weatherData?.current?.condition?.text}, {new Date().toLocaleDateString("ru-RU", { weekday: 'long' }).toUpperCase()}</p>
          </div>
        </div>
        ) : (
          <div className={`${styles.hero} ${styles.hero__loading}`}>
            <div className={styles.hero__weather}>
              <p>Загрузка...</p>
            </div>
          </div>
        )}
    </main>
  )
}

export default Content
