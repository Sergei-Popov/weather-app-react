import { useState } from 'react'
import './App.css'
import Content from './components/Layout/Content/Content'
import Header from './components/Layout/Header/Header'
function App() {
  const [searchCity, setSearchCity] = useState<string>('');

  return (
    <>
      <Header setSearchCity={setSearchCity} />
      <Content searchCity={searchCity}/>
    </>
  )
}

export default App
