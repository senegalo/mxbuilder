(function($){
    mxBuilder.HorizontalLineComponent = function HorizontalLineComponent(instance){
        var handle = $('<div class="component-resizable-handle"/>');
        mxBuilder.Component.apply(this,[{
            ID: "hline-component",
            title: "Horizontal Line Component",
            draggable: {},
            resizable: {
                orientation: "h"
            },
            ctxZIndex: true,
            ctxEditableBackground: true,
            selectable: true,
            instance: instance
        }]);
    
        instance.addClass("hline-component-instance").on({
            selected: function(){
                mxBuilder.activeStack.push(instance);
            },
            dblclick: function(){
                mxBuilder.components.getComponent(instance).openBackgroundStyleDialog();
            }
        });
    }
    mxBuilder.HorizontalLineComponent.prototype = new mxBuilder.Component();
    
    //Adding the whole thing to the menu
    $(function(){
        $('<div class="hline-component menu-item" style="cursor:move;">Horizontal line</div>').draggable({
            grid: mxBuilder.properties.gridSize,
            helper: function(event){
                var theContent = $('<div style="width:300px;height:1px;background-color:black;"></div>')
                .data("component",mxBuilder.HorizontalLineComponent)
                .appendTo(mxBuilder.layout.container);
                return theContent;
            }
        }).appendTo(mxBuilder.layout.menu);
    });
    
    
}(jQuery))