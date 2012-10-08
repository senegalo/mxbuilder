(function($){
    $(function(){
        var theWebsiteSelect = mxBuilder.layout.pagesSelect.on({
            change: function(){
                mxBuilder.pages.loadPage($(this).val());
            }
        });
        mxBuilder.pages = {
            __pages: {},
            __pinned: {},
            __currentPage: null,
            addPage: function addPage(properties){
                if(typeof properties.id == "undefined"){
                    var id = mxBuilder.utils.GUID();
                    properties.id = id;
                }
                
                properties.showInMenu = typeof properties.showInMenu == "undefined" ? true : properties.showInMenu;
                properties.parent = typeof properties.parent == "undefined" ? "root" : properties.parent;
                
                this.__pages[properties.id] = properties;
                this.__pages[properties.id].components = {};
                theWebsiteSelect.append('<option value="'+properties.id+'">'+properties.title+'</option>');
                this.loadPage(properties.id);
            },
            editPage: function editPage(newObj){
                var thePage = mxBuilder.pages.getPageObj(newObj.id);
                $.extend(thePage,newObj);
                
                theWebsiteSelect.find('option[value="'+newObj.id+'"]').text(newObj.title);
                $('title').text(newObj.title);
            },
            deletePage: function deletePage(id){
                id = id ? id : this.__currentPage;
                var theParent;
                if(this.__pages[id].parent != "root") {
                    theParent = this.__pages[id].parent;
                } else {
                    for(var p in this.__pages){
                        if(p == id){
                            continue;
                        }
                        theParent = p;
                        break;
                    }
                }
                
                if(id == this.__currentPage){
                    this.loadPage(theParent);
                }
                theWebsiteSelect.find('option[value="'+id+'"]').remove();
                
                for(p in this.__pages){
                    if(this.__pages[p].parent == id){
                        this.__pages[p].parent = theParent;
                    }
                }
                delete this.__pages[id];
            },
            getPageObj: function getPageObj(id){
                id = id ? id : this.__currentPage;
                return this.__pages[id];
            },
            getPages: function getPages(){
                var out = {};
                $.extend(out,this.__pages);
                return out;
            },
            getPageByAddress: function getPageByAddress(addr){
                for(var p in this.__pages){
                    if(this.__pages[p].address == addr){
                        return this.__pages[p];
                    }
                }
                return null;
            },
            getCurrentPageID: function getCurrentPageID(){
                return this.__currentPage;
            },
            loadPage: function loadPage(id){
                if(this.__pages[id]){
                    //caching the current page
                    var thisPage = this.__pages[this.__currentPage] ? this.__pages[this.__currentPage] : this.__pages[id];
                    for(var c in thisPage.components){
                        thisPage.components[c] = thisPage.components[c].save();
                    }
                    
                    //restoring the desired page
                    mxBuilder.selection.clearSelection();
                    
                    //get and clear the page component cache
                    var theComponentsToRestore = {};
                    for(var i in this.__pinned){
                        theComponentsToRestore[i] = this.__pinned[i].save();
                    }
                    $.extend(theComponentsToRestore,this.__pages[id].components);
                    this.__pages[id].components = {};
                    
                    this.__currentPage = id;
                    
                    mxBuilder.components.clearAndRestore(theComponentsToRestore);
                    mxBuilder.layout.revalidateLayout();
                    theWebsiteSelect.val(id);
                    $('title').html(this.__pages[id].htmlTitle);
                }
            },
            attachComponentToPage: function attachComponentToPage(component){
                //var pageID = component.page ? component.page : this.__currentPage;
                var pageID = this.__currentPage;
                component.page = pageID;
                this.__pages[pageID].components[component.getID()] = component;
            },
            detachComponentFromPage: function detachComponentFromPage(component){
                delete this.__pages[component.page].components[component.getID()];
            },
            pinComponent: function pinComponent(component){
                var componentID = component.getID();
                delete this.__pages[component.page].components[componentID];
                this.__pinned[componentID] = component;
            },
            unpinComponent: function unpinComponent(component){
                delete this.__pinned[component.getID()];
                //assigning it to this page
                this.attachComponentToPage(component);
            },
            getPageCount: function getPageCount(){
                return Object.keys(this.__pages).length;
            },
            removeImgComponentFromPages: function removeImgComponentFromPages(assetID){
                for(var p in this.__pages){
                    if(p == this.__currentPage){
                        continue;
                    }
                    for(var c in this.__pages[p].components){
                        if(this.__pages[p].components[c].data.extra.originalAssetID == assetID){
                            delete this.__pages[p].components[c];
                        }
                    }
                }
            }
        }
        
        $("#add-page").on({
            click: function(){
                mxBuilder.dialogs.pagesAddEditDialog.show();
            }
        });
        
        $("#edit-page").on({
            click: function(){
                mxBuilder.dialogs.pagesAddEditDialog.show(mxBuilder.pages.getPageObj());
            }
        });
        
        $("#delete-page").on({
            click: function(){
                if(mxBuilder.pages.getPageCount() < 2){
                    mxBuilder.dialogs.alertDialog.show("You can't delete all the pages of the website. At least one page should remain.");
                } else { 
                    mxBuilder.dialogs.deleteDialog({
                        msg: "Are you sure you want to delete this page !?",
                        title: "Invalid Operation",
                        callback: function callback(){
                            mxBuilder.pages.deletePage();
                        }
                    });
                }
            } 
        });
        
    });
}(jQuery))