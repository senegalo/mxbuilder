(function($){
    mxBuilder.components = {
        __components: {},
        addComponent: function addComponent(properties){
            var component = new mxBuilder[properties.data.type](properties);
            var guid = mxBuilder.utils.assignGUID(component.element);
            
            mxBuilder.zIndexManager.addComponent(component);
            
            mxBuilder.pages.attachComponentToPage(component);
            this.__components[guid] = component;
            if(typeof properties.data.container != "undefined"){
                component.setContainer(properties.data.container);
            }
            return this.__components[guid];
        },
        getComponent: function getComponent(obj){
            if(typeof obj == "string"){
                return this.__components[obj];
            } else if (typeof obj == "object"){
                obj = $(obj);
                return this.__components[mxBuilder.utils.getElementGUID(obj)];
            }
            return;
        },
        getComponentsByAssetID: function getComponentsByAssetID(assetID){
            var out = {};
            for(var c in this.__components){
                if(this.__components[c].type == "ImageComponent" && this.__components[c].extra.originalAssetID == assetID){
                    out[c] =  this.__components[c];
                }
            }
            return out;
        },
        getComponentsByType: function getComponentsByType(type){
            var out = {};
            for(var c in this.__components){
                if(this.__components[c].type == type){
                    out[c] = this.__components[c];
                }
            }
            return out;
        },
        removeComponent: function removeComponent(instance){
            var id = mxBuilder.utils.getElementGUID(instance);
            mxBuilder.zIndexManager.removeComponent(this.__components[id]);
            delete this.__components[id];
        },
        getNextZIndex: function getNextZIndex(){
            return this.__zIndex++;
        },
        swapZIndexs: function swapComponentZIndex(cp1,cp2){
            var zIndex1 = cp1.element.css("zIndex");
            var zIndex2 = cp2.element.css("zIndex");
            cp1.element.css("zIndex",zIndex2);
            cp2.element.css("zIndex",zIndex1);
        },
        moveZ: function decrementZIndex(id,moveUpFlag){
            var component = this.__components[id];
            var currentZIndex = component.element.css("zIndex");
            var factor = moveUpFlag?1:-1;
            var adjacentComponent = this.getComponentAtZIndex(currentZIndex+factor);
            if(adjacentComponent){
                this.swapComponentZIndex(adjacentComponent, component);
            } else {
                component.element.css("zIndex",currentZIndex+factor);
            }
        },
        moveZTop: function moveZTop(id){
            this.__components[id].element.css("zIndex",this.getNextZIndex());
        },
        moveZBottom: function moveZBottom(id){
            this.__components[id].element.css("zIndex", --this.__lowestZIndex);
        },
        pushComponentsBelow: function pushComponentsBelow(metrics){
            for(var c in this.__components){
                this.__components[c].position = this.__components[c].element.position();
                if(metrics.container == this.__components[c].container && 
                    metrics.top+metrics.oldHeight < this.__components[c].position.top &&
                    ((this.__components[c].position.left >= metrics.left && this.__components[c].position.left < metrics.left+metrics.width) || 
                        (this.__components[c].position.left < metrics.left && this.__components[c].position.left+this.__components[c].size.width >= metrics.left))){
                    this.__components[c].setPosition({
                        left: this.__components[c].position.left,
                        top: this.__components[c].position.top+metrics.offsetHeight
                    },true);
                }
            }
        },
        saveAll: function saveAll(){
            var out = [];
            for(var c in this.__components){
                out.push(this.__components[c].save());
            }
            return out;
        },
        clearAndRestore: function clearAndRestore(components){
            //clearing unwanted components
            for(var i in this.__components){
                if(components[i]){
                    continue;
                }
                this.__components[i].destroy();
            }
            
            //restoring components
            for(i in components){
                if(this.__components[i]){
                    continue;
                }
                this.addComponent(components[i]);
            }
        }
    };
}(jQuery));