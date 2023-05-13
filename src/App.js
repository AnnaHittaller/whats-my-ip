import { useState, useEffect } from 'react'
import './App.css';

function App() {

  const [ipAddress, setIpAddress] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')

  useEffect(() => {
    async function fetchIpAddress() {
      const response = await fetch('https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_oznxDs8Rd53Zv6YEgyHmkeOjdj1Qs&ipAddress');
      const data = await response.json();
      setIpAddress(data.ip)
      setCountry(data.location.country)
      setCity(data.location.city)
    }
    fetchIpAddress();
  }, [])


  return (
    <div className="App">
      {/* FLAG HERE */}
      <p>Your IP address is: {ipAddress}</p>
      <p>Your city is: {city}</p>
      <p>Your country is: {country}</p>
      {/* <p>DATE HERE</p> */}
      {/* <p>LOCAL TIME HERE</p> */}
    </div>
  );
}

export default App;
