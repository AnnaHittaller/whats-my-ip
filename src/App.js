import { useState, useEffect } from "react";
import { countries } from "country-data";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import "./App.css";
import { GoGlobe } from "react-icons/go";
import {
	FaClock,
	FaMoneyBillAlt,
	FaPhoneAlt,
	FaRegCalendar,
} from "react-icons/fa";

const { DateTime } = require("luxon");


function App() {
	const [ipAddress, setIpAddress] = useState("");
	const [country, setCountry] = useState("");
	const [city, setCity] = useState("");
	const [flag, setFlag] = useState("");
	const [callingCode, setCallingCode] = useState("")
	const [currency, setCurrency] = useState("")
	const [currentTime, setCurrentTime] = useState(new Date());
	const currentDate = DateTime.now().toLocaleString(DateTime.DATE_MED);

	//I use this new state for centering the map
	const [location, setLocation] = useState({
		lat: "",
		lng: "",
	});

	//a variable for the zoom level of the map
	const ZOOM_LEVEL = 13;

	const customIcon = new Icon({
		iconUrl: require("./assets/markerIcon.png"),
		iconSize: [38, 58],
		popupAnchor: [0, -25],
	});


	console.log('rerender')

	useEffect(() => {
		// async function fetchIpAddress() {

		// 	const response = await fetch(
		// 		`https://geo.ipify.org/api/v2/country,city?apiKey=${process.env.REACT_APP_IPIFY_API_KEY}&ipAddress`
		// 	);
		// 	const data = await response.json();

		// 		console.log("IPIFY",data)
		// 		setIpAddress(data.ip);
		// 		setCountry(data.location.country);


		// }

		//fetchIpAddress();

		//So this is the new API fetch, I am using the ipAddress state from the first API to search for the location
		async function getIpAddress() {
			try {
				const responseIp = await axios.get(
					`https://api.ipdata.co?api-key=${process.env.REACT_APP_IPDATA_API_KEY}`
				);
				console.log("ip from new api", responseIp.data)
				setIpAddress(responseIp.data.ip);
				setCountry(responseIp.data.country_name)
				setCallingCode(responseIp.data.calling_code)
				setCurrency(responseIp.data.currency)

				// const response = await axios.get(
				// 	`https://api.ipdata.co/${ipAddress}?api-key=${process.env.REACT_APP_IPDATA_API_KEY}&fields=ip,is_eu,city,region,region_code,country_name,country_code,continent_name,continent_code,latitude,longitude,postal,calling_code,flag,emoji_flag,emoji_unicode`
				// );
				// console.log("new ipdata API response", response.data);
				//I haven't set the map's location to the data coming from the second API yet
				setLocation({
					lat: responseIp.data.latitude,
					lng: responseIp.data.longitude,
				});
				setFlag(responseIp.data.flag);
				setCity(responseIp.data.city);



			} catch (error) {
				console.error(error);
			}
		}


		getIpAddress();


		// const interval = setInterval(() => {
		// 	setCurrentTime(new Date());
		// }, 1000);
		// return () => clearInterval(interval);
	}, []);


	console.log(country)

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(new Date());
		}, 60000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="App">
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
							<div className="popup-line">
								<span>National flag:</span>
								<img src={flag} alt="flag" />
							</div>
							<div className="popup-line">
								<FaPhoneAlt className="icon" />
								<span>Int. country calling code:</span>
								<span>+{callingCode}</span>
							</div>
							<div className="popup-line">
								<FaMoneyBillAlt className="icon" />
								<span>Currencies:</span>
								<span>{currency.name} - {currency.symbol}</span>
							</div>
						</Popup>
					</Marker>
				) : null}
			</MapContainer>

			<div className="data-div">
				<p className="ip">Your IP address is: {ipAddress}</p>
				<div>
					<GoGlobe className="icon" />
					<span>You are located in</span><span className="bold">{city}</span>
					<span>, {country}</span>
				</div>

				<p>
					<FaRegCalendar className="icon" />
					Today is {currentDate}
				</p>

				<p>
					<FaClock className="icon" />
					The local time is:{" "}
					{currentTime.toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})}
				</p>
				<p className="bold">Click the map marker for extra infos</p>
			</div>
		</div>
	);
}

export default App;
