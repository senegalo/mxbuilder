(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.links = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".linkto").remove(),
            _settingsTab : mxBuilder.menuManager.menus.componentSettings,
            getPanel: function(settings){
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
                this.applyToSelectionOn(controls, "linkType", "change");
                this.applyToSelectionOn(controls, "newWindow", "change");
                this.applyToSelectionOn(controls, "pages", "change", function(){
                    controls.linktoPage.attr("checked","checked");
                });
                this.applyToSelectionOn(controls, "externalLinkText", "input");
                this.applyToSelectionOn(controls, "externalLinkProtocol", "change", function(){
                    controls.linktoExternal.attr("checked","checked").trigger("change");
                    controls.externalLinkText.focus();
                });
                
                controls.externalLinkText.on({
                    focus: function focus(){
                        controls.linktoExternal.attr("checked","checked");
                    }
                });
                
                controls.pages.append(mxBuilder.layout.utils.getOrderdPagesList());
                
                if(settings && settings.lightbox){
                    controls.lightboxContainer.show();
                } else {
                    controls.lightboxContainer.hide();
                }
                
                this._settingsTab.monitorChangeOnControls(controls);
                var originalSettings = {};
                
                //define component properties to add to the original settings object
                var properties = ["linkType","linkURL","linkProtocol","linkOpenIn"];
                
                var firstPass = true;
                mxBuilder.selection.each(function(){
                    var theSettings = this.getSettings();
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
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    cancel: function(){
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
            applyToSelection: function(controls,values){
                if(typeof values === "undefined"){
                    //if no values passed how to do we get the values ?
                    values = {};
                    if(this._settingsTab.hasChanged(controls.linkType)){
                        values.linkType = controls.linkType.filter(":checked").val();
                        if(values.linkType == "external"){
                            values.linkURL = controls.externalLinkText.val();
                            values.linkProtocol = controls.externalLinkProtocol.find("option:selected").val();
                        } else if (values.linkType == "page"){
                            values.linkURL = controls.pages.find("option:selected").val();
                        }
                    } else {
                        if(this._settingsTab.hasChanged(controls.newWindow)){
                            values.linkOpenIn = controls.newWindow.is(":checked")?true:false;
                        }
                        if(values.linkType == "external"){
                            if(this._settingsTab.hasChanged(controls.externalLinkText)){
                                values.linkURL = controls.externalLinkText.val();
                            }
                            if(this._settingsTab.hasChanged(controls.externalLinkProtocol)){
                                values.linkProtocol = controls.externalLinkProtocol.find("option:selected").val();
                            }
                        } else if (values.linkType == "page" && this._settingsTab.hasChanged(controls.pages)){
                            values.linkURL = controls.pages.find("option:selected").val();
                        }  
                    }
                }
                
                mxBuilder.selection.each(function(){
                    //apply the values to the selection
                    $.extend(this.linkObj,values);
                });
            },
            applyToSelectionOn: function(controls,controlKey,event,extra){
                var links = this;
                controls[controlKey].on(event,function(){
                    links._settingsTab.setChanged(controls[controlKey]);
                    if(links._settingsTab.isPreview()){
                        if(typeof extra != "undefined"){
                            extra.apply(this,arguments);
                        }
                        links.applyToSelection(controls);
                    }
                });
            }
        }
    });
}(jQuery))