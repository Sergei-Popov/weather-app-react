import { AutoComplete, Button, Space, Tooltip } from 'antd'
import type { AutoCompleteProps } from 'antd';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { searchAutocomplete, userLocation } from '../../../api/api';

function Header( Props: { setSearchCity: (SearchCity: string) => void } ) {
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);

  // Загружаем город пользователя при инициализации
  useEffect(() => {
    const loadInitialCity = async () => {
      try {
        const currentCity = await userLocation();
        Props.setSearchCity(currentCity || "Москва");
      } catch (error) {
        console.error('Ошибка получения геолокации:', error);
        Props.setSearchCity("Москва");
      }
    };

    loadInitialCity();
  }, [Props]);

  const onSelect = (SearchCity: string = "Москва") => {
    console.log('Выбран город: ', SearchCity);
    Props.setSearchCity(SearchCity);
  };

  const handleSearch = async (text: string) => {
    if (text.length < 3) {
      setOptions([]);
      return;
    }
    
    try {
      const data = await searchAutocomplete(text);
      setOptions(data);
    } catch (error) {
      console.error('Ошибка поиска:', error);
      setOptions([]);
    }
  };

  return (
    <header className={styles.header}>
      <AutoComplete
        options={options}
        style={{ flex: 1, height: '100%' }}
        onSelect={onSelect}
        onSearch={handleSearch}
        placeholder="Введите город"
      />
      <Space.Compact>
        <Tooltip title="На сегодня">
          <Button type="primary">На сегодня</Button>
        </Tooltip>
        <Tooltip title="На неделю">
          <Button type="default" disabled>На неделю</Button>
        </Tooltip>
      </Space.Compact>
    </header>
  )
}

export default Header
