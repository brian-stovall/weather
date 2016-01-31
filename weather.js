document.addEventListener('DOMContentLoaded', () => {
	var grab = document.getElementById.bind(document);
	var myApiKey = 'f772b2d3d7afa3658b517ec81afdea91';

	var latitude, longitude;
	navigator.geolocation.getCurrentPosition( geoSuccess, geoFail );

	function geoSuccess(position) { 
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
		console.log(latitude + ', ' + longitude);
	}

	function geoFail() { 
		console.log('Geolocation doesn\'t seem to be functioning now...');
	}
	
});
