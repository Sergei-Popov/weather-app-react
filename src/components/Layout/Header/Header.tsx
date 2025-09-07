import { AutoComplete, Button, Drawer } from 'antd'
import { SettingOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';
import { searchAutocomplete, userLocation } from '../../../api/api';

interface HeaderProps {
  setSearchCity: (city: string) => void;
}

interface CityOption {
  key: string;
  value: string;
  label: string;
}

function Header( { setSearchCity }: HeaderProps ) {

  const [options, setOptions] = useState<CityOption[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  // Загружаем город пользователя при инициализации
  useEffect(() => {
    if (isInitialized) return;
    
    const loadInitialCity = async () => {
      try {
        const currentCity = await userLocation();
        if (currentCity) {
          setSearchCity(currentCity);
        }
      } catch (error) {
        console.error('Ошибка получения геолокации:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadInitialCity();
  }, [setSearchCity, isInitialized]);

  const onSelect = (value: string) => {
    console.log(`Выбран город: ${value}`);
    setSearchCity(value);
  };

  const handleSearch = async (text: string) => {
    if (text.length < 3) {
      setOptions([]);
      return;
    }
    
    try {
      const data = await searchAutocomplete(text);
      console.log('Получены данные:', data);
      setOptions(data || []);
    } catch (error) {
      console.error('Ошибка поиска:', error);
      setOptions([]);
    }
  };

  return (
    <header className={styles.header}>
      <Button type="text" onClick={showDrawer}>
        <SettingOutlined spin={true} style={{ fontSize: '1.5em' }} />
      </Button>
      <Drawer
        title={<h1 style={{ textAlign: "center" as const }}>Menu</h1>}
        closable={{ 'aria-label': 'Close Button' }}
        onClose={onClose}
        open={open}
        footer={<img src="/horizontal-logo.png" alt="Логотип" style={{ width: "100%"}} />}
      >
        <p>Comming soon...</p>
      </Drawer>
      <AutoComplete
        options={options}
        style={{ flex: 1, height: '100%', boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px', borderRadius: '10px' }}
        onSelect={onSelect}
        onSearch={handleSearch}
        placeholder="Введите город"
      />
      <img src="/rounded-logo.png" style={{ width: "10%" }} alt="Логотип" />
    </header>
  )
}

export default Header
