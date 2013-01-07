(function($){
    
    $(function(){
        mxBuilder.layout.settingsPanels.mainMenu = {
            _template: mxBuilder.layout.templates.find(".main-menu-settings"),
            getPanel: function(expand){
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                var mainMenu = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand,"Menu Settings");
                
                
                var theInstance = this._template.clone();
                
                var orientationSelectBox = theInstance.find(".main-menu-orientation");
                var moreLinkText = theInstance.find(".more-link-text");
                var themeSelectBox = theInstance.find(".main-menu-themes");
                
                orientationSelectBox.on({
                    change: function change(){
                        var element = $(this);
                        if(settingsTab.isPreview()){
                            var selectedValue =  element.val();
                            mxBuilder.selection.each(function(){
                                this.setOrientation(selectedValue);
                            });
                        }
                        element.find("#none-value").remove();
                    }
                });
                
                themeSelectBox.on({
                    change: function change(){
                        var element = $(this);
                        if(settingsTab.isPreview()){
                            var selectedValue = element.val();
                            mxBuilder.selection.each(function(){
                                this.setTheme(selectedValue);
                            });
                        }
                        element.find("#none-value").remove();
                    }
                });
                
                moreLinkText.on({
                    input: function input(){
                        if(settingsTab.isPreview()){
                            var value = $(this).val();
                            mxBuilder.selection.each(function(){
                                this.setMoreLink(value);
                            });
                        }
                    }
                });
                
                var properties = ["orientation","moreLinkText","theme"];
                var firstPass = true;
                var originalSettings = {};
                mxBuilder.selection.each(function(){
                    var theSettings = this;
                    for(var p in properties){
                        if(firstPass){
                            originalSettings[properties[p]] =theSettings[properties[p]];
                        }
                        var data = theSettings[properties[p]];
                        if (originalSettings[properties[p]] !== data){
                            originalSettings[properties[p]] = false;
                        }
                    }
                    firstPass = false;
                });
                
                if(originalSettings.moreLinkText){
                    moreLinkText.val(originalSettings.moreLinkText);
                }
                
                if(originalSettings.orientation){
                    orientationSelectBox.val(originalSettings.orientation);
                } else {
                    orientationSelectBox.prepend('<option id="none-value" value="none" selected="selected">-------</option>');
                }
                
                if(originalSettings.theme){
                    themeSelectBox.val(originalSettings.theme);
                } else {
                    themeSelectBox.prepend('<option id="none-value" value="none" selected="selected">-------</option>');
                }
                
                thePanel.on({
                    previewEnabled: function previewEnabled(){
                        mainMenu.applyToSelection({
                            orientation: orientationSelectBox.val(),
                            moreLinkText: moreLinkText.val(),
                            theme: themeSelectBox.val()
                        });
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function save(){
                        mainMenu.applyToSelection({
                            orientation: orientationSelectBox.val(),
                            moreLinkText: moreLinkText.val(),
                            theme: themeSelectBox.val()
                        });
                        mxBuilder.menuManager.closeTab();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    previewDisabled: function previewDisabled(){
                        mainMenu.applyToSelection(originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    cancel: function cancel(){
                        mainMenu.applyToSelection(originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                        mxBuilder.menuManager.closeTab();
                    }
                });
                
                thePanel.find(".flexly-collapsable-content").append(theInstance);
                
                return thePanel;
            },
            applyToSelection: function applyToSelection(settings){
                if(typeof settings == "undefined"){
                    return;
                }
                mxBuilder.selection.each(function(){
                    this.setOrientation(settings.orientation);
                    this.setTheme(settings.theme);
                    this.setMoreLink(settings.moreLinkText);
                });
            }
        }
    });
    
}(jQuery));