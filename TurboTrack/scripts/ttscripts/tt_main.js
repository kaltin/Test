$(document).ready(function()
{
	$(".datepicker").datepicker({
		dateFormat: "dd-mm-yy"
	});
	$('[title!=""]').qtip({
		style: {classes: 'qtip-light'}
	});
	$("select").chosen();
});

// Changes the company select drop down
function changeCompany()
{
	var newCompany = $("#companySelector").val();
	WriteCookie("lastCompany", newCompany);
	$.getJSON("changeCompany.php?companyID="+newCompany, function(data)
	{
		if(data.success==true)
		{
			location.reload();
		}
		else
		{
			alert(data.status);
		}
	});
}

// Activate find address modal
function findAddress()
{
	$("#findAddressModal").animate({"height" : "225px", "margin-top" : "-112px"}, 0);
	$("#findAddressModal .modalBody").animate({"height" : "75px"}, 0);
	$(".addressResults").html('');
	$(".addressResults").hide();
	$("#address").val('');

	$(".modal_bg").slideDown();
	setTimeout(function(){
		$("#findAddressModal").slideDown();
		$("#address").focus();
	}, 300);
}

// Makes modal go away
function abortModal()
{
	$(".modal").slideUp();
	setTimeout(function()
	{
		$(".modal_bg").slideUp();
	}, 300);
}

// Finds device that are nearest
function getNearestDevice(lat, lng)
{
	$(".addressResults").html('');
	var resultArray = {};

	$.getJSON("jscalls/getGroupData.php?group=0", function(data)
	{
		var i = 1;
		$.each(data.vehicles, function(key, value)
		{
			$.getJSON("jscalls/getTwoPointsDistance.php?s="+lat+','+lng+'&d='+value.Latitude+','+value.Longitude, function(data)
			{
				if(data.distance != null)
				{
					var currDistanceVar;
					if(resultArray[data.duration.value])
					{
						currDistanceVar = data.duration.value;
						while(resultArray[currDistanceVar])
						{
							currDistanceVar++;
						}
					}
					else
					{
						currDistanceVar = data.duration.value;
					}
					resultArray[currDistanceVar] = {
						name: value.Name,
						dLatLng: lat+','+lng,
						sLatLng: value.Latitude+','+value.Longitude,
						distance: data.distance.text,
						duration: data.duration.text
					};
				}
			}).done(function()
			{
				if(i==data.vehicles.length)
					$(document).trigger("loadsDone");
				i++;
			});
		});
	});
	$(document).bind("loadsDone", function()
	{
		$.getJSON("jscalls/orderResults.php?array="+JSON.stringify(resultArray), function(data)
		{
			$.each(data, function(key, value)
			{
				$(".addressResults").append(
					'<div class="vehicle" onclick="window.open(\'https://maps.google.dk/maps?saddr=' + value.sLatLng + '&daddr=' + value.dLatLng + '\');">'+
					'<span class="name">' + value.name + '</span><br />' + value.distance + ' - ' + value.duration+
					'</div>'
				);
			});
		});
		$.each(resultArray, function(key, value)
		{
			delete resultArray[key];
		});
	});
}

function searchAddress()
{
	if($("#address").val()!="")
	{
		$("#findAddressModal").animate({"height" : "450px", "margin-top" : "-225px"}, 500);
		$("#findAddressModal .modalBody").animate({"height" : "300px"}, 500);
		$(".addressResults").show();

		$.getJSON("/jscalls/getAddressesFromTerm.php?term="+$("#address").val(), function(data)
		{
			$(".addressResults").html('');
			if(data.results)
			{
				if(data.results.length==1)
				{
					getNearestDevice(data.results[0].lat, data.results[0].lng);
				}
				else
				{
					$.each(data.results, function(key, value)
					{
						$(".addressResults").append('<div onclick="getNearestDevice('+value.lat+', '+value.lng+');" class="address">'+value.address+'</div>');
					});
				}
			}
			else
			{
				$(".addressResults").html('<span style="color:#F24B4B;">'+$.getTranslation('No results')+'</span>');
			}

		});
	}
}

function openMenuModal()
{
	$(".modal_bg").slideDown();
	setTimeout(function()
	{
		$("#menuModal").slideDown();
	}, 300);
}

function openGeozoneAdmin()
{
	$(".modal").slideUp();
	setTimeout(function()
	{
		$("#geozoneAdminModal").slideDown();
		setTimeout(initGeozoneMap(), 200);
	}, 300);
}

function openDrivingLog()
{
	$(".modal").slideUp();
	setTimeout(function()
	{
		$("#drivelogModal").slideDown();
		setTimeout(initDriveLog(), 200);
	}, 300);
}

$(document).ready(function()
{
	$("#address").keyup(function(e)
	{
		if(e.keyCode == 13)
			searchAddress();
	});
});