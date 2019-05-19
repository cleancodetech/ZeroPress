var sidebarInit         = new Sidebar();

page.cmd( "siteInfo", [], function( info ) {
    
    sidebarInit.populate( info );
    
    if ( info.settings.own !== true ) {
                
        window.location.href = window.location.origin + '/' + info.address + '/auth.html';
        
    }
    
});