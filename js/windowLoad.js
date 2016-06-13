
function loadWin(){
	//alert("vo Load");					
	//console.log("Window Loaded : Beginning page setup");
	
	// make sure the xdaq-nojs tag has been removed
	
	
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
	 * User xdaqWindowPostLoad()
	 */	
	xdaqWindowPostLoad();
	//or
	$(document).trigger("xdaq-post-load");
	
};
