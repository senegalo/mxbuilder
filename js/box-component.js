(function($){
    mxBuilder.BoxComponent = function BoxComponent(instance){
        mxBuilder.Component.apply(this,[{
            ID: "box-component",
            title: "Box Component",
            draggable: {},
            resizable: {},
            ctxZIndex: true,
            ctxEditableBorder: true,
            ctxEditableBackground: true,
            selectable: true,
            instance: instance
        }]);
    
        instance.addClass("box-component-instance").on({
            selected: function(){
                mxBuilder.activeStack.push(instance);
            }
        });
    }
    mxBuilder.BoxComponent.prototype = new mxBuilder.Component();
    
    //Adding the whole thing to the menu
    $(function(){
        $('<div class="box-component menu-item" style="cursor:move;">Box</div>').draggable({
            grid: mxBuilder.properties.gridSize,
            helper: function(event){
                var theContent = $('<div style="width:300px;height:200px;background-color:rgba(0,0,0,0.5);border-radius:6px;"></div>')
                .data("component",mxBuilder.BoxComponent)
                .appendTo(mxBuilder.layout.container);
                return theContent;
            }
        }).appendTo(mxBuilder.layout.menu);
    });
    
    
}(jQuery))