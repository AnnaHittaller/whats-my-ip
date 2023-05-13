import { useState, useEffect } from 'react'
import { countries } from "country-data";
import { MapContainer, TileLayer } from "react-leaflet";
import axios from 'axios'
import "leaflet/dist/leaflet.css";
import './App.css';

function App() {

  const [ipAddress, setIpAddress] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
 
  //I use this new state for centering the map
  const [location, setLocation] = useState({
    lat: "",
    lng: ""
  })

  //a variable for the zoom level of the map
  const ZOOM_LEVEL = 13;

  useEffect(() => {
    async function fetchIpAddress() {
      const response = await fetch('https://geo.ipify.org/api/v2/country,city?apiKey=at_oznxDs8Rd53Zv6YEgyHmkeOjdj1Qs&ipAddress');
      const data = await response.json();

      //console.log(data)
      setIpAddress(data.ip)
      setCountry(data.location.country)
      setCity(data.location.city)
      setLocation({lat: data.location.lat, lng: data.location.lng})

    }
    fetchIpAddress();
    
    //So this is the new API fetch, I am using the ipAddress state from the first API to search for the location
    async function getIpAddress(){
      try {
				const response = await axios.get(
					`https://api.ipdata.co/${ipAddress}?api-key=340954a33c57c7a9e9e975e9982c205f78cee1b0f1bc4039d70a192b&fields=ip,is_eu,city,region,region_code,country_name,country_code,continent_name,continent_code,latitude,longitude,postal,calling_code,flag,emoji_flag,emoji_unicode`
				);
				console.log("new ipdata API response", response.data);
				//I haven't set the map's location to the data coming from the second API yet
				//setLocation({ lat: response.data.latitude, lng: response.data.longitude });
			} catch (error) {
        console.error(error);
      }
    }

    getIpAddress()
    
  }, [])
  
  //console.log(location)

  return (
		<div className="App">
			{/* FLAG HERE */}
			<p>Your IP address is: {ipAddress}</p>
			<p>Your city is: {city}</p>
			<p>Your country is: {countries[country].name}</p>
			<p>Currencies: {countries[country].currencies}</p>
			<p>
				International country calling code:{" "}
				{countries[country].countryCallingCodes}
			</p>
			{/* <p>DATE HERE</p> */}
			{/* <p>LOCAL TIME HERE</p> */}
			<MapContainer
      // the key in needed to automatically fly the map to the location, because without it it doesn't rerender and just shows the middle of the ocean
      // as the key contains the location variables, it makes the map rerender every time when the location changes
				key={`${location.lat}-${location.lng}`}
				center={[location.lat, location.lng]}
				zoom={ZOOM_LEVEL}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
			</MapContainer>
		</div>
	);
}

export default App;
