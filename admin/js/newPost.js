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




var site_info   = null;
var sidebarInit = new Sidebar();

page.cmd( "siteInfo", [], function( info ) {
    
    site_info = info;
    
    sidebarInit.populate( info );
    
    if ( info.settings.own !== true ) {
                
        window.location.href = window.location.origin + '/' + info.address + '/auth.html';
        
    }
    
});




function newPost( event ) {
    
    event.preventDefault();
    
    var title = document.getElementById('post_title').value;
    
    var body = document.getElementById('pellContents').value;
    
    var featuredImage = featuredImageInit.featuredImage;
    
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
        
        content.posts.push({
            id: content.next_post_id++,
            title: title,
            body: body,
            featuredImage: featuredImage,
            date_added: Date.now()
        });
        
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

document.getElementById('publishButton').addEventListener( 'click', newPost );

var featuredImageInit = new FeaturedImage();