/**
 * Get's translations
 * @param origin
 * @returns
 */
function getTranslation(origin)
{
	var result = $.grep(Translations, function(e) {
		return e.original == origin;
	});
	if(result.length==1)
	{
		return result[0].translated;
	}
	else
	{
		return origin;
	}
}


var geozoneControlArray = [];
/**
 * Removes all overlays
 */
function clearControlOverlays()
{
	for (var i = 0; i < geozoneControlArray.length; i++ )
	{
		geozoneControlArray[i].setMap(null);
	}
	geozoneControlArray = [];
}

function DistanceWidget(currmap, center, radius)
{
	center = typeof center !== 'undefined' ? center : currmap.getCenter();

	this.set('map', currmap);
	this.set('position', center);

	var marker = new google.maps.Marker({
		draggable: true
	});
	geozoneControlArray.push(marker);
	marker.bindTo('map', this);
	marker.bindTo('position', this);
	var radiusWidget = new RadiusWidget(radius);
	radiusWidget.bindTo('map', this);
	radiusWidget.bindTo('center', this, 'position');
	this.bindTo('distance', radiusWidget);
	this.bindTo('bounds', radiusWidget);
}
DistanceWidget.prototype = new google.maps.MVCObject();
RadiusWidget.prototype = new google.maps.MVCObject();

function RadiusWidget(newDistance)
{
	newDistance = typeof newDistance !== 'undefined' ? newDistance : 0.2;
	var circle = new google.maps.Circle({
		strokeWeight: 2
	});

	geozoneControlArray.push(circle);

	this.set('distance', newDistance);
	this.bindTo('bounds', circle);
	circle.bindTo('center', this);
	circle.bindTo('map', this);
	circle.bindTo('radius', this);

	this.addSizer_();
}

RadiusWidget.prototype.distance_changed = function()
{
	this.set('radius', this.get('distance') * 1000);
};

RadiusWidget.prototype.addSizer_ = function()
{
	var sizer = new google.maps.Marker({
		draggable: true
	});
	geozoneControlArray.push(sizer);

	sizer.bindTo('map', this);
	sizer.bindTo('position', this, 'sizer_position');

	var me = this;
	google.maps.event.addListener(sizer, 'drag', function()
	{
		me.setDistance();
	});
};

RadiusWidget.prototype.center_changed = function()
{
	var bounds = this.get('bounds');
	if(bounds)
	{
		var lng = bounds.getNorthEast().lng();
		var position = new google.maps.LatLng(this.get('center').lat(), lng);
		this.set('sizer_position', position);
	}
};

RadiusWidget.prototype.distanceBetweenPoints_ = function(p1, p2)
{
	if (!p1 || !p2)
	{
		return 0;
	}
	var R = 6371;
	var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
	var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
	Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return d;
};

RadiusWidget.prototype.setDistance = function()
{
	var pos = this.get('sizer_position');
	var center = this.get('center');
	var distance = this.distanceBetweenPoints_(center, pos);
	this.set('distance', distance);
};

jQuery.fn.chosenReset = function(e)
{
	$(this).chosen('destroy');
	$(this).prop("selectedIndex", -1);
	$(this).chosen();
};

var geozoneMap;

/**
 * Init's script
 */
