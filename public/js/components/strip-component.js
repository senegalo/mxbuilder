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
                selectable: true,
                element: properties.element
            }]);
    
            properties.element.on({
                selected: function(){
                    instance.resetSize();
                },
                deselected: function(){
                    instance.resetSize();
                },
                dblclick: function(){
                    mxBuilder.menuManager.showTab("componentSettings");
                }
            });
            
            this.resetSize();
        }
        $.extend(mxBuilder.StripComponent.prototype, new mxBuilder.Component(), {
            template: mxBuilder.layout.templates.find(".strip-component-instance").remove(),
            resetSize: function resetSize(){                
                this.element.css({
                    width: $(document.body).outerWidth(true),
                    left: -1*mxBuilder.layout.container.offset().left
                });
            },
            getSettingsPanels: function getSettingsPanels(){
                var out = mxBuilder.Component.prototype.getSettingsPanels.call(this);
                delete out.border;
                return out;
            },
            nudgeComponent: function nudgeComponent(keyCode,shift){
                if(keyCode != 37 && keyCode != 39){
                    mxBuilder.Component.prototype.nudgeComponent.call(this,keyCode,shift);
                }
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