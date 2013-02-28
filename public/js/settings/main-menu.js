(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.mainMenu = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".main-menu-settings"),
            _settingsTab : mxBuilder.menuManager.menus.componentSettings,
            getPanel: function(expand){
                var mainMenu = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Menu Settings");
                
                var theInstance = this._template.clone();
                
                //fill in all the controls 
                var controls = {
                    orientationSelectBox: theInstance.find(".main-menu-orientation"),
                    moreLinkText: theInstance.find(".more-link-text"),
                    themeSelectBox: theInstance.find(".main-menu-themes")
                };
                
                
                //Configure the controls here
                this.applyToSelectionOn(controls, "orientationSelectBox", "change");
                this.applyToSelectionOn(controls, "moreLinkText", "input");
                this.applyToSelectionOn(controls, "themeSelectBox", "change")
                
                this._settingsTab.monitorChangeOnControls(controls);
                var originalSettings = {};
                
                //define component properties to add to the original settings object
                var properties = ["orientation","moreLinkText","theme"];
                
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
                        mainMenu.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function(){
                        mainMenu.applyToSelection(controls);
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
                if(values.moreLinkText){
                    controls.moreLinkText.val(values.moreLinkText);
                } else {
                    controls.moreLinkText.val('');
                }
                
                if(values.orientation){
                    controls.orientationSelectBox.val(values.orientation);
                } else {
                    controls.orientationSelectBox.prepend('<option id="none-value" value="none" selected="selected">-------</option>')
                    .one({
                        change: function change(){
                            $(this).find("#none-value").remove();
                        }
                    });
                }
                
                if(values.theme){
                    controls.themeSelectBox.val(values.theme);
                } else {
                    controls.themeSelectBox.prepend('<option id="none-value" value="none" selected="selected">-------</option>')
                    .one({
                        change: function change(){
                            $(this).find("#none-value").remove();
                        }
                    });
                }
            },
            applyToSelection: function(controls,values){
                if(typeof values === "undefined"){
                    //if no values passed how to do we get the values ?
                    values = {};
                    if(this._settingsTab.hasChanged(controls.moreLinkText)){
                        values.moreLinkText = controls.moreLinkText.val();
                    }
                    if(this._settingsTab.hasChanged(controls.orientationSelectBox)){
                        values.orientation = controls.orientationSelectBox.val();
                    }
                    if(this._settingsTab.hasChanged(controls.themeSelectBox)){
                        values.theme = controls.themeSelectBox.val();
                    }
                }
                mxBuilder.selection.each(function(){
                    //apply the values to the selection
                    if(typeof values.orientation != "undefined"){
                        this.setOrientation(values.orientation);
                    }
                    if(typeof values.theme != "undefined"){
                        this.setTheme(values.theme);
                    }
                    if(typeof values.moreLinkText != "undefined"){
                        this.setMoreLink(values.moreLinkText);
                    }
                });
            },
            applyToSelectionOn: function(controls,controlKey,event,extra){
                var mainMenu = this;
                controls[controlKey].on(event,function(){
                    mainMenu._settingsTab.setChanged(controls[controlKey]);
                    if(mainMenu._settingsTab.isPreview()){
                        if(typeof extra != "undefined"){
                            extra.apply(this,arguments);
                        }
                        mainMenu.applyToSelection(controls);
                    }
                });
            }
        }
    });
}(jQuery))