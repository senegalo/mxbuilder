(function($){
    mxBuilder.assets = {
        __assets: {},
        add: function(obj){                
            this.__assets[obj.id] = obj;
        },
        get: function(id){
            return this.__assets[id];
        },
        each: function(callback){
            for(var a in this.__assets){
                callback.call(this.__assets[a]);
            }
        },
        remove: function(id){
            if(this.__assets[id].type == "image"){
                //remove the image from any active component
                var components = mxBuilder.components.getComponentsByAssetID(id);
                for(var c in components){
                    mxBuilder.pages.detachComponentFromPage(components[c]);
                    mxBuilder.selection.removeFromSelection(components[c].element);
                    components[c].destroy();
                }
                
                //remove from other pages
                mxBuilder.pages.removeImgComponentFromPages(id);
            }
            delete this.__assets[id];
        }
    }  
}(jQuery))