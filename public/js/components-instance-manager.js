(function($){
    mxBuilder.components = {
        __components: {},
        addComponent: function(properties){
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
        getComponent: function(obj){
            if(typeof obj == "string"){
                return this.__components[obj];
            } else if (typeof obj == "object"){
                obj = $(obj);
                return this.__components[mxBuilder.utils.getElementGUID(obj)];
            }
            return;
        },
        getComponentsByAssetID: function(assetID){
            var out = {};
            for(var c in this.__components){
                if(this.__components[c].type == "ImageComponent" && this.__components[c].extra.originalAssetID == assetID){
                    out[c] =  this.__components[c];
                }
            }
            return out;
        },
        getComponentsByType: function(type){
            var out = {};
            for(var c in this.__components){
                if(this.__components[c].type == type){
                    out[c] = this.__components[c];
                }
            }
            return out;
        },
        removeComponent: function(instance){
            var id = mxBuilder.utils.getElementGUID(instance);
            mxBuilder.zIndexManager.removeComponent(this.__components[id]);
            delete this.__components[id];
        },
        getNextZIndex: function(){
            return this.__zIndex++;
        },
        swapZIndexs: function(cp1,cp2){
            var zIndex1 = cp1.element.css("zIndex");
            var zIndex2 = cp2.element.css("zIndex");
            cp1.element.css("zIndex",zIndex2);
            cp2.element.css("zIndex",zIndex1);
        },
        moveZ: function(id,moveUpFlag){
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
        moveZTop: function(id){
            this.__components[id].element.css("zIndex",this.getNextZIndex());
        },
        moveZBottom: function(id){
            this.__components[id].element.css("zIndex", --this.__lowestZIndex);
        },
        detectCollision: function(components,collisionMargin, list){
            //preping the list if we do not have it already
            if(!list){
                list = {};
                $.extend(list,this.__components);
                for(var c in components){
                    delete list[components[c].getID()];
                }
            }
            
            var out = {};
            //looping through the components
            var foundOne = false;
            for(c in components){
                //checking for collisions
                var metrics = components[c].getMetrics();
                for(var i in list){
                    var listMetrics = list[i].getMetrics();
                    
                    //Calculating collisions
                    //checking same container
                    var sameContainer = metrics.container == listMetrics.container;
                    //checking vertical collision
                    var verticalCollision = metrics.bottom+collisionMargin >= listMetrics.top && metrics.bottom < listMetrics.top;
                    //collides from the left only
                    //      ____ metrics
                    //    ____   listMetrics
                    var horizontalCollision = metrics.left <= listMetrics.right && metrics.left > listMetrics.left;
                    //collides from the right only
                    //    _____    metrics
                    //       _____ listMetrics
                    horizontalCollision = horizontalCollision || (metrics.right >= listMetrics.left && metrics.right < listMetrics.right);
                    //metrics contains the list
                    //    ________ metrics
                    //      ____   listMetrics
                    horizontalCollision = horizontalCollision || (metrics.right >= listMetrics.right && metrics.left <= listMetrics.left);
                    //list contains the metrics
                    //    ________ listMetrics
                    //      ____   metrics
                    horizontalCollision = horizontalCollision || (metrics.right <= listMetrics.right && metrics.left >= listMetrics.left);
                    
                    if( sameContainer && verticalCollision && horizontalCollision) {
                        out[i] = list[i];
                        delete list[i];
                        foundOne = true;
                    }
                }
            }
            //if we found a single other collision we recurse !            
            if(foundOne){
                var detected = this.detectCollision(out,20, list);
                if(detected){
                    $.extend(out,detected);
                }
                return out;
            } else {
                return false;
            }
        },
        saveAll: function(){
            var out = [];
            for(var c in this.__components){
                out.push(this.__components[c].save());
            }
            return out;
        },
        clearAndRestore: function(components){
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