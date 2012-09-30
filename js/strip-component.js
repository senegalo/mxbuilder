(function($){
    mxBuilder.StripComponent = function StripComponent(instance){
        mxBuilder.Component.apply(this,[{
            ID: "strip-component",
            title: "strip Component",
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
            instance: instance
        }]);
    
        instance.addClass("strip-component-instance").on({
            selected: function(){
                mxBuilder.activeStack.push(instance);
            },
            dblclick: function(){
                mxBuilder.components.getComponent(instance).openBackgroundStyleDialog();
            }
        }).css({
            width: $(document).width()+50,
            left: (mxBuilder.layout.container.offset().left*-1)-25
        });
    }
    mxBuilder.StripComponent.prototype = new mxBuilder.Component();
    
    //Adding the whole thing to the menu
    $(function(){
        $('<div class="strip-component menu-item" style="cursor:move;">Strip</div>').draggable({
            grid: mxBuilder.properties.gridSize,
            helper: function(event){
                var theContent = $('<div style="width:900px;height:200px;background-color:rgba(0,0,0,1)"></div>')
                .data("component",mxBuilder.StripComponent)
                .appendTo(mxBuilder.layout.container);
                return theContent;
            }
        }).appendTo(mxBuilder.layout.menu);
    });
    
    
}(jQuery))