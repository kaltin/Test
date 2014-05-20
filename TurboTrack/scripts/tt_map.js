var infowindow = null;
var markersArray = [];
var lastID;
var map;
var zoomlevel = 0;
var generateOverlayActive = false;

infowindow = new google.maps.InfoWindow({
	content: "holding..."
});



function getDevicesColors(totalDevices)
{

var availableColors = new Array("Blue","Cyan","Gold","Green","Grey","Orange","Purple","Red");
//var availableColors = new Array("Blue","Cyan");
var	deviceColors = new Array();
var mod=parseInt(totalDevices/availableColors.length)+1;



for(i=0;i<=mod;i++)
{
//new_array = array1.concat(array2, array3, etc...);
deviceColors=deviceColors.concat(availableColors);
}

return deviceColors;

}

function clearOverlays()
{

	for (var i = 0; i < markersArray.length; i++ )
	{
		markersArray[i].setMap(null);
	}
	markersArray = [];
}

function findMarker(color, type)
{


	if(type=="stop")
	{
		return {
			url: 'images/markers/'+color+'/marker-'+color.toLowerCase()+'-'+type+'.png',
			size: new google.maps.Size(24, 24),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(12, 12)
		};
	}

	else
	{
		return {
			url: 'images/markers/'+color+'/marker-'+color.toLowerCase()+'-'+type+'.png',
			size: new google.maps.Size(22, 41),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(11, 41)
		};
	}
}

function replcSpecChar(str){
    var ret = str;
    ret = ret.replace("&aelig;",  "æ");
    ret = ret.replace("&oslash;", "ø");
    ret = ret.replace("&aring;",  "å");
    ret = ret.replace("&AElig;",  "Æ");
    ret = ret.replace("&Oslash;", "Ø");
    ret = ret.replace("&Aring;",  "Å");
    return ret;
}
/*

This function is called when you update the map and once every minute
It generates the new map with new informations regarding positin etc. of the selected vehicle
Params
type: 
*/

