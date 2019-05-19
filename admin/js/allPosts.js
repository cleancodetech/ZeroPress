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
        
        this.box            = appendDom({ tag: 'DIV', class: 'post', parent: _allPosts.wrapper });
        this.titleElem      = appendDom({ tag: 'DIV', class: 'post_title', text: this.title, parent: this.box });
        this.dateElem       = appendDom({ tag: 'DIV', class: 'post_date', text: this.date, parent: this.box });
        this.viewElem       = appendDom({ tag: 'DIV', class: 'post_view', text: 'View', parent: this.box });
        this.editElem       = appendDom({ tag: 'A', class: 'post_edit', text: 'Edit', href: 'editPost.html?id=' + this.data.id, parent: this.box });
        this.deleteElem     = appendDom({ tag: 'DIV', class: 'post_delete', text: 'Delete', parent: this.box });
        
        this.viewElem.dataset.postid = this.data.id;
        
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