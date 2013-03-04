(function($){    
    $(function(){
        
        mxBuilder.menuManager.menus.settings = {
            _template: mxBuilder.layout.templates.find(".flexly-menu-settings-tab").remove(),
            _settings: {},
            _display: [],
            init: function(extra){
                var componentSettings = this;
                mxBuilder.menuManager.hideTabButtons();
                mxBuilder.menuManager.tabFooterWrapper.height(66).show();
                mxBuilder.menuManager.tabTitle.text("Settings");
                
                var theContent = this._template.clone().appendTo(mxBuilder.menuManager.contentTab);
                
                var displaySettings = [];
                
                //adding the grid panel
                displaySettings.push({
                    panel: mxBuilder.layout.globalSettingsPanels.snap,
                    params: true
                });
                
                for(var p in displaySettings){
                    var thePanel = displaySettings[p].panel.getPanel(displaySettings[p].params);
                        
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