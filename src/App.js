import { useState, useEffect } from 'react'
import { countries } from "country-data";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from 'leaflet';
import "leaflet/dist/leaflet.css";
import mapMarker from './assets/markerIcon.png'
import axios from 'axios'
import './App.css';
const { DateTime } = require('luxon');

//note: icon color is #008eff

function App() {

  const [ipAddress, setIpAddress] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [flag, setFlag] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date());
  const currentDate = DateTime.now().toLocaleString(DateTime.DATE_MED);

  //I use this new state for centering the map
  const [location, setLocation] = useState({
    lat: "",
    lng: ""
  })

  const customIcon = new Icon({
    iconUrl: require('./assets/markerIcon.png'),
    iconSize: [38, 58],
    popupAnchor: [0, -25]
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


    }
    fetchIpAddress();

    //So this is the new API fetch, I am using the ipAddress state from the first API to search for the location
    async function getIpAddress() {
      try {

				const response = await axios.get(
					`https://api.ipdata.co/${ipAddress}?api-key=340954a33c57c7a9e9e975e9982c205f78cee1b0f1bc4039d70a192b&fields=ip,is_eu,city,region,region_code,country_name,country_code,continent_name,continent_code,latitude,longitude,postal,calling_code,flag,emoji_flag,emoji_unicode`
				);
				console.log("new ipdata API response", response.data);
				//I haven't set the map's location to the data coming from the second API yet
				setLocation({ lat: response.data.latitude, lng: response.data.longitude });
        setFlag(response.data.flag)
        setCity(response.data.city)
			} catch (error) {
        console.error(error);
      }
    }
    getIpAddress();

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);

  }, [])

  //console.log(location)

  return (
		<div className="App">
			<img src={flag} />
			<p className="ip">Your IP address is: {ipAddress}</p>
			<p>Your city is: {city}</p>
			<p>Your country is: {countries[country].name}</p>
			<p>Currencies: {countries[country].currencies}</p>
			<p>
				International country calling code:{" "}
				{countries[country].countryCallingCodes}
			</p>
			<p>Current data: {currentDate}</p>
      <p>Current local time: {currentTime.toLocaleTimeString()}</p>
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
				{location ? (
					<Marker position={[location.lat, location.lng]} icon={customIcon}>
						<Popup>
							<h3>IP Address: {ipAddress}</h3>
							<p>Location: this has to come from your code :)</p>
						</Popup>
					</Marker>
				) : null}
			</MapContainer>
		</div>
	);

}

export default App;
