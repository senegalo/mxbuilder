(function($){
    $(function(){
        mxBuilder.VerticalLineComponent = function VerticalLineComponent(properties){
            this.init(properties);
            var handle = $('<div class="component-resizable-handle"/>');
            mxBuilder.Component.apply(this,[{
                type: "VerticalLineComponent",
                draggable: {},
                resizable: {
                    orientation: "v"
                },
                ctxZIndex: true,
                ctxEditableBackground: true,
                selectable: true,
                element: properties.element
            }]);
    
            properties.element.addClass("").on({
                selected: function(){
                    mxBuilder.activeStack.push(properties.element);
                },
                dblclick: function(){
                    mxBuilder.components.getComponent(properties.element).openBackgroundStyleDialog();
                }
            });
        }
        $.extend(mxBuilder.VerticalLineComponent.prototype,new mxBuilder.Component(),{
            template: mxBuilder.layout.templates.find(".vline-component-instance").remove() 
        });
    
        //Adding the whole thing to the menu

        $('<div class="vline-component menu-item mx-helper" style="cursor:move;">Vertical line</div>').draggable({
            grid: mxBuilder.properties.gridSize,
            helper: function(event){
                var theContent = mxBuilder.VerticalLineComponent.prototype.template.clone()
                .css("zIndex",mxBuilder.config.newComponentHelperZIndex)
                .data("component","VerticalLineComponent")
                .appendTo(mxBuilder.layout.container);
                return theContent;
            }
        }).appendTo(mxBuilder.layout.menu);
    }); 
}(jQuery))