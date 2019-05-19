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
        
        this.delElem        = appendDom({ tag: 'SPAN', text: 'Delete', parent: this.menuCustomElem });
        this.titleElem      = appendDom({ tag: 'INPUT', type: 'text', class: 'menuCustomTitle', placeholder: 'Menu Title', title: 'This is the text that will appear for your menu entry', parent: this.menuCustomElem });
        this.targetElem     = appendDom({ tag: 'INPUT', type: 'text', class: 'menuCustomTarget', placeholder: 'Menu Target', title: 'This is the link to which the menu entry will be redirecting', parent: this.menuCustomElem });
        
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
            zerome: 'ZeroMe',
            github: 'GitHub'
        };
        
        this.menuCustomElem = null;
        this.delElem = null;
        this.targetElem = null;
        
        this.menuCustomElem = document.createElement("DIV");
        this.menuCustomElem.setAttribute( 'class', 'menuSocial' );
        _SocialMenus.newSocialMenuButtonElem.parentNode.insertBefore( this.menuCustomElem, _SocialMenus.newSocialMenuButtonElem );
        
        this.delElem = appendDom({ tag: 'SPAN', text: 'Delete', parent: this.menuCustomElem });
        
        this.selectElem = appendDom({ tag: 'SELECT', parent: this.menuCustomElem });
        
        for ( var prop in this.socialMedia ) {
        
            var optionElem = appendDom({ tag: 'OPTION', value: prop, text: this.socialMedia[prop], parent: this.selectElem });
            
        }

        this.targetElem = appendDom({ tag: 'INPUT', type: 'text', class: 'menuCustomTarget', placeholder: 'eg: https://www.facebook.com/myAwesomeFacebookPage', title: 'This is the link to which the menu entry will be redirecting', parent: this.menuCustomElem });
        
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