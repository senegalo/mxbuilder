(function($) {

    $(function() {
        mxBuilder.FlickerAdapterComponent = function FlickerAdapterComponent(properties) {
            this.init(properties);
            mxBuilder.Component.apply(this, [{
                    type: "FlickerAdapterComponent",
                    editableZIndex: false,
                    hasSettings: false,
                    selectable: true,
                    element: properties.element
                }]);
        };

        $.extend(mxBuilder.FlickerAdapterComponent.prototype, new mxBuilder.Component(), {
            template: mxBuilder.layout.templates.find(".flexly-flicker-adapter").remove(),
            init: function init(properties) {
                var self = this;
                mxBuilder.Component.prototype.init.call(this, properties);
                try {
                    mxBuilder.api.assets.addFlickerImage({
                        flickerObj: properties.data.extra.flickerObj,
                        success: function(data) {
                            mxBuilder.assets.add(data.asset, true);
                            mxBuilder.components.addComponent({
                                fixFooter: true,
                                css: {
                                    left: properties.css.left,
                                    top: properties.css.top
                                },
                                data: {
                                    page: self.page,
                                    container: self.container,
                                    type: "ImageComponent",
                                    extra: {
                                        originalAssetID: data.asset.id
                                    }
                                }
                            });
                            
                            if(mxBuilder.menuManager.currentTab === "photos"){
                                mxBuilder.menuManager.menus.photos.revalidate();
                            }
                            
                            mxBuilder.layout.revalidateLayout();
                        },
                        error: function() {
                            mxBuilder.dialogs.alertDialog.show("Couldn't add the image to your assets...<br/>Please try again later");
                        },
                        complete: function() {
                            self.destroy();
                        }
                    });
                } catch (e) {
                    properties.element.remove();
                }
            }
        });
    });
}(jQuery));