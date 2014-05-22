function getDrivingLog(device, starttime, endtime){
	$.get("/jscalls/getDrivingLog.php?device="+device+"&fromdate="+starttime+"&todate="+endtime, function(data){
		$("#drivelogwrap").html(data);
		if(data.length > 30){
			$("#openExcel").show();
			$("#openExcel").attr("href", "/jscalls/getDrivingLog.php?device="+device+"&fromdate="+starttime+"&todate="+endtime+"&format=csv&sep=;");
		}else{
			$("#openExcel").hide();
		}
	});
	
}

function refreshDrivelog(){
	getDrivingLog($("#drivelogVehicleChooser").val(), $("#startTime").val(), $("#endTime").val());
}

function initDriveLog(){
	setTimeout(refreshDrivelog(), 500);
}