
$(window).load(function(){
						
	//console.log("Window Loaded : Beginning page setup");
	
	// make sure the xdaq-nojs tag has been removed
	$("body").removeClass("xdaq-nojs");
	
	var sidebar = $('#xdaq-sidebar');
	sidebar.removeClass("xdaq-sidebar-nojs");
	sidebar.addClass("xdaq-sidebar-active");
	
	/*
	 * Load Order :
	 *
	 * 0. User xdaqWindowPreLoad()
	 * 1. sessionStorage
	 * 2. Tabs
	 * 3. Trees (inc param viewers)
	 * 4. Consoles
	 * 5. Size and position sidebar, header and footer
	 * 6. Attach click handlers
	 * 7. User xdaqWindowPostLoad()
	 */
	 
	/*
	 * 0. User xdaqWindowPreLoad()
	 */	
	xdaqWindowPreLoad();
	//or
	$(document).trigger("xdaq-pre-load");

	/*
	 * 1. sessionStorage
	 */
	//console.log("Loading from sessionStorage");
	
	/*
	 * 1.1. sessionStorage - Tabs
	 */
	xdaqTabsInitIDs();
	$('.xdaq-tab-wrapper').each(function() {
		var tabWrapperID = $(this).attr("id");
		var defaultTabID = "";
		
		try
		{
			defaultTabID = xdaqLoadSessionStorage("xdaqTabSelection"+tabWrapperID);
		}
		catch (err)
		{
			console.error(err.message);
			defaultTabID = "";
		}
		
		if (isNumber(defaultTabID))
		{
			var defaultTab = $('#'+tabWrapperID+'>.xdaq-tab:eq('+defaultTabID+')');
			defaultTab.addClass("xdaq-tab-default");
		}
	});

	/*
	 * 2. Tabs
	 */
	//console.log("Loading Tabs");
	xdaqLoadTabs();

	/*
	 * 3. Trees (inc param viewers)
	 *
	 * a. Load data for param viewers and build the tables
	 * b. Init the trees
	 */
	//console.log("Loading Trees");
	//xdaqInitParamViewer($("#xdaqparamviewer-menu"));
	xdaqBuildParamViewers();
	xdaqBuildTrees();

	/*
	 * 4. Consoles
	 */
	//console.log("Loading Consoles");
	xdaqBuildConsoles();

	/*
	 * 5. Layout
	 */
	//console.log("Loading layout");
	xdaqBuildLayout();
	 
	xdaqAutoSizeConsoles();
	xdaqSidebarStick();
	

	/*
	 * 6. Attach click handlers
	 */
	//console.log("Attaching click handlers");
	
	
	/*
	 * Window history state listener
	 */
	window.onpopstate = function(event) {
		if (event.state)
		{
			if (!(typeof event.state["xdaq-tabs-index"] === 'undefined'))
			{
				//console.log("state: " + JSON.stringify(event.state));
				var tabGroupID = event.state["xdaq-tabs-id"];
				var tabGroup = xdaqTabsGetTabGroup(tabGroupID);
				var newIndex = event.state["xdaq-tabs-index"];
				tabGroup.tabShow(newIndex);
				
				try
				{
					xdaqSaveSessionStorage("xdaqTabSelection"+tabGroupID, newIndex);
				}
				catch (err)
				{
					console.error(err.message);
				}
			}
		}
		else
		{
			// Origonal page load, no state replacement
		}
	};
	
	/*
	 * 6.1. Header Menus 
	 *
	 * #xdaq-header-menu-control
	 * #xdaq-header-menu-apps
	 * #xdaq-header-menu-cluster
	 * #xdaq-header-menu-settings
	 * #xdaq-header-menu-props
	 */
	var xdaqHeaderMenuSwitches = $("[id^=xdaq-header-menu-]");
	var xdaqHeaderMenus = $("[id^=xdaq-menu-]");
	var xdaqHeaderMenuArrows = $("#xdaq-menu-arrow-outer, #xdaq-menu-arrow-inner");

	xdaqHeaderMenuSwitches.on('click', function(e) {
		var id = $(this).attr("data-id");
		var menu = $("#xdaq-menu-"+id);
		
		var active = menu.hasClass("xdaq-menu-active");
		
		xdaqHeaderMenus.removeClass("xdaq-menu-active");
		xdaqHeaderMenus.addClass("xdaq-menu-hidden");
		
		if (active)
		{
			// Hide arrows
			xdaqHeaderMenuArrows.addClass("xdaq-menu-hidden");
		}
		else
		{    		
			menu.addClass("xdaq-menu-active");
			menu.removeClass("xdaq-menu-hidden");
			
			// Move the arrow into position
			xdaqHeaderMenuArrows.removeClass();
			xdaqHeaderMenuArrows.addClass("xdaq-menu-arrow-"+id);
		}
		
		// Stop propogation to avoid menus being hidden when event reaches body element
		e.stopPropagation();
    });
	
    /*
     * Stop propogation on all menu's except settings (see next function)
     */
    $("[id^=xdaq-menu-]:not([id=xdaq-menu-settings])").on('click', function(e) {
    	e.stopPropagation();
    });
	
    /*
     * Stop propogation on settings menu only if the div itself was the target. All children of this menu should stop event propogation approprately
     */
    $("#xdaq-menu-settings").on('click', function(e) {
    	if ($(e.target).is($(this)))
    	{
    		e.stopPropagation();
    	}
    });
	
	
    /*
     * Stop propogation on this param viewer to stop clicking hiding the menu
     */
	$("#xdaq-wrapper").on('click', '#xdaqparamviewer-menu', function(e) {
    	e.stopPropagation();
	});
	
    /*
     * Hide all header menus
     */	
    $("body").click(function(e) {
		xdaqHeaderMenus.removeClass("xdaq-menu-active");
		xdaqHeaderMenus.addClass("xdaq-menu-hidden");
		xdaqHeaderMenuArrows.addClass("xdaq-menu-hidden");
	});
	
	 /*
	 * 6.2. Sidebar - Add a transition to the sidebar by applying a css style to the main wrapper on hover of the sidebar
	 */
    $("#xdaq-sidebar").on('mouseover mouseleave', function(e) {
        if (e.type == 'mouseover')
        {
            $("#xdaq-main").addClass("xdaq-main-acive-sidebar");
        }
        else
        {
            $("#xdaq-main").removeClass("xdaq-main-acive-sidebar");
        }
    });
	
    /*
     * 6.4. Tree Handlers
     */
	xdaqAddTreeHandlers();
	
    /*
     * 6.4. Console Handlers
     */
	xdaqAddConsoleHandlers();
	
    /*
     * 6.4. Miscellaneous
     */
    /*
     * Confirmation dialog on links with the property 'confirm'
     */
	$('[xdaq-confirm]').on('click', function () {
		return confirm('Are you sure?');
	});
	
	// Matrix Handler
	$(document).on('mouseover mouseleave', '.xdaq-table-matrix td', function(e) {
		if (e.type == 'mouseover') {
			$(this).closest("table").children("thead").children("tr").children("th:nth-child("+($(this).index() + 1)+")").addClass("xdaq-table-matrix-th-hover");
			$(this).closest("tr").children("th").addClass("xdaq-table-matrix-th-hover");
		} else {
			$(this).closest("table").children("thead").children("tr").children("th:nth-child("+($(this).index() + 1)+")").removeClass("xdaq-table-matrix-th-hover");
			$(this).closest("tr").children("th").removeClass("xdaq-table-matrix-th-hover");
		}
	});
	 
	$('#xdaq-header-hide-sidebar', '#xdaq-header').on('click', function () {
		$(this).toggleClass("xdaq-header-hide-sidebar-on");
		$(this).toggleClass("xdaq-header-hide-sidebar-off");
		$('#xdaq-sidebar').toggleClass("xdaq-sidebar-on");
		$('#xdaq-main').toggleClass("xdaq-sidebar-hidden-main");
		
		if ($( window ).width() > 700)
		{
			// Send SOAP message to toggle the thing
			var soapMsgSideBar = '<SOAP-ENV:Envelope SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" ';
				soapMsgSideBar = soapMsgSideBar + 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/">';
				soapMsgSideBar = soapMsgSideBar + '<SOAP-ENV:Header>';
				soapMsgSideBar = soapMsgSideBar + '</SOAP-ENV:Header>';
				soapMsgSideBar = soapMsgSideBar + '<SOAP-ENV:Body>';
				soapMsgSideBar = soapMsgSideBar + '<xdaq:ParameterSet xmlns:xdaq="urn:xdaq-soap:3.0">';
				soapMsgSideBar = soapMsgSideBar + '<p:properties xmlns:p="urn:xdaq-application:hyperdaq::Application" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" ';
				soapMsgSideBar = soapMsgSideBar + 'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="soapenc:Struct">';
				soapMsgSideBar = soapMsgSideBar + '<p:showSidebar xsi:type="xsd:boolean">';
				
				// insert value
				if ($(this).hasClass("xdaq-header-hide-sidebar-on"))
				{
					soapMsgSideBar = soapMsgSideBar + 'true';
				}
				else
				{
					soapMsgSideBar = soapMsgSideBar + 'false';
				}			
	
				soapMsgSideBar = soapMsgSideBar + '</p:showSidebar>';
				soapMsgSideBar = soapMsgSideBar + '</p:properties>';
				soapMsgSideBar = soapMsgSideBar + '</xdaq:ParameterSet>';
				soapMsgSideBar = soapMsgSideBar + '</SOAP-ENV:Body>';
				soapMsgSideBar = soapMsgSideBar + '</SOAP-ENV:Envelope>';
				
			// Send request
				
			var urn = "urn:xdaq-application:service=hyperdaq";
			var requestURL = $(this).attr("data-requrl") + "/" + urn;
			
			var options = {
				headers: {
					"SOAPAction": urn
				},
				url: requestURL,
				data: soapMsgSideBar
			};
			
			xdaqAJAX(options, null);
		}
	});
	
	xdaqParamViewerAddHandlers();
	
	xdaqAddSortHandlers();
	
	// Append the active class name to the title
	var titleName = $("#xdaq-body").attr("data-app-name");
	var instanceNumber = $("#xdaq-body").attr("data-app-instance");
	if (titleName != undefined && titleName != "")
	{
		var pos = titleName.search("::Application");
		if (pos != -1)
		{
			titleName = titleName.substring(0, pos);
		}
		
		titleName = titleName.replace("::", " ");
		
		if (instanceNumber != undefined && instanceNumber != "")// && instanceNumber != "0")
		{
			titleName = titleName + " " + instanceNumber;
		}
		
		$(document).attr("title", "XDAQ - " + titleName);
	}
	
	// Add effects to Application Name div in header
	var appName = $("#xdaq-header-app-name");
	setTimeout(function(){
		appName.addClass("xdaq-header-application-img-off");
	},2000);
	
	$("#xdaq-header-application-img img").on("mouseover mouseleave", function(e){
		if (e.type == "mouseover") 
		{
			appName.addClass("xdaq-header-application-img-on");
		}
		else
		{
			setTimeout(function(){
				appName.removeClass("xdaq-header-application-img-on");
			},1000);
		}
	});
	
	// Allow tab in textareas
	xdaqAddTextAreaHandlers(); // xdaq-utils.js
	
	// check for multi row table row hover problem
	$("table[class*=xdaq-table]>tbody>tr>td").hover(function() {
	  	if ($(this).parent().has('td[rowspan]').length == 0)
	  	{
	  		$(this).parent().prevAll('tr:has(td[rowspan]):first').find('td[rowspan]').addClass("xdaq-table-hover-effect");
	  	}
	}, function() 
	{ 
		$(this).parent().prevAll('tr:has(td[rowspan]):first').find('td[rowspan]').removeClass("xdaq-table-hover-effect");
	});
	
	$("#xdaq-wrapper").on("focus", "table.xdaq-table-tree tr span.indenter a", function() {
		$(this).blur();
	});

	console.log("Core load complete, calling user functions");

	/*
	 * User xdaqWindowPostLoad()
	 */	
	xdaqWindowPostLoad();
	//or
	$(document).trigger("xdaq-post-load");
	
	// And just in case anything stupid happened, 
	xdaqHeaderFooterStick();
})
