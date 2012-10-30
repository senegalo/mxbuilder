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
            
            this.resetSize();
            
        }
        $.extend(mxBuilder.StripComponent.prototype, new mxBuilder.Component(), {
            template: mxBuilder.layout.templates.find(".strip-component-instance").remove(),
            resetSize: function resetSize(){
                this.element.css({
                    width: $(document.body).width(),
                    left: -1*mxBuilder.layout.container.offset().left
                });
            }
        });
        
        //if the window is resized ... revalidate all stip components
        $(window).on({
            resize: function resize(){
                var stripCmps = mxBuilder.components.getComponentsByType("StripComponent");
                for(var c in stripCmps){
                    stripCmps[c].resetSize();
                }
            }
        });
    
        //Adding the whole thing to the menu
        $('<div class="strip-component menu-item mx-helper" style="cursor:move;">Strip</div>').draggable({
            grid: mxBuilder.properties.gridSize,
            helper: function(event){
                var theContent = mxBuilder.StripComponent.prototype.template.clone()
                .css("zIndex",mxBuilder.config.newComponentHelperZIndex)
                .data("component","StripComponent")
                .appendTo(mxBuilder.layout.container);
                return theContent;
            }
        }).appendTo(mxBuilder.layout.menu);
    });
    
    
}(jQuery))