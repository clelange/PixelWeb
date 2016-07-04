var constUrl = "http://uzhcms1.cern.ch:2022/urn:xdaq-application:lid=85/";
var ExpIsClicked = false;
function buttonClick(clicked_id) {
//alert(currentState);

	if(clicked_id != "ExpertActions"){
	jQuery.ajax({
            url : constUrl + clicked_id,
            timeout : 2000
        });
	}

    if(clicked_id == "ExpertActions"){
		$(".btn").prop("disabled",false);
		
		if (ExpIsClicked == false)
		{
			ExpIsClicked = true;
			document.getElementById("ExpertActions").setAttribute("class", "btn btn-danger");
		}
		else{
			ExpIsClicked = false;
			document.getElementById("ExpertActions").setAttribute("class", "btn btn-success");
			}
	}
	
	if (ExpIsClicked == false){
		buttonToState(currentState);

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
}

function buttonToState(state){	
	$("#ColdReset").prop("disabled",true);
	
	
	if(state=="Initial"){
		$("#Resume").prop("disabled",true);
		$("#Stop").prop("disabled",true);
		$("#Start").prop("disabled",true);
		$("#Configure").prop("disabled",true);
		$("#Pause").prop("disabled",true);
		$("#TTCResync").prop("disabled",true);
		$("#TTCHardReset").prop("disabled",true);
	}
	if(state=="Halted"){
		$("#Resume").prop("disabled",true);
		$("#Pause").prop("disabled",true);
		$("#Initialize").prop("disabled",true);
		$("#Start").prop("disabled",true);
		$("#Stop").prop("disabled",true);
		
		$("#Configure").prop("disabled",false);
		$("#ColdReset").prop("disabled",false);
	}
	if(state=="Configuring" || state=="Configured"){
		$("#TTCResync").prop("disabled",true);
		$("#TTCHardReset").prop("disabled",true);
		$("#Initialize").prop("disabled",true);
		$("#Pause").prop("disabled",true);
		$("#Stop").prop("disabled",true);
		$("#Resume").prop("disabled",true);
		
		$("#Configure").prop("disabled",false);
		$("#Halt").prop("disabled",false);
		$("#Start").prop("disabled",false);
		$("#ColdReset").prop("disabled",false);		
	}
	
	if(state=="Running"){
		$("#Start").prop("disabled",true);
		$("#Initialize").prop("disabled",true);
		$("#Resume").prop("disabled",true);
		$("#Configure").prop("disabled",true);
		
		$("#Pause").prop("disabled",false);
		$("#Stop").prop("disabled",false);
	}
	if(state=="Paused"){
		$("#Pause").prop("disabled",true);
		$("#Halt").prop("disabled",true);
		$("#Start").prop("disabled",true);
		$("#Configure").prop("disabled",true);
		$("#Initialize").prop("disabled",true);
		
		$("#Resume").prop("disabled",false);
		$("#TTCResync").prop("disabled",false);
		$("#TTCHardReset").prop("disabled",false);
		$("#Stop").prop("disabled",false);
	}
}

