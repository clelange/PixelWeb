var constUrl = "http://uzhcms1.cern.ch:2022/urn:xdaq-application:lid=85/";
function buttonClick(clicked_id) {


	if(clicked_id != "ExpertActions"){
	jQuery.ajax({
            url : constUrl + clicked_id,
            timeout : 2000
        });
	}

    if(clicked_id == "ExpertActions"){
		$(".btn").prop("disabled",false);
		defaultState();
	}
	
	if(clicked_id == "Initialize"){
		$("#Resume").prop("disabled",true);
		$("#Pause").prop("disabled",true);
		$("#Initialize").prop("disabled",true);
		
		
		$("#Configure").prop("disabled",false);
		$("#Halt").prop("disabled",false);
		
		
	}
	if(clicked_id == "Configure"){
		$("#Configure").prop("disabled",true);
		
		$("#Halt").prop("disabled",false);
		$("#Start").prop("disabled",false);
		$("#ColdReset").prop("disabled",false);
	}
	if(clicked_id == "Start"){
		$("#Start").prop("disabled",true);
		
		$("#Pause").prop("disabled",false);
		$("#Stop").prop("disabled",false);
		
	}
	if(clicked_id == "Pause"){
		$("#Pause").prop("disabled",true);
		$("#Resume").prop("disabled",true);
	
		$("#TTCResync").prop("disabled",false);
		$("#TTCHardReset").prop("disabled",false);
		$("#Halt").prop("disabled",false);
		$("#Stop").prop("disabled",false);
	}
	if(clicked_id == "Resume"){
		$("#Resume").prop("disabled",true);
	
		$("#Pause").prop("disabled",false);
		$("#Stop").prop("disabled",false);
	}
	if(clicked_id == "Stop"){
		$("#Stop").prop("disabled",true);
		$("#Pause").prop("disabled",true);
		
		$("#Start").prop("disabled",false);
	}
	if(clicked_id == "Halt"){
		$("#Start").prop("disabled",true);
		$("#Resume").prop("disabled",true);
		$("#Stop").prop("disabled",true);
		$("#Pause").prop("disabled",true);
		
		$("#Configure").prop("disabled",false);
		$("#Halt").prop("disabled",false);
		$("#ColdReset").prop("disabled",false);		
	}
	if(clicked_id == "ColdReset"){
		
	}
	if(clicked_id == "Reset"){
		$("#Start").prop("disabled",false);
	}
	if(clicked_id == "TTCResync"){
		$("#TTCResync").prop("disabled",true);
	}
	if(clicked_id == "TTCHardReset"){
		$("#TTCHardReset").prop("disabled",true);
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
$("#TTCResync").prop("disabled",true);
$("#TTCHardReset").prop("disabled",true);

}

function loopUpdateVariables(input10){	
alert("zo loopUpdateVariables");	

	$('#tb_Status_uptime').html(input10);    
}