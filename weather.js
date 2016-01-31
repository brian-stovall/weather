document.addEventListener('DOMContentLoaded', () => {
	//first, get references to DOM elements
	var grab = document.getElementById.bind(document);
	var place = grab('place');
	var temp = grab('temp');
	var humidity = grab('humidity');
	var clouds = grab('clouds');
	var wind = grab('wind');
	var precip = grab('precip');
	var stats = grab('stats');
	var loadMessage = grab('loadMessage');

	//boolean flags to track which units are being used
	temp.isCelsius = true;
	wind.isMeters = true;

	var myApiKey = 'f772b2d3d7afa3658b517ec81afdea91';
	var latitude, longitude;
	navigator.geolocation.getCurrentPosition( geoSuccess, geoFail );

	var weatherRequest = new XMLHttpRequest();

	weatherRequest.onload = function() {
		if (weatherRequest.status >= 200 && weatherRequest.status <= 400) {
			console.log('success! rec\'d: ' + weatherRequest.responseText);
			populate(JSON.parse(weatherRequest.responseText));
		}
		else console.log('fail... rec\'d: ' + weatherRequest.responseText);
	}
			

	function geoSuccess(position) { 
		//update the page's status
		loadMessage.textContent = 'Position successfully obtained. Requesting weather data.';
		//obtain lat & lon
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;

		//build and send the request
		var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude +
			'&lon=' + longitude + '&APPID=' + myApiKey
		weatherRequest.open('GET', url );
		weatherRequest.send();
	}

	function geoFail() { 
		loadMessage.textContent = 'Fatal error: Unable to determine your location.';
	}

	temp.onclick = () => {
		var value = parseInt(temp.textContent.match(/\d+/g));
		console.log(value);
		var unit = (temp.isCelsius) ? 'C' : 'F'; 
		value = Math.round(convertTemp(value, unit));
		temp.isCelsius = !temp.isCelsius;
		unit = (temp.isCelsius) ? 'C' : 'F';
		temp.textContent = 'Temperature: ' + value + unit;
	}

	wind.onclick = () => {
		var value = parseInt(wind.textContent.match(/\d+/g));
		console.log(value);
		var unit = (wind.isMeters) ? 'm/sec' : 'mph'; 
		value = Math.round(convertSpeed(value, unit));
		wind.isMeters = !wind.isMeters;
		var unit = (wind.isMeters) ? 'm/sec' : 'mph'; 
		wind.textContent = 'Wind Speed: ' + value + unit;
	}

	//populates the website with info from the api JSON
	function populate(data) {
		place.textContent = data.name + ', ' + data.sys.country;
		temp.textContent += parseInt(data.main.temp - 273.15) + 'C';
		humidity.textContent += data.main.humidity + '%';
		clouds.textContent += data.clouds.all + '%';
		wind.textContent += parseInt(data.wind.speed) + 'm/sec';
		if (data.rain && data.rain['3h'] > 0 ) precip.textContent += 'Raining';
		else if (data.snow && data.snow['3h'] > 0 ) precip.textContent += 'Snowing';
		else precip.textContent += 'None';

		loadMessage.parentNode.removeChild(loadMessage);
		stats.style.visibility = 'visible';
	}

	//converts celsius to fahrenheit and vice versa
	function convertTemp(number, unit) {
		if (unit === 'C') return number * (9/5) + 32;
		if (unit === 'F') return (number - 32) * (5/9);
		return false;
	}

	//converts between m/sec and mph
	function convertSpeed(number, unit) {
		if (unit === 'm/sec') return number * 2.23694;
		if (unit === 'mph') return  number / 2.23694;
		return false;
	}
	
});
