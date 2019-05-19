function base64Encode(content) {
    
    content = encodeURIComponent( content );
    content = unescape( content );
    return btoa( content );
    
}

function parseJsonFile( content, fileName ) {
    
    content = content || "";

    try {

        content = JSON.parse( content );

    } catch(e) {

        console.warn( 'Failed to parse ' + fileName + ', msg: ' + e.message );

    }
    
    return content;
    
};




function updateDbschema( callback ) {
    
    page.cmd( "fileGet", ["/dbschema.json"], function( content ) {
        
        content = content || "";
        
        try {
            
            content = JSON.parse( content );
            
        } catch(e) {
            
            console.warn( 'Failed to parse dbschema.json, msg: ' + e.message );
            
        }
        
        for ( var prop in content.tables ) {
            
            content.tables[prop].schema_changed = content.tables[prop].schema_changed + 1;
            
        }
        
        content = JSON.stringify(content, null, 4);
        
        page.cmd( "fileWrite", [ "/dbschema.json", base64Encode( content ) ], function( result ) {
            
            callback( result );
            
        });
        
    });
    
}




var FeaturedImage = function() {
    
    this.emptyPreview = function() {
        
        while ( this.previewWrapperElem.firstChild ) {
        
            this.previewWrapperElem.removeChild( this.previewWrapperElem.firstChild );

        }
        
    };
    
    this.emptyInput = function() {
        
        this.featuredImage = null;
        
        this.inputElem.value = '';

        if(!/safari/i.test(navigator.userAgent)){

            this.inputElem.type = '';
            this.inputElem.type = 'file';

        }
        
    };
    
    this.populatePreview = function( result ) {
        
        this.featuredImageElem = document.createElement("IMG");
        this.featuredImageElem.src = result;
        this.featuredImageElem.setAttribute( 'id', 'featuredImagePreview' );
        this.previewWrapperElem.appendChild( this.featuredImageElem );
        
    };
    
    this.uploadImage = function( result ) {
        
        this.hiddenImageElem.onload = function() {
            
            _FeaturedImage.featuredImage = Date.now() + '-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + '.jpg';
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            ctx.drawImage( this, 0, 0 );
            canvas.width = this.width;
            canvas.height = this.height;
            ctx = canvas.getContext("2d");
            ctx.drawImage( this, 0, 0, this.width, this.height );
            var image_base64uri = canvas.toDataURL( "image/jpeg", 0.8 );

            page.cmd("fileWrite", [ 'media/' + _FeaturedImage.featuredImage, image_base64uri.replace(/.*,/, "")], function( response ) {

                if ( response == 'ok' ) {

                    page.cmd('wrapperNotification', ['done', 'The selected image was uploaded successfully', 4000]);

                } else {

                    page.cmd('wrapperNotification', ['error', 'File write error: ' + response]);

                }

            });
            
        };
        
        this.hiddenImageElem.src = result;
        
    };
    
    this.preloadData = function( filename ) {
        
        this.preloadFlag = 1;
        this.featuredImage = filename;
        
        if ( this.featuredImage !== null ) {
            
            this.populatePreview( '../media/' + this.featuredImage );
            
        }
        
    };
    
    this.handleEvent = function( event ) {

        if ( event.target === this.removeElem && event.type === 'click' ) {

            this.emptyPreview();
            this.emptyInput();

        } else if ( event.target === this.inputElem && event.type === 'input' ) {
            
            this.emptyPreview();
            
            var reader = new FileReader();
            
            reader.onload = function(){
                
                _FeaturedImage.populatePreview( reader.result );
                _FeaturedImage.uploadImage( reader.result );
                
            };
            
            reader.readAsDataURL(event.target.files[0]);
            
        }

    };
    
    var _FeaturedImage = this;
    
    this.inputElem              = document.getElementById('imageUpload');
    this.removeElem             = document.getElementById('imageRemove');
    this.previewWrapperElem     = document.getElementById('imageHolder');
    this.hiddenImageElem        = document.getElementById('hiddenFeaturedImage');
    this.featuredImageElem      = null;
    
    this.featuredImage          = null;
    this.preloadFlag            = 0;
    
    this.inputElem.addEventListener( 'input', this );
    this.removeElem.addEventListener( 'click', this );
    
};




