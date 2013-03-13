(function($){
    $(function(){
        $(mxBuilder.systemEvents).on({
            systemReady: function(){
                mxBuilder.settingsManager.init();
            }
        });
        
        mxBuilder.settingsManager = {
            _settings: {
                snap: {
                    objects: false
                }
            },
            init: function(){
                this.setObjectSnap(this._settings.snap.objects);
            },
            setObjectSnap: function(flag){
                this._settings.snap.objects = flag;
                var klasses = ".ui-draggable.mx-helper,.ui-draggable.mx-component";
		    var snapTo = flag?klasses+":not(.ui-selected),#header-content,#body-content,#footer-content":false;
                $(klasses).add(mxBuilder.selection.getSelectionContainer())
                .draggable("option","snap",snapTo);
		    $(".ui-resizable.mx-component").resizable("option","snap",snapTo);
            },
            getSetting: function(namespace,key){
                return this._settings[namespace][key];
            }
        };
    });
    
}(jQuery));
