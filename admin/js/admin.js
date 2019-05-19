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




var appendDom = function( params ) {
    
    var elem = document.createElement( params['tag'] );
    
    if ( params.hasOwnProperty('src') )         elem.src            = params['src'];
    if ( params.hasOwnProperty('id') )          elem.id             = params['id'];
    if ( params.hasOwnProperty('text') )        elem.textContent    = params['text'];
    if ( params.hasOwnProperty('html') )        elem.innerHTML      = params['html'];
    if ( params.hasOwnProperty('value') )       elem.value          = params['value'];
    if ( params.hasOwnProperty('title') )       elem.setAttribute( 'title',         params['title'] );
    if ( params.hasOwnProperty('href') )        elem.setAttribute( 'href',          params['href'] );
    if ( params.hasOwnProperty('target') )      elem.setAttribute( 'target',        params['target'] );
    if ( params.hasOwnProperty('class') )       elem.setAttribute( 'class',         params['class'] );
    if ( params.hasOwnProperty('type') )        elem.setAttribute( 'type',          params['type'] );
    if ( params.hasOwnProperty('placeholder') ) elem.setAttribute( 'placeholder',   params['placeholder'] );
    if ( params.hasOwnProperty('parent') )      params['parent'].appendChild( elem );
    
    return elem;
    
};



