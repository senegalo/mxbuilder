(function($){
    $(function(){
        mxBuilder.BoxComponent = function BoxComponent(properties){
            this.init(properties);
            mxBuilder.Component.apply(this,[{
                type: "BoxComponent",
                draggable: {},
                resizable: {},
                editableZIndex: true,
                editableBorder: true,
                editableBackground: true,
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
        
        var widgets = mxBuilder.menuManager.menus.widgets;
        widgets.addComponent("root",{
            icon: "flexly-icon-box-component",
            title: "Layout Box",
            draggableSettings: {
                grid: mxBuilder.properties.gridSize,
                helper: function(event){
                    var theContent = mxBuilder.BoxComponent.prototype.template.clone()
                    .addClass("mx-helper")
                    .data("component","BoxComponent")
                    .appendTo(mxBuilder.layout.container);
                    return theContent;
                }
            }
        });
        
    });
}(jQuery))