document.addEventListener('DOMContentLoaded', () => {
	//first, get references to DOM elements
	var grab = document.getElementById.bind(document);
	var place = grab('place');
	var temp = grab('temp');
	var humidity = grab('humidity');
	var clouds = grab('clouds');
	var wind = grab('wind');
	var precip = grab('precip');

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
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
		console.log(latitude + ', ' + longitude);
		var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude +
			'&lon=' + longitude + '&APPID=' + myApiKey
		console.log('sending : ' + url);
		weatherRequest.open('GET', url );
		weatherRequest.send();
	}

	function geoFail() { 
		console.log('Geolocation doesn\'t seem to be functioning now...');
	}

	//populates the website with info from the api JSON
	function populate(data) {
		place.textContent = data.name + ', ' + data.sys.country;
		temp.textContent += parseInt(data.main.temp - 273.15) + 'C';
		humidity.textContent += data.main.humidity + '%';
		clouds.textContent += data.clouds.all + '%';
		wind.textContent += data.wind.speed + 'm/sec';
		if (data.rain && data.rain['3h'] > 0 ) precip.textContent += 'Raining';
		else if (data.snow && data.snow['3h'] > 0 ) precip.textContent += 'Snowing';
		else precip.textContent += 'None';
	}

	//converts celsius to fahrenheit and vice versa
	function convertTemp(number, unit) {
		if (unit === 'C') return number * (9/5) + 32;
		if (unit === 'F') return (number - 32) * (5/9);
		return false;
	}

	//converts between m/sec and mph
	function convertSpeed(number, unit) {
		if (unit === 'mpsec') return number * 2.23694;
		if (unit === 'mph') return  number / 2.23694;
		return false;
	}
	
});
