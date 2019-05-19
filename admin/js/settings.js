var Settings = function() {
    
    this.updateContentJson = function() {
        
        page.cmd( "fileGet", ["/content.json"], function( content ) {
            
            content = content || "";

            try {

                content = JSON.parse( content );

            } catch(e) {

                console.warn( 'Failed to parse content.json, msg: ' + e.message );

            }
            
            var titleFoundFlag = 0;
            var descriptionFoundFlag = 0;
            
            for ( var prop in content ) {
                
                if ( prop === 'title' ) {
                    
                    content[prop] = _Settings.blogTitleInputElem.value;
                    titleFoundFlag = 1;
                    
                } else if ( prop === 'description' ) {
                    
                    content[prop] = _Settings.blogDescriptionInputElem.value;
                    descriptionFoundFlag = 1;
                    
                }
                
            }
            
            if ( titleFoundFlag === 0 ) {
                
                content.push({
                    title: _Settings.blogTitleInputElem.value
                });
                
            }
            
            if ( descriptionFoundFlag === 0 ) {
                
                content.push({
                    description: _Settings.blogDescriptionInputElem.value
                });
                
            }
            
            content = JSON.stringify(content, null, 4);
            
            page.cmd( "fileWrite", [ "/content.json", base64Encode( content ) ], function( result ) {

                page.cmd("sitePublish", [ "stored" ], function( result ) {
                        
                    page.cmd('wrapperNotification', ['done', 'Your settings were saved', 4000]);

                });

            });
            
        });
        
    };
    
    this.updateSettingsJson = function() {
        
        var settingsBlock = {
            settings: [
                {
                    name: "cover_image",
                    value: featuredImageInit.featuredImage
                }
            ]
        };
        
        var settingsContent = JSON.stringify(settingsBlock, null, 4);
        
        page.cmd( "fileWrite", [ "/data/admin/settings.json", base64Encode( settingsContent ) ]);
        
    };
    
    this.handleEvent = function( event ) {
        
        if ( event.target === this.saveButtonElem ) {
            
            event.preventDefault();
            
            this.updateSettingsJson();
            
            this.updateContentJson();
            
        }
        
    };
    
    this.populate = function( info ) {
        
        this.siteInfo = info;
    
        if ( this.siteInfo.content.title !== '' ) {

            this.blogTitle                  = this.siteInfo.content.title;
            this.blogTitleInputElem.value   = this.blogTitle;

        }
    
        if ( this.siteInfo.content.description !== '' ) {

            this.blogDescription                    = this.siteInfo.content.description;
            this.blogDescriptionInputElem.value     = this.blogDescription;

        }
        
    };
    
    var _Settings = this;
    
    this.siteInfo = null;
    this.blogTitle = null;
    this.blogDescription = null;
    
    this.blogTitleInputElem         = document.getElementById('settingsSiteName');
    this.blogDescriptionInputElem   = document.getElementById('settingsSiteDescription');
    this.saveButtonElem             = document.getElementById('saveSettings');
    
    this.saveButtonElem.addEventListener( 'click', this );
    
};




var site_info           = null;
var init                = null;
var sidebarInit         = new Sidebar();
var settingsInit        = new Settings();
var featuredImageInit   = new FeaturedImage();

page.cmd( "siteInfo", [], function( info ) {
    
    site_info = info;
    
    sidebarInit.populate( info );
    
    settingsInit.populate( info );
    
    if ( info.settings.own !== true ) {
                
        window.location.href = window.location.origin + '/' + info.address + '/auth.html';
        
    }
    
});

page.cmd( "fileGet", ["/data/admin/settings.json"], function( content ) {
        
    content = content || "";

    try {

        content = JSON.parse( content );

    } catch(e) {

        console.warn( 'Failed to parse posts.json, msg: ' + e.message );

    }
    
    for ( var i=0 ; i<content.settings.length ; i++ ) {

        if ( content.settings[ i ].name === "cover_image" ) {

            featuredImageInit.preloadData( content.settings[ i ].value );

        }

    }

});