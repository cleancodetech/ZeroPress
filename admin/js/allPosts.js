var site_info   = null;
var init        = null;
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
        content = JSON.parse(content);
    } catch(e) {
        content = {
            posts: [],
            next_post_id: 0
        };
    }
    
    init = new allPosts( content.posts );
    
});




function deletePost( postId ) {
    
    page.cmd( "fileGet", ["/data/admin/posts.json"], function( content ) {
        
        content = content || "";
        
        try {
            
            content = JSON.parse( content );
            
        } catch(e) {
            
            console.warn( 'Failed to parse posts.json, msg: ' + e.message );
            
        }
        
        for ( var i=0 ; i<content.posts.length ; i++ ) {
            
            if ( content.posts[ i ].id === postId ) {
            
                content.posts.splice( i, 1 );
                
            }
            
        }
        
        content = JSON.stringify(content, null, 4);
        
        updateDbschema( function( result ) {
            
            page.cmd( "fileWrite", [ "/data/admin/posts.json", base64Encode( content ) ], function( result ) {

                page.cmd("sitePublish", [ "stored" ], function( result ) {
                    
                    page.cmd("siteUpdate", [ site_info.address ], function( result ) {
                        
                        page.cmd('wrapperNotification', ['done', 'The selected post was deleted', 4000]);
                        
                    });

                });

            });
            
        });
        
    });
    
};




var allPosts = function( posts ) {
    
    var postSingle = function( data ) {
        
        this.remove = function() {
            
            this.deleteElem.removeEventListener( 'click', this );
            
            while ( this.box.firstChild ) {
        
                this.box.removeChild( this.box.firstChild );

            }
            
            this.box.parentNode.removeChild( this.box );
            
        };
        
        this.handleEvent = function( event ) {
            
            if ( event.target === this.deleteElem ) {
                
                deletePost( this.data.id );
                
                this.remove();
                
            } else if ( event.target === this.viewElem ) {
                
                var href = window.location.origin + '/' + site_info.address + '/post.html?id=' + event.target.dataset.postid;
                
                page.cmd( "wrapperOpenWindow", [ href, "_blank" ] );
                
            }
            
        };
        
        var _postSingle = this;
    
        this.data       = data;
        
        this.id     = this.data.id;
        this.title  = this.data.title;
        this.date   = new Date( this.data.date_added ).toString().substr( 0, 21 );
        
        this.box = document.createElement("DIV");
        this.box.setAttribute( 'class', 'post' );
        _allPosts.wrapper.appendChild( this.box );
        
        this.titleElem = document.createElement("DIV");
        this.titleElem.setAttribute( 'class', 'post_title' );
        this.titleElem.textContent = this.title;
        this.box.appendChild( this.titleElem );
        
        this.dateElem = document.createElement("DIV");
        this.dateElem.setAttribute( 'class', 'post_date' );
        this.dateElem.textContent = this.date;
        this.box.appendChild( this.dateElem );
        
        this.viewElem = document.createElement("DIV");
        this.viewElem.setAttribute( 'class', 'post_view' );
        this.viewElem.dataset.postid = this.data.id;
        this.viewElem.textContent = 'View';
        this.box.appendChild( this.viewElem );
        
        this.editElem = document.createElement("A");
        this.editElem.setAttribute( 'class', 'post_edit' );
        this.editElem.setAttribute( 'href', 'editPost.html?id=' + this.data.id );
        this.editElem.textContent = 'Edit';
        this.box.appendChild( this.editElem );
        
        this.deleteElem = document.createElement("DIV");
        this.deleteElem.setAttribute( 'class', 'post_delete' );
        this.deleteElem.textContent = 'Delete';
        this.box.appendChild( this.deleteElem );
        
        this.deleteElem.addEventListener( 'click', this );
        this.viewElem.addEventListener( 'click', this );

    };
    
    var _allPosts = this;
    
    this.deleteId = null;
    this.wrapper = document.getElementById('adminAllPosts');
    
    for ( var i=posts.length-1 ; i>=0 ; i-- ) {

        var post = new postSingle( posts[i] );

    }
    
};