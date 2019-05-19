var CustomMenus = function() {
    
    var CustomMenu = function() {
        
        this.populate = function( menuData ) {
            
            this.titleElem.value = menuData.title;
            this.targetElem.value = menuData.target;
            
        };
        
        this.remove = function() {
            
            this.delElem.removeEventListener( 'click', this );
            
            while ( this.menuCustomElem.firstChild ) {
        
                this.menuCustomElem.removeChild( this.menuCustomElem.firstChild );

            }
            
            this.menuCustomElem.parentNode.removeChild( this.menuCustomElem );
            
        };
        
        this.handleEvent = function( event ) {
            
            if ( event.target === this.delElem ) {

                this.remove();

            }

        };
        
        var _CustomMenu = this;
        
        this.menuCustomElem = null;
        this.delElem = null;
        this.titleElem = null;
        this.targetElem = null;
        
        this.menuCustomElem = document.createElement("DIV");
        this.menuCustomElem.setAttribute( 'class', 'menuCustom' );
        _CustomMenus.newCustomMenuButtonElem.parentNode.insertBefore( this.menuCustomElem, _CustomMenus.newCustomMenuButtonElem );
        
        this.delElem = document.createElement("SPAN");
        this.delElem.textContent = 'Delete';
        this.menuCustomElem.appendChild( this.delElem );

        this.titleElem = document.createElement("INPUT");
        this.titleElem.setAttribute( 'type', 'text' );
        this.titleElem.setAttribute( 'class', 'menuCustomTitle' );
        this.titleElem.setAttribute( 'placeholder', 'Menu Title' );
        this.titleElem.setAttribute( 'title', 'This is the text that will appear for your menu entry' );
        this.menuCustomElem.appendChild( this.titleElem );

        this.targetElem = document.createElement("INPUT");
        this.targetElem.setAttribute( 'type', 'text' );
        this.targetElem.setAttribute( 'class', 'menuCustomTarget' );
        this.targetElem.setAttribute( 'placeholder', 'Menu Target' );
        this.targetElem.setAttribute( 'title', 'This is the link to which the menu entry will be redirecting' );
        this.menuCustomElem.appendChild( this.targetElem );
        
        this.delElem.addEventListener( 'click', this );
        
    };
    
    this.populate = function( menus ) {
        
        for ( var i=0 ; i<menus.length ; i++ ) {
            
            var newMenu = new CustomMenu();
            newMenu.populate( menus[i] );
            
        }
        
    };
    
    this.handleEvent = function( event ) {
            
        if ( event.target === this.newCustomMenuButtonElem ) {

            var newMenu = new CustomMenu();

        }

    };
    
    var _CustomMenus = this;
    
    this.newCustomMenuButtonElem = document.getElementById('newCustomMenu');
    
    this.newCustomMenuButtonElem.addEventListener( 'click', this );
    
};

