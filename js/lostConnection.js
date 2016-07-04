
var tcds = {};
tcds.baseUrl = undefined;
tcds.updateUrl = undefined;
tcds.updateInterval = 500;
tcds.updateFailCount = 0;
tcds.maxUpdateFailCount = 2;
tcds.data = undefined;
tcds.grids = {};
tcds.l1ahistos = undefined;
tcds.initialised = false;
tcds.templateCache = {};

var currentState;

// HyperDAQ javascript 'callback' method.
function xdaqWindowPreLoad()
{
	// Perform some setup operations.
	doSetup();
		// Figure out the update URL.
	tmpUrl = window.location.toString();
	if (tmpUrl.slice(-1) == '/')
	{
		tmpUrl = tmpUrl.slice(0, -1);
	}
	var updateUrl = tmpUrl + "/update";
	tcds.baseUrl = tmpUrl;
	tcds.updateUrl = updateUrl;
};

function doSetup()
{
	//alert("in doSetup");

	// Insert a <div> that we can use as scratch pad.
    jQuery("<div id=\"tcds-log-wrapper\"></div>").insertBefore("#xdaq-main");
    jQuery("#tcds-log-wrapper").append("<div id=\"tcds-log\"></div>");
    hideLog();


    // Add an onClick() handler for the scratch pad. When it is
    // clicked, the AJAX updates are started (if they are stopped).
    jQuery("#tcds-log-wrapper").click(function() {
        startUpdate();
    });
}

function hideLog()
{
    jQuery("#tcds-log-wrapper").hide();
}

//-----------------------------------------------------------------------------

function showLog()
{
    jQuery("#tcds-log-wrapper").show();
}


// HyperDAQ javascript 'callback' method.
function xdaqWindowPostLoad()
{
        // NOTE: At some point we may want to clean up this
        // button-business a bit.

        // Add the 'Modify TTCSpy configuration' button if we're
        // dealing with a PIController.
        var tmp = jQuery(".tcds-tab-name:contains('TTCSpy')");
        if (tmp.length)
        {
            var hook = tmp.parent();
            fixupTTCSpyConfigButton(hook);
        }

        // Add the 'Modify random-trigger rate' button if we're
        // dealing with a CPMController.
        tmp = jQuery("p:contains('Random-trigger configuration')");
        if (tmp.length)
        {
            var hook = tmp.last();
            fixupRandomRateConfigButton(hook);
        }

        // Make sure that data gets updated when switching tabs (since
        // normally only visible data, and not the data in the
        // background tabs) gets updated regularly from the AJAX
        // requests.
        jQuery(".xdaq-tab-nav").click(function() {
            applyData();
        });

        startUpdate();

}

//-----------------------------------------------------------------------------

function startUpdate()
{
	//alert("in startUpdate");
    updateLoop();
}

//-----------------------------------------------------------------------------

function updateLoop()
{
	if (ExpIsClicked == false){
		buttonToState(currentState);
	}
    setTimeout(function(){
        var data;

        jQuery.ajax({
            url : tcds.updateUrl,
            dataType : "json",
            data : data,
            timeout : 2000,
            success : function(data, textStatus, jqXHR) {
				 //alert("connected: tcds.updateFailCount=" + tcds.updateFailCount);
                processAJAXSuccess(data, textStatus, jqXHR);
                tcds.updateFailCount = 0;
                updateLoop();
            },
            error : function(jqXHR, textStatus, errorThrown)
            {
				 //alert("Fail: tcds.updateFailCount=" + tcds.updateFailCount + "\nupdateUrl=" + tcds.updateUrl);
                tcds.updateFailCount += 1;
                if (tcds.updateFailCount > tcds.maxUpdateFailCount)
                {
                    processAJAXError(jqXHR, textStatus, errorThrown);
                }
                else
                {
                    updateLoop();
                }
            }
        });
    }, tcds.updateInterval);
};

//-----------------------------------------------------------------------------

