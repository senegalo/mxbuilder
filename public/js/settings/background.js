(function($){
    
    $(function(){
        mxBuilder.menuManager.menus.componentSettings._settings.background = {
            _template: mxBuilder.layout.templates.find(".flexly-component-background-settings").remove(),
            _currentInstance: null,
            _picker: null,
            _patterns: null,
            _scaleValue: null,
            _scaleSlider: null,
            _opacityValue: null,
            _opacitySlider: null,
            getPanel: function(){
                var backgroundSettings = this;
                
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel();
                thePanel.find(".flexly-collapsable-title")
                .text("Background")
                .end();
                
                this._currentInstance = this._template.clone();
                this.updateInstanceVariables();
                
                this._picker.customColorpicker();
                
                this._scaleSlider.customSlider({
                    min:1,
                    max:10,
                    slide: function slide(event, ui){
                        backgroundSettings._scaleValue.text((ui.value*100)+"%");
                    }
                });
                
                this._currentInstance.find(".opacity-slider").customSlider({
                    min: 0,
                    max: 100,
                    value: 100,
                    slide: function slide(event,ui){
                        backgroundSettings._opacityValue.text(ui.value+"%");
                    }
                });
                
                
                thePanel.find(".flexly-collapsable-content")
                .append(this._currentInstance);
                
                return thePanel;
            },
            updateInstanceVariables: function() {
                this._opacitySlider = this._currentInstance.find(".opacity-slider");
                this._opacityValue = this._currentInstance.find(".opacity-value");
                this._patterns = this._currentInstance.find(".patterns");
                this._picker = this._currentInstance.find(".picker");
                this._scaleSlider = this._currentInstance.find(".scale-slider");
                this._scaleValue = this._currentInstance.find(".scale-value");
            }
        }
    });
    
}(jQuery));