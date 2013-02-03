(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.links = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".linkto").remove(),
            getPanel: function(settings){
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                var links = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(settings&&settings.expand?settings.expand:false);
                
                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Link To");
                
                var theInstance = this._template.clone();
                
                //fill in all the controls 
                var controls = {
                    linkType: theInstance.find('.link-type'),
                    newWindow: theInstance.find('#linkto-new-window'),
                    pages: theInstance.find("#linkto-pages"),
                    externalLinkText: theInstance.find("#linkto-external-link"),
                    externalLinkProtocol: theInstance.find("#linkto-protocol"),
                    linktoExternal: theInstance.find("#linkto-external"),
                    linktoPage: theInstance.find("#linkto-page"),
                    linktoLightbox: theInstance.find("#linkto-lightbox"),
                    lightboxContainer: theInstance.find(".lightbox")
                };
                
                //Configure the controls here
                controls.linkType.radiobox().on({
                    change: function change(){
                        if(settingsTab.isPreview()){
                            mxBuilder.selection.each(function(){
                                links.applyToSelection(controls);
                            });
                        }
                    }
                });
                
                controls.newWindow.checkbox().on({
                    change: function change(){
                        if(settingsTab.isPreview()){
                            mxBuilder.selection.each(function(){
                                links.applyToSelection(controls);
                            });
                        }
                    }
                });
                
                if(settings && settings.lightbox){
                    controls.lightboxContainer.show();
                } else {
                    controls.lightboxContainer.hide();
                }
                
//                var pages = mxBuilder.pages.getOrderedPages();
//                for(var p in pages){
//                    var text = pages[p].parent == "root" ? pages[p].title : "---"+pages[p].title
//                    controls.pages.append('<option value="'+pages[p].id+'">'+text+'</option>');
//                }
                controls.pages.append(mxBuilder.layout.utils.getOrderdPagesList());
                controls.pages.on({
                    change: function change(){
                        controls.linktoPage.attr("checked","checked").trigger("change");
                        if(settingsTab.isPreview()){
                            mxBuilder.selection.each(function(){
                                links.applyToSelection(controls);
                            });
                        }
                    }
                });
                
                controls.externalLinkText.on({
                    focus: function focus(){
                        controls.linktoExternal.attr("checked","checked").trigger("change");
                    },
                    input: function input(){
                        if(settingsTab.isPreview()){
                            mxBuilder.selection.each(function(){
                                links.applyToSelection(controls);
                            });
                        }
                    }
                });
                controls.externalLinkProtocol.on({
                    change: function change(){
                        controls.linktoExternal.attr("checked","checked").trigger("change");
                        controls.externalLinkText.focus();
                        if(settingsTab.isPreview()){
                            mxBuilder.selection.each(function(){
                                links.applyToSelection(controls);
                            });
                        }
                    }
                });
                
                
                var originalSettings = {};
                
                //define component properties to add to the original settings object
                var properties = ["linkType","linkURL","linkProtocol","linkOpenIn"];
                
                var firstPass = true;
                mxBuilder.selection.each(function(){
                    var theSettings = this.getSettings().linkObj;
                    for(var p in properties){
                        if(firstPass){
                            originalSettings[properties[p]] = theSettings[properties[p]];
                        }
                        var data = theSettings[properties[p]];
                        if (originalSettings[properties[p]] !== data){
                            originalSettings[properties[p]] = false;
                        }
                    }
                    firstPass = false;
                });
                
                this.setValues(controls,originalSettings);
                
                thePanel.on({
                    previewEnabled: function(){
                        links.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function(){
                        links.applyToSelection(controls);
                        mxBuilder.menuManager.closeTab();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    previewDisabled: function(){
                        links.applyToSelection(controls,originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    cancel: function(){
                        links.applyToSelection(controls,originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                        mxBuilder.menuManager.closeTab();
                    }
                });                
                
                thePanel.find(".flexly-collapsable-content").append(theInstance);
                return thePanel;
            },
            setValues: function(controls, values){    
                //implement the setValue function
                if(values.linkType !== false){
                    controls.linkType.filter('input[value="'+values.linkType+'"]').attr("checked","checked").trigger("change");
                    
                    switch(values.linkType){
                        case "external":
                            controls.externalLinkText.val(values.linkURL !== false?values.linkURL:"");
                            if(values.linkProtocol !== false){
                                controls.externalLinkProtocol.find('option[value="'+values.linkProtocol+'"]').attr("selected","selected");
                            } else {
                                controls.externalLinkProtocol.prepend('<option value="none">-----</option>').one(function(){
                                    change: function change(){
                                        $(this).find('option[value="none"]').remove();
                                    }
                                });
                            }
                            break;
                        case "page":
                            controls.pages.find('option[value="'+values.linkURL+'"]').attr("selected","selected");
                            break;
                    }
                    
                } else {
                    controls.linkType.remoteAttr("checked").trigger("change");
                }
                
                if(values.linkOpenIn !== false){
                    controls.newWindow.attr("checked","checked").trigger("change");
                }                
            },
            applyToSelection: function applyToSelection(controls,values){
                if(typeof values === "undefined"){
                    //if no values passed how to do we get the values ?
                    values = {
                        linkType: controls.linkType.filter(":checked").val(),
                        linkOpenIn: controls.newWindow.is(":checked")?true:false
                    }
                    if(values.linkType == "external"){
                        values.linkURL = controls.externalLinkText.val();
                        values.linkProtocol = controls.externalLinkProtocol.find("option:selected").val();
                    } else if (values.linkType == "page"){
                        values.linkURL = controls.pages.find("option:selected").val()
                    }                    
                }
                mxBuilder.selection.each(function(){
                    //apply the values to the selection
                    this.linkObj = values;
                });
            }
        }
    });
}(jQuery))