(function($){
    mxBuilder.components = {
        __components: {},
        __zIndex: 1000,
        addComponent: function addComponent(instance,theClass){
            var guid = mxBuilder.utils.assignGUID(instance);
            instance.css("zIndex",this.getNextZIndex());
            this.__components[guid] = new theClass(instance);
            return this.__components[guid];
        },
        getComponent: function getComponent(instance){
            return this.__components[mxBuilder.utils.getElementGUID(instance)];
        },
        removeComponent: function removeComponent(instance){
            delete this.__components[mxBuilder.utils.getElementGUID(instance)];
        },
        getNextZIndex: function getNextZIndex(){
            return this.__zIndex++;
        },
        pushComponentsBelow: function pushComponentsBelow(metrics){
            for(var c in this.__components){
                this.__components[c].position = this.__components[c].instance.position();
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
        }
    };
}(jQuery));