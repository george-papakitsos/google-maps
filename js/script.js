/**
 * Google Maps JS Module
 *
 * @author George Papakitsos <george@papakitsos.gr>
 * @copyright Copyright (c) 2014, George Papakitsos
 * @version 1.0
 */

var MapsModule = (function() {
	var currentLatitude		= null,
		currentLongitude	= null,
		map					= {},
		markers				= [],
		objectsMarkers		= [];
	
	var init = function() {
		currentLatitude		= 37.946862;
		currentLongitude	= 23.713297;
		bindEvents();
		showMap();
	};
	
	var bindEvents = function() {
		$("#buttonAddMarkerLatLng").click(function() { addMarkerLatLng(); });
		$("#buttonAddMarkerCurrentLocation").click(function() { addMarkerCurrentLocation(); });
		$("#buttonAddMarkerAddress").click(function() { addMarkerAddress(); });
	};
	
	var showMap = function(lat, lng) {
		if (lat === undefined) lat = currentLatitude;
		if (lng === undefined) lng = currentLongitude;
		latLng = new google.maps.LatLng(lat, lng);
		var mapOptions = {
				center: latLng,
				zoom: 7,
				mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	};
	
	var addMarker = function(lat, lng, title) {
		if (markers.indexOf(lat +","+ lng) !== -1) {
			alert("Marker already exists");
			return;
		}
		if (title === undefined) title = lat +","+ lng;
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat, lng),
		    map: map,
		    title: title,
		    animation: google.maps.Animation.DROP
		});
		markersLog(lat, lng, marker);
	};
	
	var markersLog = function(lat, lng, marker) {
		if (lat !== undefined && lng !== undefined) markers.push(lat +","+ lng);
		if (marker !== undefined ) objectsMarkers.push(marker);
		
		$("#markers").html("");
		$.each(markers, function(i, v) {
			$("#markers").append('<div>Marker '+ (i+1) +': '+ v +' (<a href="javascript: MapsModule.removeMarker('+ i +');">Remove</a>)</div>');
		});
	};
	
	var removeMarker = function(index) {
		objectsMarkers[index].setMap(null);
		markers.splice(index, 1);
		objectsMarkers.splice(index, 1);
		markersLog();
	};
	
	var addMarkerLatLng = function() {
		var lat = $("#latitude").val(),
			lng = $("#longitude").val();
		if (lat == "" || lng == "") {
			alert("Please fill in latitude & longitude");
			return;
		}
		addMarker(lat, lng);
	};
	
	var addMarkerCurrentLocation = function() {
		navigator.geolocation.getCurrentPosition(function(position) {
			lat = position.coords.latitude;
			lng = position.coords.longitude;
		    addMarker(lat, lng);
		}, function(error) {
			alert("Location not found");
		});
	};
	
	var addMarkerAddress = function() {
		var address = $("#address").val();
		if (address == "") {
			alert("Please fill in the address");
			return;
		}
		geocoder = new google.maps.Geocoder();
		geocoder.geocode({ "address": address }, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				$.each(results, function(i) {
					var lat		= results[i].geometry.location.lat();
					var lng		= results[i].geometry.location.lng();
					var title	= results[i].formatted_address;
					addMarker(lat, lng, title);
				});
			}
			else alert("Location not found");
	    });
	};
	
	return {
		init: init,
		removeMarker: removeMarker
	};
})();

$(window).load(function() {
	MapsModule.init();
});