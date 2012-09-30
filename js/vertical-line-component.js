(function($){
    mxBuilder.VerticalLineComponent = function VerticalLineComponent(instance){
        var handle = $('<div class="component-resizable-handle"/>');
        mxBuilder.Component.apply(this,[{
            ID: "vline-component",
            title: "Vertical Line Component",
            draggable: {},
            resizable: {
                orientation: "v"
            },
            ctxZIndex: true,
            ctxEditableBackground: true,
            selectable: true,
            instance: instance
        }]);
    
        instance.addClass("vline-component-instance").on({
            selected: function(){
                mxBuilder.activeStack.push(instance);
            },
            dblclick: function(){
                mxBuilder.components.getComponent(instance).openBackgroundStyleDialog();
            }
        });
    }
    mxBuilder.VerticalLineComponent.prototype = new mxBuilder.Component();
    
    //Adding the whole thing to the menu
    $(function(){
        $('<div class="vline-component menu-item" style="cursor:move;">Vertical line</div>').draggable({
            grid: mxBuilder.properties.gridSize,
            helper: function(event){
                var theContent = $('<div style="height:200px;width:1px;background-color:black;"></div>')
                .data("component",mxBuilder.VerticalLineComponent)
                .appendTo(mxBuilder.layout.container);
                return theContent;
            }
        }).appendTo(mxBuilder.layout.menu);
    });
    
    
}(jQuery))