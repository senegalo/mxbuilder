(function($){
    $(function(){
        var listTemplate = mxBuilder.layout.templates.find(".flexly-menu-pages-list").remove();
        var listElementTemplate = listTemplate.find("li").remove();
        
        var selectionManager = {
            __selection: {},
            select: function addToSelection(element){
                element.addClass("flexly-menu-pages-list-selected");
                this.__selection[element.data("pageID")] = element;
                mxBuilder.menuManager.revalidate();
            },
            deselect: function removeFromSelection(element,noRevalidation){
                element.removeClass("flexly-menu-pages-list-selected");
                delete this.__selection[element.data("pageID")];
                if(!noRevalidation){
                    mxBuilder.menuManager.revalidate();
                }
            },
            isSelected: function isSelected(element){
                return typeof this.__selection[element.data("pageID")] != "undefined" ? true : false;
            },
            clear: function clear(){
                this.each(function(){
                    selectionManager.deselect(this,true);
                });
                mxBuilder.menuManager.revalidate();
            },
            each: function each(callback){
                for(var e in this.__selection){
                    callback.call(this.__selection[e]);
                }
            }
        }
        
        mxBuilder.menuManager.menus.pages = {
            init: function init(contentTab){
                var pages = mxBuilder.pages.getPages();
                var rendered = {};
                var theList = listTemplate.clone();
                
                for(var p in pages){
                    if(typeof rendered[p] == "undefined"){
                        if(pages[p].parent != "root"){
                            if(typeof rendered[pages[p].parent] == "undefined"){
                                rendered[pages[p].parent] = this.createPageElement(pages[pages[p].parent]).appendTo(theList);
                            } 
                            var theChildUL = rendered[pages[p].parent].find("ul");
                            if(theChildUL.length == 0){
                                theChildUL = listTemplate.clone().addClass("flexly-menu-pages-list-child").appendTo(rendered[pages[p].parent]);
                            }
                            rendered[p] = this.createPageElement(pages[p]).appendTo(theChildUL);
                        } else {
                            rendered[p] = this.createPageElement(pages[p]).appendTo(theList);
                        }
                    }
                }
                delete rendered;
                contentTab.append(theList);
            },
            createPageElement: function createPageElement(page){
                var element = listElementTemplate.clone()
                .find(".flexly-menu-page-title")
                .text(page.title)
                .end()
                .find(".flexly-goto-page").on({
                    click: function(){
                        mxBuilder.pages.loadPage(page.id);
                        $(".flexly-menu-pages-list-current").removeClass("flexly-menu-pages-list-current");
                        $(this).parents("li").addClass("flexly-menu-pages-list-current");
                    }
                })
                .end()
                .data("pageID",page.id).on({
                    click: function(event){
                        var element = $(this);
                                
                        if(!event.ctrlKey){
                            selectionManager.clear();
                        }
                                
                        if(!selectionManager.isSelected(element)){
                            selectionManager.select(element);
                        }
                        return false;
                    },
                    mouseover: function(){
                        $(this).children(".flexly-menu-page-controls").show();
                        return false;
                    },
                    mouseout: function(){
                        $(this).children(".flexly-menu-page-controls").hide();
                        return false;
                    }
                });
                if(mxBuilder.pages.isCurrentPage(page.id)){
                    element.addClass("flexly-menu-pages-list-current");
                }
                
                return element;
            }
        }
    });
}(jQuery))