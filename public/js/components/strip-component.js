(function($){
    $(function(){
        mxBuilder.StripComponent = function StripComponent(properties){
            var instance = this;
            
            this.init(properties);
            mxBuilder.Component.apply(this,[{
                type: "StripComponent",
                draggable: {
                    axis: "y",
                    scroll: false
                },
                resizable: {
                    orientation: "v"
                },
                editableZIndex: true,
                editableBackground: true,
                selectable: true,
                element: properties.element
            }]);
    
            properties.element.on({
                selected: function(){
                    mxBuilder.activeStack.push(properties.element);
                    //instance.resetSize();
                    var before = instance.element.width();
                    //instance.element.width(before-12);
                    instance.element.css({
                        width: before-10,
                        left: instance.element.position().left + 4
                    }).data("original-width",before);
                    console.log("Before",before,"position",instance.element.position())
                    mxBuilder.selection.revalidateSelectionContainer();
                },
                deselected: function(){
                    //instance.resetSize();
                    instance.element.css({
                        width: instance.element.data("original-width")-1,
                        left: instance.element.position().left - 4
                    })
                    instance.element.width(instance.element.data("original-width")-1);
                    console.log("Cur.Width",instance.element.width(),"position",instance.element.position())
                    mxBuilder.selection.revalidateSelectionContainer();
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
                    width: $(document.body).outerWidth(),
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
        var widgets = mxBuilder.menuManager.menus.widgets;
        widgets.addComponent("root",{
            icon: "flexly-icon-strip-component",
            title: "Horizontal Strip",
            draggableSettings: {
                grid: mxBuilder.properties.gridSize,
                helper: function(event){
                    var theContent = mxBuilder.StripComponent.prototype.template.clone()
                    .addClass("mx-helper")
                    .data("component","StripComponent")
                    .appendTo(mxBuilder.layout.container);
                    return theContent;
                }
            }
        });
    });
    
    
}(jQuery))