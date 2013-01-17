(function($){
    $(function(){
        var listTemplate = mxBuilder.layout.templates.find(".flexly-menu-pages-list").remove();
        var listElementTemplate = listTemplate.find("li").remove();
        
        mxBuilder.menuManager.menus.pages = {
            init: function init(){
                mxBuilder.menuManager.tabTitle.text("Pages");
                
                var pages = mxBuilder.pages.getOrderedPages();
                var rendered = {};
                var theChildLists = $();
                var theList = listTemplate.clone();
                
                for(var p in pages){
                    if(typeof rendered[pages[p].id] == "undefined"){
                        //not a root page... 
                        if(pages[p].parent != "root"){
                            //checking if we created the parent page <li> element if not create it
                            if(typeof rendered[pages[p].parent] == "undefined"){
                                var parentPageObj = mxBuilder.pages.getPageObj(pages[p].parent);
                                rendered[pages[p].parent] = this.createPageElement(parentPageObj).appendTo(theList);
                                theChildLists = theChildLists.add(rendered[pages[p].parent].find("ul.flexly-menu-pages-list-child"));
                            }
                            var theChildUL = rendered[pages[p].parent].find("ul.flexly-menu-pages-list-child");
                            rendered[pages[p].parent].addClass("has-childs");
                            rendered[pages[p].id] = this.createPageElement(pages[p],true).appendTo(theChildUL);
                        } else {
                            rendered[pages[p].id] = this.createPageElement(pages[p]).appendTo(theList);
                        }
                        theChildLists = theChildLists.add(rendered[pages[p].id].find("ul.flexly-menu-pages-list-child"));
                    }
                }
                
                var sortableCallback = function(event,ui){
                    var iterator = 0;
                    theList.find("li").each(function(){
                        var element = $(this);
                        var parentUl = element.parents(".flexly-menu-pages-list:first");
                        var pageID = element.data("pageID");
                        
                        mxBuilder.pages.switchParent(pageID, parentUl.hasClass("flexly-menu-pages-list-child") ? parentUl.parents("li:first").data("pageID") : "root");
                        mxBuilder.pages.setPageOrder(pageID, iterator++);
                    });
                    mxBuilder.pages.rebuildActiveMenuComponents();
                    mxBuilder.menuManager.revalidateScrollbar("pages");
                };
                
                theList.sortable({
                    connectWith: ".flexly-menu-pages-list",
                    items: "li:not(.flexly-menu-pages-homepage)",
                    start: function(event,ui){
                        if(ui.item.hasClass("has-childs")){
                            theList.sortable("option","connectWith",false);
                            theList.sortable("refresh");
                        }
                    },
                    stop: sortableCallback
                });
                
                theChildLists.sortable({
                    connectWith: '.flexly-menu-pages-list',
                    stop: sortableCallback
                })
                
                
                delete rendered;
                mxBuilder.menuManager.contentTab.append(theList);
                
                //add the add page button to the header button
                $('<div class="flexly-icon-add-page flexly-icon"/>').on({
                    click: function(){
                        mxBuilder.menuManager.showTab("pagesAddEdit");
                    }
                }).appendTo(mxBuilder.menuManager.tabButtonsMain);
                
            },
            createPageElement: function createPageElement(page,noChildListFlag){
                var element = listElementTemplate.clone()
                .find(".flexly-menu-page-title")
                .text(page.title)
                .end()
                .find(".flexly-goto-page").on({
                    click: function(){
                        mxBuilder.pages.loadPage(page.id);
                        $(".flexly-menu-pages-list-current").removeClass("flexly-menu-pages-list-current");
                        $(this).parents("li:first").addClass("flexly-menu-pages-list-current");
                    }
                })
                .end()
                .find(".flexly-edit-page").on({
                    click: function(){
                        mxBuilder.menuManager.showTab("pagesAddEdit",page);
                    }
                })
                .end()
                .find(".flexly-delete-page").on({
                    click: function(){
                        if(mxBuilder.pages.getPageCount() < 2){
                            mxBuilder.dialogs.alertDialog.show("You can't delete all the pages of the website. At least one page should remain.");
                        } else { 
                            mxBuilder.dialogs.deleteDialog({
                                msg: "Are you sure you want to delete this page !?",
                                title: "Delete Page",
                                callback: function callback(){
                                    mxBuilder.pages.deletePage(page.id);
                                    mxBuilder.menuManager.showTab("pages");
                                }
                            });
                        }
                    }
                })
                .end()
                .data("pageID",page.id).on({
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
                
                if(page.homepage){
                    element.addClass("flexly-menu-pages-homepage");
                }
                
                if(!noChildListFlag){
                    listTemplate.clone().addClass("flexly-menu-pages-list-child").appendTo(element);
                }
                
                return element;
            }
        }
    });
}(jQuery))