(function($){
    $(function(){
        mxBuilder.pages = {
            __pages: {},
            __pinned: {},
            __currentPage: null,
            __addressesHash: {},
            __homepage: null,
            __maxOrder: 1,
            addPage: function(properties, noLoadFlag){
                if(typeof properties.id == "undefined"){
                    var id = mxBuilder.utils.GUID();
                    properties.id = id;
                }
                properties.showInMenu = typeof properties.showInMenu == "undefined" ? true : properties.showInMenu;
                properties.parent = typeof properties.parent == "undefined" ? "root" : properties.parent;
                if(typeof properties.order != "undefined" && properties.order > this.__maxOrder){
                    this.__maxOrder = properties.order+1;
                } else if(typeof properties.order == "undefined"){
                    properties.order = this.__maxOrder++;
                }
                
                
                var pageAddress = properties.address;
                delete properties.address;
                
                this.__pages[properties.id] = properties;
                this.setPageAddress(properties.id, pageAddress);
                this.__pages[properties.id].contentHeight = this.__pages[properties.id].contentHeight ? this.__pages[properties.id].contentHeight : 500;
                this.__pages[properties.id].components = {};
                
                if(noLoadFlag !== true){
                    this.loadPage(properties.id);
                }
                if(properties.homepage === true){
                    this.setHomepage(properties.id);
                }
                mxBuilder.recorder.forceSave();
                this.rebuildActiveMenuComponents();
                return this.__pages[properties.id];
            },
            setHomepage: function(id){
                var oldHomepage = this.__pages[this.__homepage];
                if(oldHomepage){
                    delete oldHomepage.homepage;
                }
                var pages = this.getOrderedPages();
                for(var p in pages){
                    pages[p].order = pages[p].order+1;
                }
                this.__pages[id].order = 0;
                this.__homepage = id;
                this.__pages[id].homepage = true;
            },
            editPage: function(newObj){
                var thePage = mxBuilder.pages.getPageObj(newObj.id);
                
                var address = newObj.address;
                delete newObj.address;
                
                $.extend(thePage,newObj);
                
                this.setPageAddress(newObj.id, address);
                
                $('title').text(newObj.htmlTitle);
                if(newObj.homepage){
                    this.setHomepage(newObj.id);
                }
                this.rebuildActiveMenuComponents();
            },
            switchParent: function(pageID,newParentID){
                this.__pages[pageID].parent = newParentID;
            },
            setPageOrder: function(pageID,order){
                this.__pages[pageID].order = order;
            },
            rebuildActiveMenuComponents: function(){
                var components = mxBuilder.components.getComponentsByType("MenuComponent");
                for(var c in components){
                    components[c].rebuild();
                }
            },
            deletePage: function(id){
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
                
                //if this is the current page load the parent of the first page
                if(id == this.__currentPage){
                    this.loadPage(theParent);
                }
                
                //if this is the homepage revert the home page to the parent of the homepage
                if(this.__pages[id].homepage){
                    this.setHomepage(theParent);
                }
                
                //check if the page is linked in any image or textbox in the pinned/current page components and remove the link
                var loopThroughActiveComponents = function loopThroughActiveComponents(components){
                    for(c in components){
                        if(components[c].type == "ImageComponent"){
                            var theLink = components[c].getLinkObj();
                            if(theLink && theLink.type == "page" && theLink.pageID == id){
                                components[c].setLinkObj(null);
                            }
                        } else if(components[c].type == "TextComponent"){
                            components[c].cleanDeadLinks(id);
                        }
                    }
                }
                
                for(p in this.__pages){
                    if(this.__pages[p].parent == id){
                        this.__pages[p].parent = theParent;
                    }
                    //check if the page is linked in any image or textbox in the pages components and remove the link
                    if(this.__pages[p].id != id){
                        if(this.__pages[p].id != this.__currentPage){
                            for(var c in this.__pages[p].components){
                                var currentComponent = this.__pages[p].components[c];
                                if(currentComponent.data.type == "ImageComponent" || currentComponent.type == "TextComponent"){
                                    mxBuilder[currentComponent.data.type].prototype.cleanDeadLinksFromSaveObj(currentComponent,id);
                                }
                            }
                        } else {
                            loopThroughActiveComponents(this.__pages[p].components);
                        }
                    }
                }
                
                loopThroughActiveComponents(this.__pinned);
                
                delete this.__pages[id];
            },
            getPageObj: function(id){
                id = id ? id : this.__currentPage;
                return this.__pages[id];
            },
            getPages: function(){
                var out = {};
                $.extend(out,this.__pages);
                return out;
            },
            getOrderedPages: function(){
                var pages = this.getPages();
                var out = [];
                var insertSort = function insertSort(obj){
                    if(out.length == 0 || obj.order >= out[out.length-1].order){
                        out.push(obj);
                    } else if(obj.order <= out[0].order){
                        out.splice(0,0,obj);
                    } else {
                        for(var p in out){
                            if(out[p].order >= obj.order){
                                out.splice(p,0,obj);
                                return;
                            }
                        }
                    }
                }
                for(var p in pages){
                    insertSort(pages[p]);
                }
                return out;
            },
            getPageByAddress: function(addr){
                for(var p in this.__pages){
                    if(this.__pages[p].address == addr){
                        return this.__pages[p];
                    }
                }
                return null;
            },
            getCurrentPageID: function(){
                return this.__currentPage;
            },
            isCurrentPage: function(id){
                return this.__currentPage == id;
            },
            getPageComponents: function(id){
                id = id ? id : this.__currentPage;
                var theComponentsToRestore = {};
                for(var i in this.__pinned){
                    theComponentsToRestore[i] = this.__pinned[i];
                }
                $.extend(theComponentsToRestore,this.__pages[id].components);
                return theComponentsToRestore;
            },
            loadPage: function(id){
                if(this.__pages[id] && id != this.__currentPage){
                    //Saving if necaissairy
                    mxBuilder.recorder.saveIfRequired();
                    
                    //caching the current page
                    if(this.__currentPage){
                        var thisPage = this.__pages[this.__currentPage] ? this.__pages[this.__currentPage] : this.__pages[id];
                        for(var c in thisPage.components){
                            thisPage.components[c] = thisPage.components[c].save();
                        }
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
                    
                    mxBuilder.layout.setLayout({
                        body: mxBuilder.pages.getContentHeight()
                    });
                    
                    mxBuilder.layout.revalidateLayout();
                    $('title').html(this.__pages[id].htmlTitle);
                    mxBuilder.recorder.setLastState(this.saveAll());
                }
            },
            attachComponentToPage: function(component){
                //var pageID = component.page ? component.page : this.__currentPage;
                var pageID = this.__currentPage;
                component.page = pageID;
                this.__pages[pageID].components[component.getID()] = component;
            },
            detachComponentFromPage: function(component){
                if(this.__pages[component.page]){
                    delete this.__pages[component.page].components[component.getID()];
                }
            },
            pinComponent: function(component){
                var componentID = component.getID();
                delete this.__pages[component.page].components[componentID];
                this.__pinned[componentID] = component;
            },
            unpinComponent: function(component){
                if(this.__pinned[component.getID()]){
                    delete this.__pinned[component.getID()];
                    //assigning it to this page
                    this.attachComponentToPage(component);
                }
            },
            getPageCount: function(){
                return Object.keys(this.__pages).length;
            },
            removeImgComponentFromPages: function(assetID){
                for(var p in this.__pages){
                    if(p == this.__currentPage){
                        continue;
                    }
                    for(var c in this.__pages[p].components){
                        if(this.__pages[p].components[c].data.extra && this.__pages[p].components[c].data.extra.originalAssetID == assetID){
                            delete this.__pages[p].components[c];
                        }
                    }
                }
            },
            saveAll: function(){
                var out = {
                    pages: [],
                    pinned: [],
                    layoutHeights: {
                        header: mxBuilder.layout.header.height(),
                        footer: mxBuilder.layout.footer.height()                   
                    },
                    layoutBackground: this.getLayoutBackground()
                };
                for(var p in this.__pages){
                    var copy = {};
                    $.extend(copy,this.__pages[p]);
                    //delete copy.id;
                    copy.components = [];
                    for(var c in this.__pages[p].components){
                        copy.components.push(p == this.__currentPage ? this.__pages[p].components[c].save() : this.__pages[p].components[c]);
                    }
                    out.pages.push(copy);
                }
                for(c in this.__pinned){
                    out.pinned.push(this.__pinned[c].save());
                }
                return out;
            },
            publishAll: function(){
                var out = {
                    pages: [],
                    assets: {},
                    layout: {
                        height: {
                            header: mxBuilder.layout.header.height(),
                            body: mxBuilder.layout.body.height(),
                            footer: mxBuilder.layout.footer.height()
                        },
                        background: this.getLayoutBackground()
                    }
                };
                
                //Adding the assets required for the background images
                var layoutParts = ["header","body","footer"];
                for(var c in layoutParts){
                    var assetID = out.layout.background[layoutParts[c]+"Image"];
                    if(!assetID){
                        continue;
                    }
                    if(!out.assets[assetID]){
                        out.assets[assetID] = [];
                    }
                    out.assets[assetID].push(mxBuilder.assets.getBiggestImageSize(assetID));
                    out.layout.background[layoutParts[c]+"Image"] = {
                        image: mxBuilder.assets.get(assetID)[mxBuilder.assets.getBiggestImageSize(assetID)],
                        ratio: mxBuilder.assets.get(assetID).ratio
                    }
                }
                
                var currentPage = this.__currentPage;
                for(var p in this.__pages){
                    var page = {};
                    if(p != this.__currentPage) {
                        this.loadPage(p);
                    }
                    var components = this.getPageComponents(p);
                    page.title = this.__pages[p].htmlTitle ? this.__pages[p].htmlTitle : "Untitled Page";
                    page.content_height = this.__pages[p].contentHeight;
                    page.head_includes = {
                        css: {},
                        scripts: {}
                    };
                    page.components = {
                        header: [],
                        body: [],
                        footer: []
                    };
                    for(var c in components){
                        if(components[c].type == "ImageComponent"){
                            assetID = components[c].getAssetID();
                            out.assets[assetID] = [components[c].getImageSize()];
                            var linkObj = components[c].getLinkObj();
                            if(linkObj && linkObj.type == "lightbox"){
                                out.assets[assetID].push(components[c].getClosestSize("full"));
                            }
                        } else if (components[c].type == "FormToMailComponent"){
                            out.hasForms = 1;
                        }
                        page.components[components[c].container].push(components[c].publish().get(0).outerHTML);
                        var headIncludes = components[c].getHeadIncludes();
                        $.extend(page.head_includes.css,headIncludes.css);
                        $.extend(page.head_includes.scripts,headIncludes.scripts);
                    }
                    page.address = this.__pages[p].homepage ? "index" : this.__pages[p].address;
                    out.pages.push(page);
                }
                
                this.loadPage(currentPage);
                return out;
            },
            restorePages: function(restore){                
                //mxBuilder.layout.setLayout(restore.layoutHeights,true);
                
                var firstPage = null;
                for(var p in restore.pages){
                    var components = restore.pages[p].components;
                    var newPage  = this.addPage(restore.pages[p],true);
                    
                    this.__currentPage = newPage.id;
                    
                    if(firstPage === null){
                        firstPage = newPage;
                    }
                    this.__pages[this.__currentPage].components = components;
                    
                }
                
                restore.layoutHeights.body = firstPage.contentHeight;
                mxBuilder.layout.setLayout(restore.layoutHeights,true);
                
                for(var c in restore.pinned){
                    mxBuilder.components.addComponent(restore.pinned[c]).pin();
                }
                
                if(restore.layoutBackground){
                    //colors
                    mxBuilder.layout.layoutHeader.css(restore.layoutBackground.header);
                    $(document.body).css(restore.layoutBackground.body);
                    mxBuilder.layout.layoutFooter.css(restore.layoutBackground.footer);
                    //images
                    var image;
                    var container = ["header","body","footer"];
                    for(c in container){
                        if(restore.layoutBackground[container[c]+"Image"]){
                            image = mxBuilder.assets.get(restore.layoutBackground[container[c]+"Image"]);
                            if(image){
                                mxBuilder.layout.setBackgroundImage(container[c], image);
                            }
                        }
                    }
                }
                this.__currentPage = null;
                this.loadPage(this.__homepage);
            },
            getContentHeight: function(pageID){
                pageID = pageID ? pageID : this.__currentPage;
                return this.__pages[pageID].contentHeight;
            },
            setContentHeight: function(height,pageID){
                pageID = pageID ? pageID : this.__currentPage;
                this.__pages[pageID].contentHeight = height;
            },
            setPageAddress: function(id,address){
                if(this.__pages[id].address != address && address != "index"){
                    if(this.__pages[id].address){
                        delete this.__addressesHash[this.__pages[id].address];
                    }
                    this.__pages[id].address = this.validateAddress(address);
                    this.__addressesHash[address] = true;
                }
            },
            validateAddress: function(address){
                address = address.replace(/[^a-zA-Z0-9_]/g,"").toLowerCase();
                var validAddress = address;
                var index = 0;
                while(!this.isValidAddress(validAddress)){
                    validAddress = address+"_"+(++index);
                }
                return validAddress;
            },
            isValidAddress: function(address,id){
                id = id ? id : this.__currentPage;
                return (address == "index" || (this.__addressesHash[address] && id && this.__pages[id].address != address)) ? false : true;
            },
            getLayoutBackground: function(){
                return {
                    header: mxBuilder.utils.getElementBackgroundObj(mxBuilder.layout.layoutHeader),
                    body: mxBuilder.utils.getElementBackgroundObj($(document.body)),
                    footer: mxBuilder.utils.getElementBackgroundObj(mxBuilder.layout.layoutFooter),
                    headerImage: mxBuilder.layout.getBackgroundImage("header").data("id"),
                    bodyImage: mxBuilder.layout.getBackgroundImage("body").data("id"),
                    footerImage: mxBuilder.layout.getBackgroundImage("footer").data("id")
                }
            }
        }        
    });
}(jQuery))