(function($){
    $(function(){
        mxBuilder.HorizontalLineComponent = function HorizontalLineComponent(properties){
            this.init(properties);
            var handle = $('<div class="component-resizable-handle"/>');
            mxBuilder.Component.apply(this,[{
                type: "HorizontalLineComponent",
                draggable: {},
                resizable: {
                    orientation: "h"
                },
                editableZIndex: true,
                settings: true,
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
        $.extend(mxBuilder.HorizontalLineComponent.prototype, new mxBuilder.Component(), {
            template: mxBuilder.layout.templates.find(".hline-component-instance").remove(),
            getSettingsPanels: function getSettingsPanel(){
                var out = mxBuilder.Component.prototype.getSettingsPanel.call(this);
                delete out.border;
                return out;
            }
        });
    
        //Adding the whole thing to the menu
    
        $('<div class="hline-component menu-item mx-helper" style="cursor:move;">Horizontal line</div>').draggable({
            helper: function(event){
                var theContent = mxBuilder.HorizontalLineComponent.prototype.template.clone()
                .css("zIndex",mxBuilder.config.newComponentHelperZIndex)
                .data("component","HorizontalLineComponent")
                .appendTo(mxBuilder.layout.container);
                return theContent;
            }
        }).appendTo(mxBuilder.layout.menu);
    });
    
    
}(jQuery))