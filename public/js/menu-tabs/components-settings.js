(function($){
    
    $(function(){
        mxBuilder.menuManager.menus.componentSettings = {
            _template: mxBuilder.layout.templates.find(".flexly-menu-component-settings").remove(),
            _settings: {},
            _display: [],
            _enablePreview: true,
            init: function(expand){
                var componentSettings = this;
                mxBuilder.menuManager.hideTabButtons();
                mxBuilder.menuManager.tabFooterWrapper.height(66).show();
                mxBuilder.menuManager.tabTitle.text("Settings");
                
                var theContent = this._template.clone().appendTo(mxBuilder.menuManager.contentTab);
                
                var displaySettings = {
                    border: true,
                    background: true
                }
                
                mxBuilder.selection.each(function(){
                    displaySettings.border = displaySettings.border && this.editableBorder;
                    displaySettings.background = displaySettings.background && this.editableBackground;
                });
                
                if(displaySettings.border){
                    theContent.append(this._settings.border.getPanel(expand?expand.border:false));
                }
                    
                if(displaySettings.background){
                    var thePanel = this._settings.background.getPanel(expand?expand.background:false)
                    //patching webkit bug: scrollTop reset on parent/zindex change
                    var thePanelContent = thePanel.find(".jquery-scrollbar-container");
                    var scrollCache = thePanelContent.scrollTop();
                    theContent.append(thePanel);
                    thePanelContent.scrollTop(scrollCache);
                }
                
                theContent.append('<div class="spacer"></div>');
                
                //the cancel / savebutton 
                $('<div class="flexly-icon flexly-icon-cancel-big-black flexly-component-settings-cancel"/>').appendTo(mxBuilder.menuManager.tabFooter).on({
                    click: function(){
                        theContent.children().trigger("cancel");
                    }
                });
                $('<div class="flexly-icon flexly-icon-save-big-black flexly-component-settings-save"/>').appendTo(mxBuilder.menuManager.tabFooter).on({
                    click: function(){
                        theContent.children().trigger("save");
                    }
                });
                
                $('<div class="flexly-icon flexly-icon-preview-'+(this._enablePreview?"enabled":"disabled")+' flexly-component-settings-preview"/>').appendTo(mxBuilder.menuManager.tabFooter).on({
                    click: function(){
                        var element = $(this);
                        if(element.hasClass("flexly-icon-preview-disabled")){
                            element.removeClass("flexly-icon-preview-disabled").addClass("flexly-icon-preview-enabled");
                            componentSettings._enablePreview = true;
                            theContent.children().trigger("previewEnabled");
                        } else {
                            element.removeClass("flexly-icon-preview-enabled").addClass("flexly-icon-preview-disabled");
                            componentSettings._enablePreview = false;
                            theContent.children().trigger("previewDisabled");
                        }
                    }
                });
            },
            isPreview: function(){
                return this._enablePreview;
            }
        }
    });
    
}(jQuery));