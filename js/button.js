var constUrl = "http://uzhcms1.cern.ch:2022/urn:xdaq-application:lid=85/";
var ExpIsClicked = false;

function expertFunction(clicked_id){
	var formID, inputID, text;
	if(clicked_id.search("SendBgo")>0)
	{
		text = $('#formSendBgoMethod').find('select[name="CommandUInt"]').val();	
		inputID = "CommandUInt";
	}
	if(clicked_id.search("SendBgoTrain")>0)
	{
		text = $('#formSendBgoTrain').find('select[name="TrainString"]').val();	
		inputID = "TrainString";
	}
	if(clicked_id.search("SendBgoString")>0)
	{
		text = $('#formSendBgoString').find('select[name="CommandString"]').val();	
		inputID = "CommandString";
	}
	if(clicked_id.search("EnableRandomTriggers")>0)
	{
		text = $('#formEnableRandomTriggers').find('select[name="FrequencyUInt"]').val();	
		inputID = "FrequencyUInt";
	}
	if(clicked_id.search("UpdateHardwareConfigurationFile")>0)
	{
		text = $('#formUpdateHardwareConfigurationFile').find('input[name="FileNameString"]').val();	
		inputID = "FileNameString";
	}
	
	clicked_id = clicked_id + "?"+inputID+"=" + text;
	alert('Command sent successfully!');
	
	jQuery.ajax({
            url : clicked_id,
            timeout : 2000
        });
	 
}

function updateHardwareConfigurationFileMethodUpload(clicked_id){
	
	//var text = $('#formUpdateHardwareConfigurationUpload').find('input[name="ConfigurationString"]').val();	
	//alert(text);
	//text = text.replace(new RegExp("\\", 'g'), "\%2F");
	//clicked_id = clicked_id + "?FileNameString=" + text;
	//alert(clicked_id);
	jQuery.ajax({
            url : clicked_id,
            timeout : 2000
        });
	
}




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
		$("#Halt").prop("disabled",true);
		
		
		$("#Initialize").prop("disabled",false);
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

