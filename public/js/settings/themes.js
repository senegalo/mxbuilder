(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.themes = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".themes-settings").remove(),
            _settingsTab : mxBuilder.menuManager.menus.componentSettings,
            getPanel: function(expand){
                var themes = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Themes");
                
                var theInstance = this._template.clone();
                
                //fill in all the controls 
                var controls = {
                    themes: theInstance.find(".themes-switcher")
                };
                
                
                //Configure the controls here
                this.applyOn(controls,"themes","change");
                
               
                controls.originalTheme = $(document.body).data("theme");
                
                this.setValues(controls);
                
                thePanel.on({
                    previewEnabled: function(){
                        themes.apply(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function(){
                        themes.apply(controls);
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
            setValues: function(controls){    
                //implement the setValue function
                controls.themes.val(controls.originalTheme);
            },
            apply: function(controls){
                var theme = controls.themes.val();
                var body = $(document.body);
                body.removeClass(body.attr("data-theme")).attr("data-theme",theme).addClass(theme);
            },
            applyOn: function(controls,controlKey,event,extra){
                var themes = this;
                controls[controlKey].on(event,function(){
                    if(themes._settingsTab.isPreview()){
                        if(typeof extra !== "undefined"){
                            extra.apply(this,arguments);
                        }
                        themes.apply(controls);
                    }
                });
            }
        };
    });
}(jQuery));