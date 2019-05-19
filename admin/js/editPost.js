var editor = window.pell.init({

    element: document.getElementById('editor'),

    onChange: html => {
        
        document.getElementById('pellContents').value = html;
        
    },

    defaultParagraphSeparator: 'p',

    styleWithCSS: false,

    actions: [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'heading1',
        'heading2',
        'paragraph',
        'quote',
        'olist',
        'ulist',
        'code',
        'line',
        'link'
    ],

    classes: {
        actionbar: 'pell-actionbar',
        button: 'pell-button',
        content: 'pell-content',
        selected: 'pell-button-selected'
    }
});




var editPost = function( data ) {
    
    this.updatePost = function( event ) {
        
        event.preventDefault();
        
        var title = this.titleElem.value;
        
        var body = this.hiddenBodyElem.value;
        
        var featuredImage = _editPost.featuredImageInit.featuredImage;
        
        page.cmd( "fileGet", ["/data/admin/posts.json"], function( content ) {
        
            content = content || "";

            try {
                content = JSON.parse(content);
            } catch(e) {
                content = {
                    posts: [],
                    next_post_id: 0
                };
            }
            
            for ( var i=0 ; i<content.posts.length ; i++ ) {
            
                if ( content.posts[ i ].id === postId ) {

                    content.posts[i].title = title;
                    content.posts[i].body = body;
                    content.posts[i].featuredImage = featuredImage;

                }

            }

            content = JSON.stringify(content, null, 4);

            updateDbschema( function( result ) {

                page.cmd( "fileWrite", [ "/data/admin/posts.json", base64Encode( content ) ], function( result ) {

                    page.cmd("sitePublish", [ "stored" ], function( result ) {

                        page.cmd("siteUpdate", [ site_info.address ], function( result ) {

                            page.cmd('wrapperNotification', ['done', 'Your new post is now published', 4000]);

                        });

                    });

                });

            });

        });
        
    };
    
    this.handleEvent = function( event ) {
            
        if ( event.target === this.updateElem ) {

            this.updatePost( event );

        }

    };

    var _editPost = this;

    this.data = data;
    
    this.titleElem                  = document.getElementById('post_title');
    this.bodyElem                   = document.querySelector('.pell-content');
    this.hiddenBodyElem             = document.getElementById('pellContents');
    this.featuredImageWrapperElem   = document.getElementById('imageHolder');
    this.hiddenFeaturedImageElem    = document.getElementById('hiddenFeaturedImage');
    this.updateElem                 = document.getElementById('publishButton');
    this.featuredImageUploadElem    = document.getElementById('imageUpload');
    this.featuredImageRemoveElem    = document.getElementById('imageRemove');
    this.featuredImageElem          = null;
    
    this.featuredImageInit = new FeaturedImage();
    this.featuredImageInit.preloadData( this.data.featuredImage );    
    
    this.titleElem.value        = this.data.title;
    this.bodyElem.innerHTML     = this.data.body;
    this.hiddenBodyElem.value   = this.data.body;
    
    this.updateElem.addEventListener( 'click', this );

};




var site_info   = null;
var postId      = parseInt( new URLSearchParams( window.location.search ).get('id') );
var sidebarInit = new Sidebar();

page.cmd( "siteInfo", [], function( info ) {
    
    site_info = info;
    
    sidebarInit.populate( info );
    
    if ( info.settings.own !== true ) {
                
        window.location.href = window.location.origin + '/' + info.address + '/auth.html';
        
    }
    
});

page.cmd( "fileGet", ["/data/admin/posts.json"], function( content ) {
        
    content = content || "";

    try {

        content = JSON.parse( content );

    } catch(e) {

        console.warn( 'Failed to parse posts.json, msg: ' + e.message );

    }
    
    for ( var i=0 ; i<content.posts.length ; i++ ) {

        if ( content.posts[ i ].id === postId ) {

            var post = new editPost( content.posts[ i ] );

        }

    }

});