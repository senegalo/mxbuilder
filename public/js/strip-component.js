(function($){
    $(function(){
        mxBuilder.StripComponent = function StripComponent(properties){
            this.init(properties);
            mxBuilder.Component.apply(this,[{
                type: "StripComponent",
                draggable: {
                    axis: "y"
                },
                resizable: {
                    orientation: "v"
                },
                ctxZIndex: true,
                ctxEditableBorder: true,
                ctxEditableBackground: true,
                selectable: true,
                element: properties.element
            }]);
    
            properties.element.on({
                selected: function(){
                    mxBuilder.activeStack.push(properties.element);
                },
                dblclick: function(){
                    mxBuilder.components.getComponent(properties.element).openBackgroundStyleDialog();
                }
            }).css({
                width: $(document.body).width(),
                left: -1*mxBuilder.layout.container.offset().left
            });
        }
        $.extend(mxBuilder.StripComponent.prototype, new mxBuilder.Component(), {
            template: mxBuilder.layout.templates.find(".strip-component-instance").remove()
        });
    
        //Adding the whole thing to the menu
        $('<div class="strip-component menu-item" style="cursor:move;">Strip</div>').draggable({
            grid: mxBuilder.properties.gridSize,
            helper: function(event){
                var theContent = mxBuilder.StripComponent.prototype.template.clone().css("zIndex",mxBuilder.config.newComponentHelperZIndex)
                .data("component","StripComponent")
                .appendTo(mxBuilder.layout.container);
                return theContent;
            }
        }).appendTo(mxBuilder.layout.menu);
    });
    
    
}(jQuery))