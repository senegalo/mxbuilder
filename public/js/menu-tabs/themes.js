(function($){
    
    $(function(){
        mxBuilder.menuManager.menus.themes = {
            _template: mxBuilder.layout.templates.find(".themes-tab"),
            init: function(extra){
                
                mxBuilder.menuManager.hideTabButtons();
                mxBuilder.menuManager.tabFooterWrapper.height(66).show();
                mxBuilder.menuManager.tabTitle.text("Themes");
                
                var theContent = this._template.clone().appendTo(mxBuilder.menuManager.contentTab);
                
                //header background panel
                mxBuilder.layout.settingsPanels.layoutBackground.getPanel("header",extra?extra.header:false).appendTo(theContent);
                
                mxBuilder.layout.settingsPanels.layoutBackground.getPanel("body",extra?extra.body:false).appendTo(theContent);
                
                mxBuilder.layout.settingsPanels.layoutBackground.getPanel("footer",extra?extra.footer:false).appendTo(theContent);
                
                theContent.append('<div class="spacer"></div>').on({
                    panelOpen: function(){
                        mxBuilder.menuManager.revalidateScrollbar();
                    },
                    panelClose: function(){
                        mxBuilder.menuManager.revalidateScrollbar();
                    }
                });
            }
        }
    });
    
}(jQuery));