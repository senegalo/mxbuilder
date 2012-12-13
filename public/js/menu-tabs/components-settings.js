(function($){
    
    $(function(){
        mxBuilder.menuManager.menus.componentSettings = {
            _template: mxBuilder.layout.templates.find(".flexly-menu-component-settings").remove(),
            _settings: {},
            _display: [],
            init: function(display){
                mxBuilder.menuManager.hideTabButtons();
                mxBuilder.menuManager.tabFooterWrapper.height(66).show();
                mxBuilder.menuManager.tabTitle.text("Settings");
                
                var theContent = this._template.clone()
                
                theContent.append(this._settings.border.getPanel());
                
                thePanel = mxBuilder.layout.utils.getCollapsablePanel();
                thePanel.find(".flexly-collapsable-title")
                .text("Background")
                .end()
                .find(".flexly-collapsable-content")
                .append(mxBuilder.layout.templates.find(".test").clone());
                
                theContent.append(thePanel);
                
                thePanel = mxBuilder.layout.utils.getCollapsablePanel();
                thePanel.find(".flexly-collapsable-title")
                .text("Defaults")
                .end()
                .find(".flexly-collapsable-content")
                .append(mxBuilder.layout.templates.find(".test").clone());
                
                theContent.append(thePanel);
                
                mxBuilder.menuManager.contentTab.append(theContent);
            }
        }
    });
    
}(jQuery));