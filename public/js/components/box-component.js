(function($){
    $(function(){
        mxBuilder.BoxComponent = function BoxComponent(properties){
            this.init(properties);
            mxBuilder.Component.apply(this,[{
                type: "BoxComponent",
                draggable: {},
                resizable: {},
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
            });
        }
        $.extend(mxBuilder.BoxComponent.prototype, new mxBuilder.Component(), {
            template: mxBuilder.layout.templates.find(".box-component-instance").remove()
        });
    
        $('<div class="box-component menu-item mx-helper" style="cursor:move;">Box</div>').draggable({
            grid: mxBuilder.properties.gridSize,
            helper: function(event){
                var theContent = mxBuilder.BoxComponent.prototype.template.clone()
                .css("zIndex",mxBuilder.config.newComponentHelperZIndex)
                .data("component","BoxComponent")
                .appendTo(mxBuilder.layout.container);
                return theContent;
            }
        }).appendTo(mxBuilder.layout.menu);
    });
}(jQuery))