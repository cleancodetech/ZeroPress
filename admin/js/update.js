var ProgressInfo = function() {
    
    this.finish = function() {
        
        document.getElementById('update_button').textContent = "Finished!";
        document.getElementById('update_button').style.backgroundColor = 'rgba(0, 255, 0, 0.75)';
        document.getElementById('update_button').style.color = 'rgb(17, 17, 17)';
        
        this.notif.textContent = 'Ok. Everything seems to have finished. Go on, cross your fingers, reload the page and hope for the best!';
        
    };
    
    this.stepUp = function( step ) {
        
        this.progress = this.progress + step;
        
        this.bar.style.width = this.progress + '%';
        
        this.label.textContent = this.progress + '%';
        
        if ( this.progress >= 100 ) {
            
            this.finish();
            
        }
        
    };
    
    this.initiate = function() {
        
        this.barWrap    = appendDom({ tag: 'DIV', id: 'barWrap', parent: this.container });
        this.bar        = appendDom({ tag: 'DIV', id: 'bar', parent: this.barWrap });
        this.label      = appendDom({ tag: 'DIV', id: 'barLabel', text: '0%', parent: this.barWrap });
        this.notif      = appendDom({ tag: 'P', text: 'Do not close this window before finish!', parent: this.container });
        
    };
    
    var _ProgressInfo = this;
    
    this.container = document.getElementById('update');
    
    this.barWrap = null;
    this.notif = null;
    this.bar = null;
    this.label = null;
    
    this.progress = 0;
    
};




function queryFile( source, file, step ) {
    
    page.cmd( "fileGet", [ "cors-" + source + file ], function( rFileContent ) {
        
        if ( file === '/admin/updater.json' ) {
            
            rFileContent = parseJsonFile( rFileContent, 'updater.json' );
            
            rFileContent.allow_updates = true;
            
            rFileContent = JSON.stringify(rFileContent, null, 4);
            
        }

        page.cmd( "fileWrite", [ file, base64Encode( rFileContent ) ], function( result ) {

            if ( result === 'ok' ) {

                prog.stepUp( step );

            } else {

                console.warn( 'Failed to update file: ' + file + ', msg: ' + result );

            }

        });

    });
    
};




function initUpdateFlow( event ) {
    
    console.log( event );
    
    console.log( remote_content );
    
    prog = new ProgressInfo();
    prog.initiate();
    
    var step = Math.floor( 100 / remote_content.files_update.length );
    
    for ( var i=0 ; i<remote_content.files_update.length ; i++ ) {
        
        var source  = local_content.source;        
        var file    = remote_content.files_update[i];
        
        queryFile( source, file, step );
        
    }
    
};




var site_info           = null;
var init                = null;
var remote_content      = null;
var local_content       = null;
var prog                = null;
var sidebarInit         = new Sidebar();

page.cmd( "siteInfo", [], function( info ) {
    
    site_info = info;
    
    sidebarInit.populate( info );
    
    if ( info.settings.own !== true ) {
                
        window.location.href = window.location.origin + '/' + info.address + '/auth.html';
        
    }
    
});

page.cmd( "fileGet", ["/admin/updater.json"], function( content ) {
    
    local_content = parseJsonFile( content, 'updater.json' );
    
    document.getElementById('installedVersion').innerHTML += '<strong>' + local_content.version + '</strong>';
    
    if ( local_content.allow_updates !== true ) {
    
        page.cmd( "corsPermission", [ local_content.source ], function( result ) {

            if ( result === 'ok' ) {

                local_content.allow_updates = true;

                local_content = JSON.stringify(local_content, null, 4);

                page.cmd( "fileWrite", [ "/admin/updater.json", base64Encode( local_content ) ]);

            }

        });
        
    } else {
        
        var latest = appendDom({ tag: 'P', parent: document.getElementById('update') });
        
        page.cmd( "fileGet", [ "cors-" + local_content.source + "/admin/updater.json" ], function( updater ) {
            
            remote_content = parseJsonFile( updater, 'remote updater.json' );
            
            if ( remote_content.version <= local_content.version ) {
                
                latest.innerHTML = 'Latest version: <strong>' + remote_content.version + '</strong><br>Nothing to do here.';
                
                return false;
                
            }
                
            latest.innerHTML = 'Latest version: <strong>' + remote_content.version + '</strong>';
            
            var warning = appendDom({ tag: 'P', html: '<strong>It is strongly recommended to backup your site before updatting. Loss of data may occure.</strong>', parent: document.getElementById('update') });
            
            var updateButton = appendDom({ tag: 'BUTTON', id: 'update_button', text: 'Update', parent: document.getElementById('update') });
            
            updateButton.addEventListener( 'click', initUpdateFlow );
            
        });
        
    }

});