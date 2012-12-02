(function($){
    mxBuilder.assets = {
        __assets: {},
        __assetsOrdered: [],
        add: function(obj){       
            this.__assetsOrdered.push(obj);
            this.__assets[obj.id] = obj;
        },
        get: function(id){
            return this.__assets[id];
        },
        each: function(callback){
            for(var a in this.__assetsOrdered){
                var theAsset = this.__assets[this.__assetsOrdered[a].id];
                if(theAsset.id == 0){
                    continue;
                }
                callback.call(theAsset);
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
            var theIndex = this.__assetsOrdered.indexOf(id);
            if(theIndex !== -1){
                this.__assetsOrdered.splice(theIndex,1);
            }
            delete this.__assets[id];
        }
    }  
}(jQuery))