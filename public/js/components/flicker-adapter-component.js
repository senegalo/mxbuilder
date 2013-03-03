(function($){
    
    $(function(){
        mxBuilder.FlickerAdapterComponent = function FlickerAdapterComponent(properties){
            this.init(properties);
            mxBuilder.Component.apply(this,[{
                type: "FlickerAdapterComponent",
                editableZIndex: false,
                hasSettings: false,
                selectable: true,
                element: properties.element
            }]);
        }
        
        $.extend(mxBuilder.FlickerAdapterComponent.prototype,new mxBuilder.Component(), {
            template: mxBuilder.layout.templates.find(".flexly-flicker-adapter").remove(),
            init: function init(properties){
                var self = this;
                mxBuilder.Component.prototype.init.call(this,properties);
                try{
                    var flickerObj = properties.data.extra.flickerObj;
                    mxBuilder.api.assets.addFlickerImage({
                        flickerObj: flickerObj,
                        success: function(data){
                            mxBuilder.assets.add(data.asset, true);
                            var adapterPosition = self.element.position();
                            mxBuilder.components.addComponent({
                                css: {
                                    left: adapterPosition.left,
                                    top: adapterPosition.top
                                },
                                data:{ 
                                    container: self.container,
                                    type: "ImageComponent",
                                    extra: {
                                        originalAssetID:data.asset.id
                                    }
                                }
                            });
                        },
                        error: function(){
                            mxBuilder.dialogs.alertDialog.show("Couldn't add the image to your assets...<br/>Please try again later");
                        },
                        complete: function(){
                            properties.element.trigger("destroy");
                        }
                    });
                } catch(e){
                    properties.element.remove();
                }
            }
        })
        
    });
    
}(jQuery));