function processAJAXSuccess(data, textStatus, jqXHR)
{
    hideLog();
	var curCount = false;
    // Check if we really received something. In case something went
    // really bad, we will receive an empty string.
    if (data === "")
    {
        showError("Received an empty JSON update. " +
                  "<br>" +
                  "Something must have gone horribly wrong " +
                  "on the application side. " +
                  "<br>" +
                  "Please have a look at the application log " +
                  "for more information.");
        return;
    }
	else {
		$.map(data, function(value, key) {
		if (curCount == false){
			currentState = value;
			curCount = true;
		}
		$("#"+key).html(value);
		});
	}
	//Luan - temp
	return;

    //----------

    // Process and apply the data to the DOM.
    // tcds.dataPrev = tcds.data;
    tcds.data = data;
    applyData();

    //----------

    // Replace the HyperDAQ framework page title with our own one
    // (which is of course better).
    const title = jQuery("#tcds-application-title").text();
    const subTitle = jQuery("#tcds-application-subtitle").text();
    const ourTitle = title + " " + subTitle;
    document.title = ourTitle;

    // A special case: we always expect an entry called 'Application
    // State' - 'Problem description'. If that does not exist, log an
    // error. If it does exist and is not "-", announce that there has
    // apparently been some problem in the XDAQ application.
    var tmp0 = "Application state";
    var tmp1 = "Problem description";
    // Verify that this element exists in the JSON data we received in
    // response to our AJAX call.
    var tmpContents = "-";
    try
    {
        tmpContents = data[tmp0][tmp1];
    }
    catch (err)
    {
        showError("Expected (but could not find) an item called " +
                  "'" + tmp0 + "' - '" + tmp1 + "'" +
                  " in the JSON update data.");
    }
    if (tmpContents != "-")
    {
        showError("This application requires attention.");
    }

    // BUG BUG BUG
    // This should be somewhere else.

    // Manipulation of the TTCSpy-in-the-PI configuration and LPM/CPM
    // random-rate buttons.
    tmp0 = "Application state";
    tmp1 = "Application FSM state";
    var fsmState = tcds.data[tmp0][tmp1];
    if ((fsmState == "Halted") ||
        (fsmState == "Configuring") ||
        (fsmState == "Zeroing"))
    {
        // In these states we are not (yet fully) connected to the
        // hardware.
        jQuery("#button_configure_ttcspy").prop("disabled", true);
        jQuery("#button_configure_randomrate").prop("disabled", true);
    }
    else
    {
        // In anything but the above we are connected to the hardware.
        jQuery("#button_configure_ttcspy").prop("disabled", false);
        // Argh! Only enable the button if random-triggers are
        // actually enabled.
        var button = jQuery("#button_configure_randomrate");
        if (button.length)
        {
            var tmp = tcds.data["itemset-inputs"]["Random-trigger generator"];
            var randomsEnabled = (tmp == "enabled");
            button.prop("disabled", !randomsEnabled);
        }
    }
    // BUG BUG BUG end
}

//-----------------------------------------------------------------------------

function processAJAXError(jqXHR, textStatus, errorThrown)
{
    var reasonString = "";
    var baseString = "";
	
    // Let's at least catch the usual problems. If nothing known
    // matches show a blanket fail message.
    if (textStatus == "parsererror")
    {
        baseString = "Something went wrong with the AJAX update.";
        reasonString = "An error occurred parsing the received JSON data ('" + errorThrown.message + "').";
    }
    else if (textStatus == "error")
    {
        if (errorThrown == "Bad Request")
        {
            reasonString = "Cannot connect to the XDAQ application ('Bad Request').";
        }
        else if ((jqXHR.status == 404) || (errorThrown == "Not Found"))
        {
            reasonString = "Cannot find the remote location ('Not Found').";
        }
        else
        {
            reasonString = "Lost connection to the XDAQ application ('Connection Failed').";
        }
    }
    else if (textStatus == "timeout")
    {
        reasonString = "Lost connection to the XDAQ application (connection timed out).";
    }
    else
    {
        baseString = "Something went wrong with the AJAX update.";
        reasonString = "No clue what though.";
    }
    var msg = "";
    if (baseString.length > 0)
    {
        msg = baseString;
    }
    if (reasonString.length > 0)
    {
        if (msg.length > 0)
        {
            msg += "<br>";
        }
        msg += reasonString;
    }
    if (msg.length > 0)
    {
        msg += "<br>";
    }
    msg += "Updating stopped... Click this box to restart.";
    showError(msg);
    console.error("Error while obtaining/parsing JSON data: " + msg);
}

function showError(htmlText)
{
	//alert(htmlText);
    jQuery("#tcds-log").html(htmlText);
    showLog();
    // Mark the page title with a warning.
    var tmp = document.title;
    var ind = tmp.indexOf("(");
    if (ind >= 0)
    {
        tmp = tmp.substring(0, ind);
    }
    tmp = tmp + " (!)";
    document.title = tmp;
}