function generateOverlays(map, type, fitBounds, zoomZero)
{




try{

	if(generateOverlayActive == false)
	{
			
		var dataExists=true;			
		$("#loadingCoors").show();
		generateOverlayActive = true;
		var currentDevice = $("#deviceSelector").val();
		var date = $("#dateField").val();
		var currentPositionIcon = {
			url: 'images/current-location.gif',
			size: new google.maps.Size(38, 38),
			origin: new google.maps.Point(0,0),
			anchor: new google.maps.Point(19, 19)
		};
		var urlCall;

		if(type=="device")
		{
		
	
		
			$(".dateWrap").show();
			if(zoomZero == false)
			{
				urlCall = "jscalls/getDeviceData.php?device="+currentDevice+"&date="+date+"&lastID=0&zoom="+map.getZoom();
			}
			else
			{
				urlCall = "jscalls/getDeviceData.php?device="+currentDevice+"&date="+date+"&lastID=0&zoom=0";
			}
			
		
			$.getJSON(urlCall, function(data)
			{
						
				if(data.status.success==false)
				{
					alert(data.status.error);
				}
				if(data.status.rows==0)
				{
					alert($.getTranslation('No data'));
					$("#dateField").val('');
					dataExists=false;
					//throw 'Error: No data for current device';
				}
				if(data)
				{				
					clearOverlays();
				}
				var polyLineArray = [];
				var bounds = new google.maps.LatLngBounds();
				$(".log tbody").html('');

				var firstRow = true;
				var lastRow = null;
				
				// This is in case no values exists in the database
				if(dataExists)
				{
				
				$.each(data.events, function(key, value)
				{
				
					if(firstRow)
						bounds.extend(new google.maps.LatLng(value.Latitude, value.Longitude));

					lastRow = new google.maps.LatLng(value.Latitude, value.Longitude);
					var eventTitle = value.Status+"\n"+
					$.getTranslation("Date")+": "+value.Date+"\n"+
					$.getTranslation("Speed")+": "+value.KMH+" km/h \n"+
					$.getTranslation("Address")+": " + replcSpecChar(value.Address);

					if(value.Temperature1)
						eventTitle = eventTitle.concat("\n"+$.getTranslation("Temperature")+": "+value.Temperature1);

					lastID = value.ID;
					var newMarker = new google.maps.Marker({
						position: new google.maps.LatLng(value.Latitude, value.Longitude),
						map: map,
						zIndex: 1,
						optimized: true,
						icon: findMarker("Orange", value.IconType),
						title: eventTitle
					});
					polyLineArray.push(new google.maps.LatLng(value.Latitude, value.Longitude));
					//bounds.extend(new google.maps.LatLng(value.Latitude, value.Longitude));
					markersArray.push(newMarker);

					// here information about the position is added to the map
					$(".log tbody").append(
							'<tr onclick="eventDetails(this);" elm-lat="'+value.Latitude+'" elm-lng="'+value.Longitude+'">'+
							'<td><img width="18" height="18" title="'+value.Status+'" src="images/markers/marker-orange-'+value.IconType+'-c.png"></td>'+
							'<td>'+value.Date+'</td>'+
							'<td>'+value.KMH+' km/h</td>'+
							'<td>'+value.Address+'</td>'+
							'</tr>'
					);
					google.maps.event.addListener(newMarker, "dblclick", function(event)
					{
						map.setZoom(16);
						map.panTo(this.position);
						generateOverlays(map, "device", false, false);
					});
				
			
				
				}   );
				
				bounds.extend(lastRow);

				if(data.currentposition)
				{
					var eventTitle = $.getTranslation("Last location")+"\n"+
					$.getTranslation("Date")+": "+data.currentposition.Date+"\n"+
					$.getTranslation("Speed")+": "+data.currentposition.KMH+" km/h \n"+
					$.getTranslation("Address")+": "+replcSpecChar(data.currentposition.Address);

					if(data.currentposition.Temperature1)
						eventTitle = eventTitle.concat("\n"+$.getTranslation("Temperature")+": "+data.currentposition.Temperature1);

					var newMarker = new google.maps.Marker({
						position: new google.maps.LatLng(data.currentposition.Latitude, data.currentposition.Longitude),
						map: map,
						zIndex: 100,
						icon: currentPositionIcon,
						optimized: false,
						title: eventTitle
					});
					polyLineArray.push(new google.maps.LatLng(data.currentposition.Latitude, data.currentposition.Longitude));
					markersArray.push(newMarker);

					google.maps.event.addListener(newMarker, "dblclick", function(event)
					{
						map.setZoom(16);
						map.panTo(this.position);
					});
				}

				
				if(fitBounds==true)
					map.fitBounds(bounds);

					
							
					var polyPath = new google.maps.Polyline({
						path: polyLineArray,
						strokeColor: '#000',
						strokeOpacity: 1.0,
						strokeWeight: 2
					});
					
					
					
					polyPath.setMap(map);
				markersArray.push(polyPath);
				

				$("#dateField").val(data.status.date);
				}
			})
			.always(function()
			{
				$("#loadingCoors").hide();
				generateOverlayActive = false;
			});

		}
		else //når man vælger noget under en gruppe (eks. Teknikerbiler, alle mm)
		{

	
			$(".dateWrap").hide();
			$('#autoupdate').attr('checked', false);
			$(".deviceLocation").hide();
			$(".log tbody").html('');
			var bounds = new google.maps.LatLngBounds();

			$.getJSON("jscalls/getGroupData.php?group="+currentDevice, function(data)
			{
			
					
				
				if(data.status.success==false)
				{
					alert(data.status.error);
					if(!data.status.preventLogout)
						window.location = 'logout.php';
				}
				
				if(data.status.success==true)
				{
				
					clearOverlays();
				}
				
				
				var deviceColors=getDevicesColors(data.vehicles.length);
				var count=0;
				
				$.each(data.vehicles, function(key, value)
				{
				var containsEmptyVars=false;
					var eventTitle = value.Status+"\n"+
					$.getTranslation("Date")+": "+value.Date+"\n"+
					$.getTranslation("Speed")+": "+value.KMH+" km/h \n"+
					$.getTranslation("Address")+": "+value.Address;
					if(value.Temperature1) eventTitle = eventTitle.concat("\n"+$.getTranslation("Temperature")+": "+value.Temperature1);

							
					
					// checking empty values in the database
						if (typeof value.Latitude === 'undefined' ||  typeof value.Temperature1 === 'undefined'|| typeof value.Longitude === 'undefined' || typeof value.Address === 'undefined' || typeof value.KMH === 'undefined' || typeof value.Date === 'undefined'  )
						{
							containsEmptyVars=true;
						}
						
						
				if(!containsEmptyVars)					
				{
					
					var newMarker = new MarkerWithLabel({
						position: new google.maps.LatLng(value.Latitude, value.Longitude),
						map: map,
						zIndex: 1,
						optimized: false,
						icon: findMarker(deviceColors[count], value.IconType),
						title: eventTitle,
						labelContent: value.Name,
						labelClass: "labels"
					});
				
					
					bounds.extend(new google.maps.LatLng(value.Latitude, value.Longitude));
					
					markersArray.push(newMarker);

					google.maps.event.addListener(newMarker, "dblclick", function(event)
					{
						map.setZoom(16);
						map.panTo(this.position);
					});
					
					
				// here information about the position is added to the map
				$(".log tbody").append(
						'<tr onclick="eventDetails(this);" elm-lat="'+value.Latitude+'" elm-lng="'+value.Longitude+'">'+
						'<td><img style="float:left;" width="18" height="18" title="'+value.Status+'" src="images/markers/marker-orange-'+value.IconType+'-c.png"> &nbsp;&nbsp;'+value.Name+'</td>'+
						'<td>'+value.Date+'</td>'+
						'<td>'+value.KMH+' km/h</td>'+
						'<td>'+value.Address+'</td>'+
						'</tr>'
					);
					
					}
					count++;
					
				});
				if(fitBounds==true)
					map.fitBounds(bounds);
					
					
					
					
			})
			.always(function()
			{
				$("#loadingCoors").hide();
				generateOverlayActive = false;
			});
		}
	}
	
	
	
	}
	catch(err)
	{
	alert("error");
	//Handle errors here
	}
	
	
}