// @TODO: get rid of this
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
        
        this.featuredImageElem = appendDom({
            tag: 'IMG',
            src: result,
            id: 'featuredImagePreview',
            parent: this.previewWrapperElem
        });
        
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
        
        this.blogTitleElem = appendDom({
            tag: 'H2',
            text: this.blogTitle,
            title: 'Visit Settings section to give your blog a new name',
            parent: this.sidebarElem
        });
        
    };
    
    this.createLinks = function() {
        
        for ( var prop in this.adminMenuItems ) {
            
            var navLink = appendDom({
                tag: 'A',
                id: 'sidebar_link_' + prop,
                href: prop + '.html',
                text: this.adminMenuItems[prop],
                parent: this.sidebarElem
            });
            
        }
        
    };
    
    this.createFooter = function() {
        
        var footerElem = appendDom({
            tag: 'DIV',
            id: 'sidebarFooter',
            parent: this.sidebarElem
        });
        
        var tipElem = appendDom({
            tag: 'P',
            html: '<p><strong>*Tip: </strong>Hover over the elements to get suggestions</p>',
            parent: footerElem
        });
        
        var sigWrapElem = appendDom({
            tag: 'DIV',
            parent: footerElem
        });
        
        this.linkElem = appendDom({
            tag: 'A',
            text: 'ZeroPress',
            href: window.location.origin + '/1JrT4VnMgpm6GgHV6R9yvgp5WkY8yTnRr7/',
            target: '_blank',
            parent: sigWrapElem
        });
        
        var sigElem = appendDom({
            tag: 'SPAN',
            text: ' by cleanCode',
            parent: sigWrapElem
        });
        
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




var SelectImages = function() {
    
    var UploadedImage = function( fileName ) {
        
        this.remove = function() {
            
            if ( typeof this.selectedMarkElem !== 'undefined' ) {
            
                this.selectedMarkElem.parentNode.removeChild( this.selectedMarkElem );
                
            }
            
            this.imageElem.removeEventListener( 'click', _SelectImages );
            
            this.imageElem.parentNode.removeChild( this.imageElem );
            
        };
        
        this.createSelected = function() {
            
            this.selectedMarkElem = appendDom({ tag: 'DIV', class: 'selected_image', parent: this.imageElem });
            
        };
        
        this.removeSelected = function() {
            
            if ( typeof this.selectedMarkElem !== 'undefined' ) {
            
                this.selectedMarkElem.parentNode.removeChild( this.selectedMarkElem );
                
            }
            
        };
        
        var _UploadedImage = this;
        
        this.fileName = fileName;
        
        this.imageElem = appendDom({ tag: 'DIV', class: 'uploaded_image', parent: _SelectImages.imagesShowElem });
        
        this.imageElem.style.backgroundImage = "url('../media/" + this.fileName + "')";
        
        this.imageElem.addEventListener( 'click', _SelectImages );
        
    };
    
    var UploadNew = function() {
        
        this.remove = function() {
            
            this.wrapElem.removeChild( this.inputElem );
            
            this.wrapElem.parentNode.removeChild( this.wrapElem );
            
        };
        
        var _UploadNew = this;
        
        this.wrapElem = appendDom({
            tag: 'DIV',
            id: 'select_image_new',
            parent: _SelectImages.imagesShowElem
        });
        
        this.inputElem = appendDom({
            tag: 'INPUT',
            id: 'select_image_new_input',
            type: 'file',
            parent: this.wrapElem
        });
        
        this.inputElem.addEventListener( 'input', _SelectImages );
        
    };
    
    this.uploadNewImage = function( event ) {
        
        var file        = event.target.files[0];
        var ext         = file.name.split('.').pop();
        var fileName    = Date.now() + '.' + ext;

        page.cmd( 'bigfileUploadInit', [ 'media/' + fileName, file.size ], function( result ) {
            
            var formdata = new FormData();
            formdata.append( fileName, file );
            
            var req = new XMLHttpRequest();
            
            req.onload = function( response ) {
                
                page.cmd('wrapperNotification', ['done', 'The selected image was uploaded successfully', 4000]);
                
                _SelectImages.reload();
                
            };
            
            req.withCredentials = true;
            req.open( "POST", result.url );
            req.send( formdata );
            
        });
        
    };
    
    this.reload = function() {
        
        for ( var i=0 ; i<this.uploadedImages.length ; i++ ) {
            
            this.uploadedImages[i].remove();
            
        }
        
        this.uploadedImages = [];
        
        page.cmdp( 'fileList', ['/media'] ).then( function(result) {
            
            for ( var i=0 ; i<result.length ; i++ ) {
                
                if ( result[i].indexOf( 'piecemap.msgpack' ) === -1 ) {
                
                    _SelectImages.uploadedImages.push( new UploadedImage( result[i] ) );
                    
                }
                
            }
            
        });
        
    };
    
    this.appear = function() {
        
        this.wrapperElem.style.display = 'block';
        
        page.cmdp( 'fileList', ['/media'] ).then( function(result) {
            
            console.log( result );
            
            _SelectImages.uploadNew = new UploadNew();
            
            for ( var i=0 ; i<result.length ; i++ ) {
                
                if ( result[i].indexOf( 'piecemap.msgpack' ) === -1 ) {
                
                    _SelectImages.uploadedImages.push( new UploadedImage( result[i] ) );
                    
                }
                
            }
            
        });
        
    };
    
    this.disappear = function() {
        
        this.wrapperElem.style.display = 'none';
        
        for ( var i=0 ; i<this.uploadedImages.length ; i++ ) {
            
            this.uploadedImages[i].remove();
            
        }
        
        this.uploadedImages = [];
        
        this.uploadNew.remove();
        
        this.uploadNew = null;
        
    };
    
    this.setSelected = function( elem ) {
        
        for ( var i=0 ; i<this.uploadedImages.length ; i++ ) {
            
            if ( this.uploadedImages[i].imageElem === elem ) {
                
                this.uploadedImages[i].createSelected();
                this.imageUrl = 'http://127.0.0.1:43110' + '/' + site_info.address + '/media/' + this.uploadedImages[i].fileName;
                
            } else {
                
                this.uploadedImages[i].removeSelected();
                
            }
            
        }
        
    };
    
    this.handleEvent = function( event ) {
        
        if ( event.type === 'click' && event.target === this.closeElem ) {
            
            this.disappear();
            
        } else if ( event.type === 'click' && event.target.classList.contains( 'uploaded_image' ) ) {
            
            this.setSelected( event.target );
            
        } else if ( event.type === 'click' && event.target === this.selectElem ) {
            
            this.disappear();
                    
            document.querySelector('.pell-content').focus();

            window.pell.exec( 'insertImage', this.imageUrl );
            
        } else if ( event.type === 'click' && event.target === this.initElem ) {
            
            event.preventDefault();
            
            this.appear();
            
        } else if ( event.type === 'input' && event.target.id === 'select_image_new_input' ) {
            
            this.uploadNewImage( event );
            
        }
        
    };
    
    var _SelectImages = this;
    
    this.uploadedImages = new Array();
    
    this.imageUrl               = false;
    this.uploadNew              = null;
    this.wrapperElem            = document.getElementById('select_images');
    this.containerElem          = document.getElementById('select_image_container');
    this.imagesShowElem         = document.getElementById('select_image_show');
    this.controlsContainerElem  = document.getElementById('select_image_controls');
    this.closeElem              = document.getElementById('select_image_close');
    this.selectElem             = document.getElementById('select_image_select');
    
    this.closeElem.addEventListener( 'click', this );
    this.selectElem.addEventListener( 'click', this );
    
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