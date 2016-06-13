
// HyperDAQ javascript 'callback' method.
function xdaqWindowPreLoad()
{    
	// Perform some setup operations.
	doSetup();
};

function doSetup()
{
    // Add an onClick() handler for the scratch pad. When it is
    // clicked, the AJAX updates are started (if they are stopped).
    jQuery("#tcds-log-wrapper").click(function() {
        startUpdate();
    });
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
    updateLoop();
}

//-----------------------------------------------------------------------------

function updateLoop()
{
    setTimeout(function(){
        var data;
        jQuery.ajax({
            url : tcds.updateUrl,
            dataType : "json",
            data : data,
            timeout : 2000,
            success : function(data, textStatus, jqXHR) {
                processAJAXSuccess(data, textStatus, jqXHR);
                tcds.updateFailCount = 0;
                updateLoop();
            },
            error : function(jqXHR, textStatus, errorThrown)
            {
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