var SocialMenus = function() {
    
    var SocialMenu = function() {
        
        this.populate = function( menuData ) {
            
            this.selectElem.value = menuData.type;
            this.targetElem.value = menuData.target;
            
        };
        
        this.remove = function() {
            
            this.delElem.removeEventListener( 'click', this );
            
            while ( this.menuCustomElem.firstChild ) {
        
                this.menuCustomElem.removeChild( this.menuCustomElem.firstChild );

            }
            
            this.menuCustomElem.parentNode.removeChild( this.menuCustomElem );
            
        };
        
        this.handleEvent = function( event ) {
            
            if ( event.target === this.delElem ) {

                this.remove();

            }

        };
        
        var _SocialMenu = this;
        
        this.socialMedia = {
            facebook: 'Facebook',
            twitter: 'Twitter',
            zeromail: 'ZeroMail',
            zerome: 'ZeroMe'
        };
        
        this.menuCustomElem = null;
        this.delElem = null;
        this.targetElem = null;
        
        this.menuCustomElem = document.createElement("DIV");
        this.menuCustomElem.setAttribute( 'class', 'menuSocial' );
        _SocialMenus.newSocialMenuButtonElem.parentNode.insertBefore( this.menuCustomElem, _SocialMenus.newSocialMenuButtonElem );
        
        this.delElem = document.createElement("SPAN");
        this.delElem.textContent = 'Delete';
        this.menuCustomElem.appendChild( this.delElem );
        
        this.selectElem = document.createElement("SELECT");
        this.menuCustomElem.appendChild( this.selectElem );
        
        for ( var prop in this.socialMedia ) {
            
            var optionElem = document.createElement("OPTION");
            optionElem.value = prop;
            optionElem.textContent = this.socialMedia[prop];
            this.selectElem.appendChild( optionElem );
            
        }

        this.targetElem = document.createElement("INPUT");
        this.targetElem.setAttribute( 'type', 'text' );
        this.targetElem.setAttribute( 'class', 'menuCustomTarget' );
        this.targetElem.setAttribute( 'placeholder', 'eg: https://www.facebook.com/myAwesomeFacebookPage' );
        this.targetElem.setAttribute( 'title', 'This is the link to which the menu entry will be redirecting' );
        this.menuCustomElem.appendChild( this.targetElem );
        
        this.delElem.addEventListener( 'click', this );
        
    };
    
    this.populate = function( menus ) {
        
        for ( var i=0 ; i<menus.length ; i++ ) {
            
            var newMenu = new SocialMenu();
            newMenu.populate( menus[i] );
            
        }
        
    };
    
    this.handleEvent = function( event ) {
            
        if ( event.target === this.newSocialMenuButtonElem ) {

            var newMenu = new SocialMenu();

        }

    };
    
    var _SocialMenus = this;
    
    this.newSocialMenuButtonElem = document.getElementById('newSocialMenu');
    
    this.newSocialMenuButtonElem.addEventListener( 'click', this );
    
};

function saveMenus( event ) {
    
    event.preventDefault();
    
    var socialMenuData = [];
    
    var socialMenuBlocks = document.querySelectorAll('.menuSocial');
    
    for ( var i=0 ; i<socialMenuBlocks.length ; i++ ) {
        
        socialMenuData.push({
            type: socialMenuBlocks[i].querySelector('select').options[ socialMenuBlocks[i].querySelector('select').options.selectedIndex ].value,
            target: socialMenuBlocks[i].querySelector('.menuCustomTarget').value
        });
        
    }
    
    var socialMenus = {
        socialMenus: socialMenuData
    };
    
    var socialContent = JSON.stringify(socialMenus, null, 4);
    
    var customMenuData = [];
    
    var customMenuBlocks = document.querySelectorAll('.menuCustom');
    
    for ( var i=0 ; i<customMenuBlocks.length ; i++ ) {
        
        customMenuData.push({
            title: customMenuBlocks[i].querySelector('.menuCustomTitle').value,
            target: customMenuBlocks[i].querySelector('.menuCustomTarget').value
        });
        
    }
    
    var customMenus = {
        menus: customMenuData
    };
    
    var content = JSON.stringify(customMenus, null, 4);
    
    page.cmd( "fileWrite", [ "/data/admin/menus.json", base64Encode( content ) ], function( result ) {
        
        page.cmd( "fileWrite", [ "/data/admin/socialMenus.json", base64Encode( socialContent ) ], function( result ) {
            
            page.cmd("sitePublish", [ "stored" ], function( result ) {

                page.cmd('wrapperNotification', ['done', 'Your menu settings were saved', 4000]);

            });
            
        });

    });
    
};




var site_info       = null;
var init            = null;
var sidebarInit     = new Sidebar();
var customMenusInit = new CustomMenus();
var socialMenusInit = new SocialMenus();

page.cmd( "siteInfo", [], function( info ) {
    
    site_info = info;
    
    sidebarInit.populate( info );
    
    if ( info.settings.own !== true ) {
                
        window.location.href = window.location.origin + '/' + info.address + '/auth.html';
        
    }
    
});

page.cmd( "fileGet", ["/data/admin/menus.json"], function( content ) {
    
    content = content || "";
        
    try {
        content = JSON.parse(content);
    } catch(e) {
        content = {
            menus: []
        };
    }
    
    customMenusInit.populate( content.menus );
    
});

page.cmd( "fileGet", ["/data/admin/socialMenus.json"], function( content ) {
    
    content = content || "";
        
    try {
        content = JSON.parse(content);
    } catch(e) {
        content = {
            socialMenus: []
        };
    }
    
    socialMenusInit.populate( content.socialMenus );
    
});

document.getElementById('saveMenus').addEventListener( 'click', saveMenus );