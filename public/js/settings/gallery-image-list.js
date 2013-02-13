(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.galleryImageList = {
            //update the template variable
            _itemTemplate: mxBuilder.layout.templates.find(".gallery-image-settings .list-item").remove(),
            _template: mxBuilder.layout.templates.find(".gallery-image-settings").remove(),
            getPanel: function(expand){
                var galleryImageList = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Image List Settings");
                
                var theInstance = this._template.clone();
                
                thePanel.find(".flexly-collapsable-content").append(theInstance);
                
                //fill in all the controls 
                var controls = {
                    theInstance: theInstance,
                    listContainer: theInstance.find(".items-container")
                };
                
                
                //Configure the controls here
                
                var originalSettings = {};
                
                //define component properties to add to the original settings object                
                var firstPass = true;
                mxBuilder.selection.each(function(){
                    var theList = this.getImageList();
                    for(var i in theList){
                        if(firstPass){
                            originalSettings[i] = theList[i];
                        } else if (!originalSettings[i] || !this.isEqualSettings(originalSettings[i])){
                            originalSettings = false;
                            break;
                        }
                    }
                    firstPass = false;
                });
                
                this.setValues(controls,originalSettings);
                
                thePanel.on({
                    previewEnabled: function(){
                        galleryImageList.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function(){
                        galleryImageList.applyToSelection(controls);
                        mxBuilder.menuManager.closeTab();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    previewDisabled: function(){
                        galleryImageList.applyToSelection(controls,originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    cancel: function(){
                        galleryImageList.applyToSelection(controls,originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                        mxBuilder.menuManager.closeTab();
                    }
                });                
                return thePanel;
            },
            setValues: function(controls, list){    
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                var galleryImageList = this;
                
                controls.listContainer.empty();
                if(list == false){
                    controls.listContainer.append("<div><i><b>Lists in the selected galleries are different.</b></i></div>");
                } else {
                    var pagesOptions = mxBuilder.layout.utils.getOrderdPagesList();
                    for(var i in list){
                        var imgObj = mxBuilder.assets.get(list[i].id);
                        var headerBackground = imgObj[mxBuilder.imageUtils.getClosestImageSize(imgObj.id, "medium", false)];
                        var thePanel = mxBuilder.layout.utils.getCollapsablePanel(false,'')
                        .find('.flexly-collapsable-header').css({
                            backgroundImage: 'url('+imgObj.location+'/'+headerBackground+')',
                            backgroundSize: '100% auto',
                            backgroundRepeat: 'no-repeat',
                            height: 75
                        }).on({
                            mousedown: function mousedown(event){
                                var header = $(this);
                                if(event.which == 3){
                                    mxBuilder.contextmenu.getMainCtx().addItem({
                                        label: "Settings",
                                        callback: function(){
                                            header.trigger("click");
                                        }
                                    }).addItem({
                                        label: "Delete",
                                        callback: function(){
                                            header.parents(".flexly-collapsable-panel:first").remove();
                                            if(settingsTab.isPreview()){
                                                galleryImageList.applyToSelection(controls);
                                            }
                                        }
                                    }).stopPropagation();
                                }
                            }
                        }).end()
                        .find('.flexly-icon').hide().end()
                        .appendTo(controls.listContainer);
                        
                        var theItem = this._itemTemplate.clone();
                        
                        var alterID = ["gallery-settings-title","gallery-settings-caption","linkto-protocol","linkto-external","linkto-page","linkto-pages", "link-input", "linkto-none"]
                                                
                        for(var id in alterID){
                            var element = theItem.find("#"+alterID[id]);
                            var label = element.next('label');
                            element.attr("id",alterID[id]+"-"+imgObj.id);
                            
                            if(element.attr("type") == "radio"){
                                element.attr("name",element.attr("name")+"-"+imgObj.id);
                            }
                            
                            label.attr("for",alterID[id]+"-"+imgObj.id);
                        }
                        
                        theItem.find(".image-name")
                        .append(imgObj.name)
                        .end()
                        .find("#linkto-pages-"+imgObj.id)
                        .append(pagesOptions.clone())
                        .end();
                        
                        var title = theItem.find("#gallery-settings-title-"+imgObj.id).on({
                            change: function change(){
                                if(settingsTab.isPreview()){
                                    var check = $(this);
                                    var imgObj = mxBuilder.assets.get(check.parents(".list-item:first").data("imgID"));
                                    if(imgObj.title != ""){
                                        mxBuilder.selection.each(function(){
                                            this.toggleSlideTitle(imgObj,check.is(":checked"));
                                        });
                                    }
                                }
                            }
                        });
                        var caption = theItem.find("#gallery-settings-caption-"+imgObj.id).on({
                            change: function change(){
                                if(settingsTab.isPreview()){
                                    var check = $(this);
                                    var imgObj = mxBuilder.assets.get(check.parents(".list-item:first").data("imgID"));
                                    if(imgObj.caption != ""){
                                        mxBuilder.selection.each(function(){
                                            this.toggleSlideCaption(imgObj,check.is(":checked"));
                                        });
                                    }
                                }
                            }
                        });
                        
                        if(list[i].title){
                            title.attr("checked","checked");
                        }
                        
                        if(list[i].caption){
                            caption.attr("checked","checked");
                        }
                        
                        theItem.find(".link-type").on({
                            change: function change(){
                                if(settingsTab.isPreview){
                                    var item = $(this).parents(".list-item:first");
                                    var id = item.data("imgID");
                                    var link = galleryImageList.getLinkFromItem(item, id);
                                    mxBuilder.selection.each(function(){
                                        this.updateLink(id,link);
                                    });
                                }
                            }
                        });
                        
                        var linkProtocol = theItem.find("#linkto-protocol-"+imgObj.id).on({
                            change: function change(){
                                var item = $(this).parents(".list-item:first");
                                var id = item.data("imgID");
                                item.find("#linkto-external-"+id).attr("checked","checked");
                                
                                if(settingsTab.isPreview){
                                    var link = galleryImageList.getLinkFromItem(item, id);
                                    mxBuilder.selection.each(function(){
                                        this.updateLink(id,link);
                                    });
                                }
                            }
                        });
                        
                        var linkUrl = theItem.find("#link-input-"+imgObj.id).on({
                            input: function input(){
                                var item = $(this).parents(".list-item:first");
                                var id = item.data("imgID");
                                item.find("#linkto-external-"+id).attr("checked","checked");
                                
                                if(settingsTab.isPreview){
                                    var link = galleryImageList.getLinkFromItem(item, id);
                                    mxBuilder.selection.each(function(){
                                        this.updateLink(id,link);
                                    });
                                }
                            }
                        });
                        
                        var linkPage = theItem.find("#linkto-pages-"+imgObj.id).on({
                            change: function change(){
                                var item = $(this).parents(".list-item:first");
                                var id = item.data("imgID");
                                item.find("#linkto-page-"+id).attr("checked","checked");
                                
                                if(settingsTab.isPreview){
                                    var link = galleryImageList.getLinkFromItem(item, id);
                                    mxBuilder.selection.each(function(){
                                        this.updateLink(id,link);
                                    });
                                }
                            }
                        });
                        
                        if(list[i].link.type && list[i].link.type != "none"){
                            theItem.find("#linkto-"+list[i].link.type+"-"+imgObj.id).attr("checked","checked");
                            if(list[i].link.type == "external"){
                                linkProtocol.find('option[value="'+list[i].link.protocol+'"]')
                                .attr("selected","selected");
                                linkUrl.val(list[i].link.url);
                            } else {
                                linkPage.find('option[value="'+list[i].link.page+'"]').attr("selected","selected");
                            }
                        } else {
                            theItem.find("#linkto-none-"+imgObj.id).attr("checked","checked");
                        }
                        
                        theItem.appendTo(thePanel.find(".flexly-collapsable-content")).data("imgID",imgObj.id);
                    }
                    controls.listContainer.sortable({
                        stop: function stop(){
                            if(settingsTab.isPreview()){
                                galleryImageList.applyToSelection(controls);
                            }
                        }
                    });
                }
            },
            getLinkFromItem: function getLinkFromItem(item,id){
                var link = {
                    type: item.val()
                }
                if(link.type == "external"){
                    link.protocol = item.find("#linkto-protocol-"+id).val();
                    link.url = item.find("#link-input-"+id).val()
                } else if (link.type == "page"){
                    link.page = item.find("#linkto-pages-"+id).val();
                }
                return link;
            },
            applyToSelection: function applyToSelection(controls,values){
                if(typeof values === "undefined"){
                    var theList = []
                    controls.listContainer.find(".list-item").each(function(){
                        var theItem = $(this);
                        var imgID = theItem.data("imgID");
                        var theListObj = {
                            id: imgID,
                            caption: theItem.find("#gallery-settings-caption-"+imgID).is(":checked"),
                            title: theItem.find("#gallery-settings-title-"+imgID).is(":checked"),
                            link: {
                                type: theItem.find(".link-type:checked").val()
                            }
                        }
                        if(theListObj.link.type == "external"){
                            theListObj.link.protocol = theItem.find("#linkto-protocol-"+imgID).val();
                            theListObj.link.url = theItem.find("#link-input-"+imgID).val();
                        } else if(theListObj.link.type == "page"){
                            theListObj.link.page = theItem.find("#linkto-pages-"+imgID).val();
                        }
                        theList.push(theListObj);
                    });
                }
                mxBuilder.selection.each(function(){
                    //apply the values to the selection
                    this.setImageList(theList);
                    this.rebuild();
                    this.revalidate();
                });
            },
            applyToSelectionOn: function applyToSelectionOn(controls,controlKey,event,extra){
                var galleryImageList = this;
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                controls[controlKey].on(event,function(){
                    if(settingsTab.isPreview()){
                        if(typeof extra != "undefined"){
                            extra.call();
                        }
                        galleryImageList.applyToSelection(controls);
                    }
                });
            }
        }
    });
}(jQuery))