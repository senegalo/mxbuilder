(function($){
    
    $(function(){
        mxBuilder.menuManager.menus.themes = {
            _template: mxBuilder.layout.templates.find(".themes-tab"),
            init: function(extra){
                
                mxBuilder.menuManager.hideTabButtons();
                mxBuilder.menuManager.tabFooterWrapper.height(66).show();
                mxBuilder.menuManager.tabTitle.text("Themes");
                
                var theContent = this._template.clone().appendTo(mxBuilder.menuManager.contentTab);
                
                //Background panels
                var containers = ["header","body","footer"];
                for(var c in containers){
                    var expand = extra?extra[containers[c]]:false;
                    var thePanel = mxBuilder.layout.settingsPanels.layoutBackground.getPanel(containers[c],expand);
                    //patching webkit bug: scrollTop reset on parent/zindex change
                    var thePanelContent = thePanel.find(".jquery-scrollbar-container");
                    if(thePanelContent.length > 0){
                        var scrollCache = thePanelContent.scrollTop();
                        theContent.append(thePanel);
                        thePanelContent.scrollTop(scrollCache);
                    } else {
                        theContent.append(thePanel);
                    }
                }
                
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