/*
This function is called when map is refreshed
*/
function initialize()
{

	var mapOptions = {
		zoom: 12,
		center: new google.maps.LatLng(55.745254, 10.887451),
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		streetViewControl: false,
		scaleControl: true
	};

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	// Viser danmark
	var bounds = new google.maps.LatLngBounds();
	bounds.extend(new google.maps.LatLng(57.539024, 7.646484));
	bounds.extend(new google.maps.LatLng(54.812504, 15.534668));
	map.fitBounds(bounds);

	// Henter geozones
	$.getJSON("jscalls/getGeozones.php", function(data)
	{
		if(data.status.rows != 0)
		{
			$.each(data.results, function(key, value)
			{
				new google.maps.Circle({
					strokeColor: '#ff0000',
					strokeOpacity: 0.8,
					strokeWeight: 2,
					fillColor: '#ff0000',
					fillOpacity: 0.35,
					map: map,
					center: new google.maps.LatLng(value.Lat, value.Lng),
					radius: value.Radius
				});
			});
		}
	});

	$(document).ready(function()
	{
		if($("#deviceSelector").val().substr(0,1)=="T")
		{
			generateOverlays(map, "device", true, true);
		}
		else
		{
			generateOverlays(map, "group", true, true);
		}

		setInterval(function()
		{
			if($("#deviceSelector").val().substr(0,1)=="T")
			{
				generateOverlays(map, "device", false, false);
			}
			else
			{
				generateOverlays(map, "group", false, false);
			}
		}, 120000);
	});

	google.maps.event.addListener(map, "idle", function(event)
	{
		if($("#deviceSelector").val().substr(0,1)=="T")
		{
			generateOverlays(map, "device", false, false);
		}
		else
		{
			generateOverlays(map, "group", false, false);
		}
	});

}
google.maps.event.addDomListener(window, 'load', initialize);

// Returnering af kortets synlige koordinater
function returnBounds(bounds, zoomlevel)
{

	var returnStr = "";
	if(bounds===undefined)
	{
	    returnStr    += '&zoom=' + zoomlevel;
	}
	else
	{
	    var southWest = bounds.getSouthWest();
	    var northEast = bounds.getNorthEast();
	    returnStr    += '&fromLat=' + southWest.lat() + '&fromLon=' + southWest.lng();
	    returnStr    += '&toLat=' + northEast.lat() + '&toLon=' + northEast.lng();
	    returnStr    += '&zoom=' + zoomlevel;
	}
    return returnStr;
}

function regenerate(checkStatus)
{
	generateOverlays(map, "device", true, false);
}

function forceChangeDevice(deviceID)
{
	$.post("/jscalls/saveVehicleSession.php",
	{
		device: deviceID
	});
	clearOverlays();
	generateOverlays(map, "device", true, true);
}

/*
	This function is called when selecting vehicle (device)

*/
function changeDevice()
{


	$("#dateField").val("");
	//here it is a vehicle - T must is the start of a number
	if($("#deviceSelector").val().substr(0,1)=="T")
	{
	
		$.post("/jscalls/saveVehicleSession.php", {
			device: $("#deviceSelector").val()
		});
		WriteCookie("lastVehicle", $("#deviceSelector").val().substr(1));
		clearOverlays();
		generateOverlays(map, "device", true, true);
	}
	//here it is a group
	else 
	{	
		WriteCookie("lastVehicle", $("#deviceSelector").val());
		clearOverlays();
		generateOverlays(map, "group", true, true);
	}
}
function eventDetails(elm)
{
	map.panTo(new google.maps.LatLng($(elm).attr("elm-lat"), $(elm).attr("elm-lng")));
	map.setZoom(16);
}