function initialize()
{
	$("#geozoneChoser").chosenReset();
    var mapOptions = {
   		zoom: 6,
		panControl: false,
		streetViewControl: false,
		center: new google.maps.LatLng(56.26392, 9.501785),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	geozoneMap = new google.maps.Map(document.getElementById('geozoneMap'), mapOptions);
}

/**
 * Make changes on selected active geozone
 * 	The geozone has to be choosen from drop down.
 */
function changeActiveGeozone()
{
	clearControlOverlays();
	//$("#cancelGeozone").show();
	$("#deleteGeozone").show();
	$("#saveGeozone").show();
	$("#newGeozone").hide('');
	$.getJSON("/jscalls/getGeozone.php?id="+$("#geozoneChoser").val(), function(data)
	{
		geozoneMap.panTo(new google.maps.LatLng(data.result.Lat, data.result.Lng));
		geozoneMap.setZoom(16);

		clearControlOverlays();
	    var lat = data.result.Lat;
	    var lng = data.result.Lng;

		var distanceWidget = new DistanceWidget(geozoneMap, new google.maps.LatLng(lat, lng), (data.result.Radius/1000));
		google.maps.event.addListener(distanceWidget, 'distance_changed', function()
		{
			updateInfo(distanceWidget);
		});
		google.maps.event.addListener(distanceWidget, 'position_changed', function()
		{
			updateInfo(distanceWidget);
		});
		updateInfo(distanceWidget);
		$("#newGeozoneIsNew").val('false');
	});
}

/**
 * Opens modal for creating new geozone
 */
function initNewGeozone()
{
	cancelGeozone();
	$("#geozoneChoser").chosenReset();
	clearControlOverlays();
	$("#geozoneName").val('');
	$("#newGeozoneModal").dialog('open');
}

/**
 * Delete new geozone creation
 */
function cancelGeozone()
{
	google.maps.event.clearListeners(geozoneMap, 'click');
	clearControlOverlays();
	$("#saveGeozone").hide();
	$("#cancelGeozone").hide();
	$("#newGeozone").show();
	$("#deleteGeozone").hide();
	//$("#geozoneChoser").prop("selectedIndex", -1);
	$('#geozoneChoser').val('').trigger('chosen:updated');

}

/**
 * Creating a new geozone.
 * 	creates eventlisteners, to register click, position and distance changes.
 * @param name
 */
function newGeozone(name)
{
	$("#newGeozoneName").val(name);
	$("#newGeozoneIsNew").val('true');
	$("#deleteGeozone").hide();

	google.maps.event.addListener(geozoneMap, "click", function(event)
	{
		$("#saveGeozone").show();
	    var lat = event.latLng.lat();
	    var lng = event.latLng.lng();

		clearControlOverlays();

		if(geozoneMap.getZoom() < 15)
		{
			geozoneMap.panTo(new google.maps.LatLng(lat, lng));
			geozoneMap.setZoom(15);
		}

		var distanceWidget = new DistanceWidget(geozoneMap, new google.maps.LatLng(lat, lng));
		google.maps.event.addListener(distanceWidget, 'distance_changed', function()
		{
			updateInfo(distanceWidget);
		});
		google.maps.event.addListener(distanceWidget, 'position_changed', function()
		{
			updateInfo(distanceWidget);
		});
		updateInfo(distanceWidget);
	});
}

/**
 * Updates hidden inputs the position data
 * @param widget
 */
function updateInfo(widget)
{
	$("#newGeozonePosition").val(widget.get('position'));
	$("#newGeozoneRadius").val(widget.get('distance')*1000);
}

/**
 * Delete an active geozone
 */
function deleteGeozone()
{
	if(confirm(getTranslation("Are you sure?"))==true)
	{
		$.getJSON("/jscalls/deleteGeozone.php?id="+$("#geozoneChoser").val(), function(data)
		{
			if(data.success!=true)
			{
				alert(errorText);
			}
			else
			{
				updateGeozones();
				cancelGeozone();
			}
		});
	}
}

function updateGeozones()
{
	var geoZoneChoosen = $("#geozoneChoser").val();
	$('#geozoneChoser').find('option').remove().end();
	$('#geozoneChoser').append('<option value=""></option>');
	$.getJSON("/jscalls/getGeozones.php", function(data)
	{
		for (var int = 0; int < data.results.length; int++)
		{
			$('#geozoneChoser').append('<option value="' + data.results[int].ID + '">' + data.results[int].Name + '</option>');
		}
		$("#geozoneChoser").chosenReset();
		$("#geozoneChoser").val(geoZoneChoosen);
	});
}


/**
 * Save geozone
 */
function saveGeozone()
{
	$.getJSON("/jscalls/saveGeozone.php?isnew="+$("#newGeozoneIsNew").val()+"&name="+$("#newGeozoneName").val()+"&pos="+$("#newGeozonePosition").val()+"&radius="+$("#newGeozoneRadius").val()+"&id="+$("#geozoneChoser").val(), function(data)
	{
		if(data.success!=true)
		{
			alert(errorText);
		}
		else
		{
			$("#cancelGeozone").hide();
			$("#newGeozone").show();
			updateGeozones();
			$("#newGeozoneIsNew").val('false');
		}

	});
}

/**
 * Finds address and center to it
 */
function centerAddress()
{
	$.getJSON("/jscalls/getAddressesFromTerm.php?term="+$("#findAddressGeozone").val(), function(data)
	{
		if(data.status.results > 0)
		{
			geozoneMap.panTo(new google.maps.LatLng(data.results[0].lat, data.results[0].lng));
			geozoneMap.setZoom(16);
		}
		else
		{
			alert(getTranslation("The entered address was not found"));
			//Den indtastet adresse blev ikke fundet
		}
	});
}

function checkIfZoneExists(name)
{
	var isFound = false;
	$("#geozoneChoser > option").each(function()
	{
		if(this.text == name && this.text.length > 0)
			isFound = true;
	});
	return isFound;
}

function geozoneCreation()
{
	if(checkIfZoneExists($("#geozoneName").val()))
	{
		$("#geozoneError").html(getTranslation("The geozone already exists"));
	}
	else
	{
		if($("#geozoneName").val().length > 0 )
		{
			$("#newGeozone").hide('');
			$("#cancelGeozone").show('');
			newGeozone($("#geozoneName").val());
			$("#newGeozoneModal").dialog('close');
		}
		else
		{
			$("#geozoneError").html(getTranslation("The geozonename is too short"));
		}
	}
}

$(document).ready(function()
{
	$("#newGeozoneModal").dialog({
		autoOpen: false,
		width: 650,
		modal: true,
		draggable: false,
		resizable: false,
		buttons: {
			"CANCEL": function()
			{
				$(this).dialog("close");
			},
			"OK": function()
			{
				geozoneCreation();
			},

		}
	});

	$("#findAddressGeozone").keypress(function(e)
	{
		if(e.which==13)
			centerAddress();
	});

	$("#geozoneName").keypress(function(e)
	{
		if(e.which==13 && $("#geozoneName").val().length > 0)
		{
			geozoneCreation();
		}
	});
});