(function($){
    
    $(function(){
        mxBuilder.MenuComponent = function MenuComponent(properties){
            var menuComponent = this;
            this.init(properties);
            mxBuilder.Component.apply(this,[{
                type: "MenuComponent",
                draggable: {},
                resizable: {
                    orientation: "h"
                },
                editableZIndex: true,
                hasSettings: true,
                selectable: true,
                element: properties.element
            }]);
        
            this.element.on({
                resize: function resize(){
                    menuComponent.revalidate();
                } 
            });
        
        }
        
        var template = mxBuilder.layout.templates.find(".flexly-main-menu-component-instance").remove();
        var listTemplate = template.find("ul").remove();
        var listElementTemplate = listTemplate.find("li").remove();
        $.extend(mxBuilder.MenuComponent.prototype,new mxBuilder.Component(), {
            template: template,
            init: function init(properties){
                mxBuilder.Component.prototype.init.call(this,properties);
                this.rebuild(properties.element);
            },
            rebuild: function rebuild(element){
                element = element ? element : this.element;
                element.children("ul, div.clearer").remove();
                var theList= listTemplate.clone().find("li").remove().end().appendTo(element);
                var pages = mxBuilder.pages.getOrderedPages();
                for(var p in pages){
                    if(pages[p].showInMenu !== true){
                        continue;
                    }                    
                    if(pages[p].parent == "root" && element.find(".main-menu-cat-"+pages[p].id).length == 0){
                        var theListElement = this.getListElement(pages[p]);
                        theList.append(theListElement);
                    } else if(pages[p].parent != "root" && mxBuilder.pages.getPageObj(pages[p].parent).showInMenu == true){
                        //Check if we created the parent element
                        var theParentList = element.find(".main-menu-cat-"+pages[p].parent);
                        var parentPageObj = mxBuilder.pages.getPageObj(pages[p].parent);
                        if(theParentList.length == 0){
                            theParentList = this.getListElement(parentPageObj).appendTo(theList);
                        } 
                        
                        //Checking if we created the list of siblings
                        var theParentSiblings = theParentList.find("ul.main-menu-cat-child");
                        
                        if(theParentSiblings.length == 0){
                            theParentSiblings = this.getList(parentPageObj);
                            theParentList.append(theParentSiblings);
                        }
                        //finally append the element
                        theParentSiblings.append(this.getListElement(pages[p]));
                        
                    }
                }
                theList.customMenu();                
                theList.children("li").each(function(){
                    var element = $(this);
                    element.data("true-width",element.width());
                });
                this.revalidate(element);
                mxBuilder.selection.revalidateSelectionContainer();
            },
            getList: function getList(obj){
                return listTemplate.clone()
                .addClass("main-menu-cat-child main-menu-cat-"+obj.id)
                .removeClass("main-menu-container");
            },
            getListElement: function getListElement(obj){
                return listElementTemplate.clone().addClass("main-menu-cat main-menu-cat-"+obj.id).find("a").text(obj.title).end();
            },
            revalidate: function revalidate(element){
                element = element ? element : this.element;
                var theUl = element.children("ul");
                var moreListElement = theUl.find(".main-menu-more");
                var moreListElementChilds = moreListElement.find(">ul").children("li");
                var elementWidth = element.width();
                var extraSpace = null;
                    
                //Checklist
                var sumListElementWidth = 0;
                theUl.children("li").each(function(){
                    var element = $(this);
                    if(extraSpace == null){
                        extraSpace = element.outerWidth(true)-element.width();
                    }
                    sumListElementWidth += element.width()+extraSpace;
                });
                    
                var isMoreListElementCreated = moreListElement.length > 0 && moreListElementChilds.length > 0;
                var isEnoughWidth = (moreListElementChilds.first().data("true-width")+extraSpace)+sumListElementWidth +10; //< elementWidth;
                  
                if(moreListElementChilds.length == 1){
                    isEnoughWidth -= moreListElement.width()-extraSpace;
                }
                isEnoughWidth = isEnoughWidth < elementWidth;
                  
                //Remove from the more element and push it to the main menu if we have enough space
                if(isMoreListElementCreated  && isEnoughWidth){
                    var moreListChildren = moreListElement.children("ul");
                    moreListChildren.children("li:first-child").insertBefore(moreListElement);
                    if(moreListChildren.children("li").length == 0){
                        moreListElement.remove();
                    }
                }
                    
                //Push it back in the more element if we do not have enough space
                if(sumListElementWidth > elementWidth){
                        
                    //Do we have a more list element !??
                    if(moreListElement.length == 0){
                        moreListElement = listElementTemplate.clone()
                        .addClass("main-menu-cat main-menu-more")
                        .appendTo(theUl)
                        .find("a")
                        .text("More of a link than the others...")
                        .end();
                        listTemplate.clone().appendTo(moreListElement)
                        .addClass("main-menu-cat-child")
                        .removeClass("main-menu-container");
                        sumListElementWidth += moreListElement.width()+extraSpace;
                    }
                    var x = 0;
                    while(sumListElementWidth > elementWidth){
                        x++;
                        var thePushedDown = moreListElement.prev();
                        sumListElementWidth -= extraSpace+thePushedDown.width();
                        thePushedDown.prependTo(moreListElement.children("ul"));
                    }
                }
                element.height(theUl.outerHeight(true));
            },
            getSettingsPanel: function getSettingsPanel(){
                return {
                    mainMenu: mxBuilder.layout.settingsPanels.mainMenu.getPanel(true)
                }
            }
        });
        
        var widgets = mxBuilder.menuManager.menus.widgets;
        widgets.addComponent("root",{
            icon: "flexly-icon-box-component",
            title: "Main Menu",
            draggableSettings: {
                grid: mxBuilder.properties.gridSize,
                helper: function(event){
                    var theContent = mxBuilder.MenuComponent.prototype.template.clone()
                    .addClass("mx-helper")
                    .data("component","MenuComponent")
                    .appendTo(mxBuilder.layout.container);
                    return theContent;
                }
            }
        }); 
    
    });
}(jQuery));