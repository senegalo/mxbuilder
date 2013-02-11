(function($){
    
    $(function(){
        mxBuilder.menuManager.menus.photoSettings = {
            _template: mxBuilder.layout.templates.find(".photo-settings-tab"),
            init: function(assetID){
                mxBuilder.menuManager.hideTabButtons();
                mxBuilder.menuManager.tabFooterWrapper.height(66).show();
                mxBuilder.menuManager.tabTitle.text("Image Properties");
                
                var theContent = this._template.clone().appendTo(mxBuilder.menuManager.contentTab);
                
                mxBuilder.layout.settingsPanels.image.getPanel(assetID).appendTo(theContent);
                
                theContent.append('<div class="spacer"></div>').on({
                    panelOpen: function(){
                        mxBuilder.menuManager.revalidateScrollbar();
                    },
                    panelClose: function(){
                        mxBuilder.menuManager.revalidateScrollbar();
                    }
                });
                
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
            }
        }
    });
    
}(jQuery));