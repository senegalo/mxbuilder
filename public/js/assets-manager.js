(function($){
    mxBuilder.assets = {
        __assets: {},
        __assetsOrdered: [],
        add: function(obj,prependFlag){
            if(prependFlag){
                this.__assetsOrdered.splice(0,0,obj);
            } else {
                this.__assetsOrdered.push(obj);
            }
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
            
            //binnary search: search for the asset in the ordered array and removing it
            //high and low are reversed as the list is ordered decendingly !
            var low = 0;
            var high = this.__assetsOrdered.length - 1;
            var currentIndex;
            while(low <= high){
                currentIndex = Math.floor((low+high)/2);
                if(id == this.__assetsOrdered[currentIndex].id){
                    this.__assetsOrdered.splice(currentIndex,1);
                    break;
                } else if (id < this.__assetsOrdered[currentIndex].id){
                    low = currentIndex + 1;
                } else {
                    high = currentIndex - 1;
                }
            }
            delete this.__assets[id];
        }
    }  
}(jQuery))