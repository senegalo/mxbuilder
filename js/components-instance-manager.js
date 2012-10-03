(function($){
    mxBuilder.components = {
        __components: {},
        __zIndex: 1000,
        addComponent: function addComponent(properties){
            var component = new mxBuilder[properties.data.type](properties);
            var guid = mxBuilder.utils.assignGUID(component.element);
            component.element.css("zIndex",this.getNextZIndex());
            mxBuilder.pages.attachComponentToPage(component);
            this.__components[guid] = component;
            if(typeof properties.data.container != "undefined"){
                component.setContainer(properties.data.container);
            }
            return this.__components[guid];
        },
        getComponent: function getComponent(instance){
            return this.__components[mxBuilder.utils.getElementGUID(instance)];
        },
        removeComponent: function removeComponent(instance){
            var id = mxBuilder.utils.getElementGUID(instance);
            delete this.__components[id];
        },
        getNextZIndex: function getNextZIndex(){
            return this.__zIndex++;
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