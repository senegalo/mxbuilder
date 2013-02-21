(function(){
    $(function(){
        var template = mxBuilder.layout.templates.find(".flexly-menu-widgets-list").remove();
        var templateRow = template.children("li").remove();
        
        mxBuilder.menuManager.menus.widgets = {
            __widgets: [{
                title: "root",
                components: []
                
            },
            {
                title: "Text Widgets",
                components: []
                
            }],
            init: function init(){
                mxBuilder.menuManager.tabTitle.text("Widgets");
                mxBuilder.menuManager.hideTabButtons();
                mxBuilder.menuManager.hideFooter();
                
                var theList = template.clone();
                var appendTo;
                for(var c in this.__widgets){
                    if(this.__widgets[c].title != "root" && this.__widgets[c].components.length > 0){
                        var categoryRow = templateRow.clone()
                        .find(".flexly-menu-widget-icon")
                        .remove()
                        .end()
                        .find(".flexly-menu-widget-title")
                        .text(this.__widgets[c].title)
                        .end()
                        .addClass("flexly-menu-widget-category")
                        .appendTo(theList);
                        
                        appendTo = template.clone().appendTo(categoryRow);
                    } else {
                        appendTo = theList;
                    }
                    for(var w in this.__widgets[c].components){
                        templateRow.clone()
                        .find(".flexly-menu-widget-icon .flexly-icon")
                        .addClass(this.__widgets[c].components[w].icon)
                        .end()
                        .find(".flexly-menu-widget-title")
                        .text(this.__widgets[c].components[w].title)
                        .end()
                        .draggable(this.__widgets[c].components[w].draggableSettings)
                        .appendTo(appendTo);
                    }
                }
                
                mxBuilder.menuManager.contentTab.append(theList);
                                
            },
            addComponent: function addComponent(category,obj){
                obj.draggableSettings.cursorAt = {
                    left: 10,
                    top: 10
                };
                for(var c in this.__widgets){
                    if(this.__widgets[c].title == category){
                        this.__widgets[c].components.push(obj);
                    }
                }
            }
        } 
    });
}(jQuery))