var Sidebar = function( info ) {
    
    this.handleEvent = function( event ) {
            
        if ( event.target === this.linkElem ) {
            
            event.preventDefault();

            page.cmd( "wrapperOpenWindow", [ event.target.href, "_blank" ] );

        }

    };
    
    this.createTitle = function() {
        
        this.blogTitleElem = document.createElement("H2");
        this.blogTitleElem.textContent = this.blogTitle;
        this.blogTitleElem.setAttribute( 'title', 'Visit Settings section to give your blog a new name' );
        this.sidebarElem.appendChild( this.blogTitleElem );
        
    };
    
    this.createLinks = function() {
        
        for ( var prop in this.adminMenuItems ) {
            
            var navLink = document.createElement("A");
            navLink.id = 'sidebar_link_' + prop;
            navLink.setAttribute( 'href', prop + '.html' );
            navLink.textContent = this.adminMenuItems[prop];
            this.sidebarElem.appendChild( navLink );
            
        }
        
    };
    
    this.createFooter = function() {
        
        var footerElem = document.createElement("DIV");
        footerElem.setAttribute( 'id', 'sidebarFooter' );
        this.sidebarElem.appendChild( footerElem );
        
        var tipElem = document.createElement("P");
        tipElem.innerHTML = '<p><strong>*Tip: </strong>Hover over the elements to get suggestions</p>';
        footerElem.appendChild( tipElem );
        
        var sigWrapElem = document.createElement("DIV");
        footerElem.appendChild( sigWrapElem );
        
        this.linkElem = document.createElement("A");
        this.linkElem.textContent = 'ZeroPress';
        this.linkElem.href = window.location.origin + '/1JrT4VnMgpm6GgHV6R9yvgp5WkY8yTnRr7/';
        this.linkElem.setAttribute( 'target', '_blank' );
        sigWrapElem.appendChild( this.linkElem );
        
        var sigElem = document.createElement("SPAN");
        sigElem.textContent = ' by cleanCode';
        sigWrapElem.appendChild( sigElem );
        
        this.linkElem.addEventListener( 'click', this );
        
    };
    
    this.populate = function( info ) {
        
        this.siteInfo = info;
    
        if ( this.siteInfo.content.title !== '' ) {

            this.blogTitle = this.siteInfo.content.title;

        }
    
        if ( this.siteInfo.content.description !== '' ) {

            this.blogDescription = this.siteInfo.content.description;

        }
    
        this.createTitle();
        this.createLinks();
        this.createFooter();
        
    };
    
    var _Sidebar = this;
    
    this.siteInfo = null;
    this.blogTitle = 'zeroPress Blog';
    this.blogDescription = null;
    this.blogTitleElem = null;
    this.linkElem = null;
    
    this.sidebarElem = document.getElementById('adminSidebar');
    this.adminMenuItems = {
        allPosts: 'All Posts',
        newPost: 'New Post',
        menu: 'Menus',
        settings: 'Settings',
        update: 'Update'
    };
    
};




var UpdateChecker = function() {
    
    this.modifyPage = function() {
        
        var sidebarElem = document.getElementById('sidebar_link_update');
        
        if ( sidebarElem !== null ) {
            
            sidebarElem.style.backgroundColor = 'rgba(255, 165, 0, 0.9)';
            sidebarElem.style.color = 'rgb(17, 17, 17)';
            
        }
        
    };
    
    this.queryLatestVersion = function() {
        
        page.cmd( "fileGet", [ "cors-" + this.updaterData.source + "/admin/updater.json" ], function( updater ) {
            
            updater = parseJsonFile( updater, 'remote updater.json' );
            
            _UpdateChecker.latest_version = updater.version;
            
            if ( _UpdateChecker.latest_version > _UpdateChecker.updaterData.version ) {
                
                _UpdateChecker.modifyPage();
                
            }
            
        });
        
    };
    
    var _UpdateChecker = this;
    
    this.updaterData = null;
    this.latest_version = null;
    
    page.cmd( "fileGet", ["/admin/updater.json"], function( updater ) {
        
        _UpdateChecker.updaterData = parseJsonFile( updater, 'updater.json' );
        
        if ( _UpdateChecker.updaterData.allow_updates === true ) {
        
            _UpdateChecker.queryLatestVersion();
            
        }
        
    });
    
};




var ClearnetLinks = function () {

    this.handleEvent = function( event ) {
        
        event.preventDefault();
    
        var href = event.target.href;
        
        var target = "_self";
        
        if ( typeof event.target.getAttribute("target") === "string" && event.target.getAttribute("target").length > 0 ) {
            
            target = event.target.getAttribute("target");
            
        }
        
        page.cmd( "wrapperOpenWindow", [ href, target ] );
        
    };

    var _ClearnetLinks = this;
    
    this.clearNetLinks = document.querySelectorAll('.clearnet_link');
    
    for ( var i=0 ; i<this.clearNetLinks.length ; i++ ) {

        this.clearNetLinks[i].addEventListener( 'click', this );

    }
    
};

var clearnetLinksInit = new ClearnetLinks();

var page = new ZeroFrame();

var updatecheckerInit = new UpdateChecker();