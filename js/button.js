
function buttonClick(clicked_id) {
var constUrl = "http://uzhcms1.cern.ch:2022/urn:xdaq-application:lid=85/";

	if(clicked_id != "EnableButton"){
	jQuery.ajax({
            url : constUrl + clicked_id,
            timeout : 2000,
        });
	//refresh page	
	//location.reload();
	document.reload();
	}

    if(clicked_id == "EnableButton"){
		$(".btn").prop("enabled",true);
	}
	if(clicked_id == "tmpButton"){
		$("#EnableButton").prop("disabled",true);
		
	}
	if(clicked_id == "Initialize"){
		$("#Resume").prop("disabled",true);
		$("#Pause").prop("disabled",true);
		
		
		$("#Configure").prop("enabled",true);
		$("#Halt").prop("enabled",true);
		
		
	}
	if(clicked_id == "Configure"){
		$("#Configure").prop("enabled",true);
		$("#Halt").prop("enabled",true);
		$("#Start").prop("enabled",true);
		
	}
	if(clicked_id == "Start"){
		$("#Pause").prop("enabled",true);
		$("#Stop").prop("enabled",true);
	}
	if(clicked_id == "Pause"){
		$("#Resume").prop("enabled",true);
		$("#TTCResync").prop("enabled",true);
		$("#TTCHardreset").prop("enabled",true);
		$("#Halt").prop("enabled",true);
		$("#Stop").prop("enabled",true);
	}
	if(clicked_id == "Resume"){
		$("#Pause").prop("enabled",true);
		$("#Stop").prop("enabled",true);
	}
	if(clicked_id == "Stop"){
		$("#Start").prop("enabled",true);
	}
	if(clicked_id == "Halt"){
		$("#Start").prop("disabled",true);
		$("#Resume").prop("disabled",true);
	
		$("#Configure").prop("enabled",true);
		$("#Halt").prop("enabled",true);
		$("#ColdReset").prop("enabled",true);
		$("#Pause").prop("enabled",true);
		$("#Stop").prop("enabled",true);
		
	}
	if(clicked_id == "ColdReset"){
		
	}
	if(clicked_id == "Reset"){
		$("#Start").prop("enabled",true);
	}
	if(clicked_id == "TTCResync"){
		
	}
	if(clicked_id == "TTCHardReset"){
		
	}
	if(clicked_id == "RenewHardwareLease"){
		
	}
	if(clicked_id == "ReadHardwareConfiguration"){
		
	}
	if(clicked_id == "SendL1A"){
		
	}
	
}

function defaultState(){
$("#Resume").prop("disabled",true);
$("#Stop").prop("disabled",true);
$("#Start").prop("disabled",true);
$("#Configure").prop("disabled",true);
$("#Pause").prop("disabled",true);

}