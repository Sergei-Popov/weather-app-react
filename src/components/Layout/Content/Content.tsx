import styles from './Content.module.css';
import { getCurrentWeather } from '../../../api/api';
import type { CurrentWeatherResponse } from '../../../api/api';
import { useEffect } from 'react';
import { useState } from 'react';
import { Button } from 'antd';
import { FieldTimeOutlined } from '@ant-design/icons';

function Content( Props: { searchCity: string } ) {

  const [weatherData, setWeatherData] = useState<CurrentWeatherResponse | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // Индекс выбранного дня (0 - сегодня)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCurrentWeather(Props.searchCity);
        setWeatherData(data);
        setSelectedDayIndex(0); // Сбрасываем выбор на сегодня при смене города
      } catch (error) {
        console.error('Ошибка получения данных о погоде:', error);
      }
    };
    
    fetchData();
  }, [Props.searchCity]);

  return (
    <main className={styles.content}>
      {weatherData ? (
        <>
          <div className={styles.hero}>
            <div className={styles.hero__weather}>
              <img 
                className={styles.hero__img}
                src={selectedDayIndex === 0 ? weatherData.current?.condition?.icon : weatherData.forecast?.forecastday[selectedDayIndex]?.day?.condition?.icon}
                alt={Props.searchCity}
              />
              <p className={styles.hero__location}>{`${weatherData.location?.name}`}</p>
            </div>
            <div className={styles.hero__date}>
              <p>{new Date(weatherData.forecast?.forecastday[selectedDayIndex]?.date || new Date()).toLocaleDateString("ru-RU")}</p>
              <p>{new Date(weatherData.forecast?.forecastday[selectedDayIndex]?.date || new Date()).toLocaleDateString("ru-RU", { weekday: 'short' })}</p>
            </div>
            <div className={styles.hero__temperature}>
              <div className={styles.minTemp}>
                <span>Мин:</span>
                <p>{weatherData.forecast?.forecastday[selectedDayIndex]?.day?.mintemp_c}°C</p>
              </div>
              <div className={styles.avgTemp}>
                <span>Сред:</span>
                <p>{selectedDayIndex === 0 ? weatherData.current?.temp_c : weatherData.forecast?.forecastday[selectedDayIndex]?.day?.avgtemp_c}°C</p>
              </div>
              <div className={styles.maxTemp}>
                <span>Макс:</span>
                <p>{weatherData.forecast?.forecastday[selectedDayIndex]?.day?.maxtemp_c}°C</p>
              </div>
            </div>
            <div className={styles.hero__condition}>
              <p>{selectedDayIndex === 0 ? weatherData.current?.condition?.text : weatherData.forecast?.forecastday[selectedDayIndex]?.day?.condition?.text}</p>
            </div>
          </div>
          <div className={styles.container}>
            <div className={styles.additionalData}>
              <div className={styles.dataItem}>
                <img src="weather-icons/Wind.svg" alt="Скорость ветра" />
                <p>{selectedDayIndex === 0 ? weatherData.current?.wind_kph : weatherData.forecast?.forecastday[selectedDayIndex]?.day?.maxwind_kph} км/ч</p>
              </div>
              <div className={styles.dataItem}>
                <img src="weather-icons/Humidity.svg" alt="Влажность" />
                <p>{selectedDayIndex === 0 ? weatherData.current?.humidity : weatherData.forecast?.forecastday[selectedDayIndex]?.day?.avghumidity}%</p>
              </div>
              <div className={styles.dataItem}>
                <FieldTimeOutlined />
                <p>{new Date().toLocaleTimeString("ru-RU", { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </div>
          <div className={styles.container}>
            <div className={`${styles.container__scroll}`}>
              <div className={styles.forecast}>
                {weatherData.forecast?.forecastday.map((day, index) => (
                  <Button 
                    key={day.date} 
                    type={selectedDayIndex === index ? "primary" : "default"}
                    className={styles.forecast__day} 
                    ghost
                    onClick={() => setSelectedDayIndex(index)}
                  >
                    <img src={day.day.condition.icon} alt={day.day.condition.text} />
                    <p>{new Date(day.date).toLocaleDateString("ru-RU", { weekday: 'short' })}</p>
                    <p>{new Date(day.date).toLocaleDateString("ru-RU", { day: 'numeric', month: 'short' })}</p>
                    <div className={styles.forecast__temperature}>
                      <span>{day.day.maxtemp_c}°C</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </>
        ) : (
          <>
            <div className={`${styles.hero} ${styles.hero__loading}`}>
              <p>Загрузка...</p>
            </div>
            <div className={styles.container}>
              <h2>Прогноз на 14 дней</h2>
              <div className={styles.container__scroll} style={{ justifyContent: 'center', alignItems: 'center', display: 'flex', background: '#eee' }}>
                <p>Загрузка...</p>
              </div>
            </div>
          </>
        )}
    </main>
  )
}

export default Content
