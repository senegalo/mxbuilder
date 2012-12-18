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
                
                //creating the panel
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel();
                thePanel.find(".flexly-collapsable-title")
                .text("Background")
                .end();
                
                //cloning the template and updating the object properties
                this._currentInstance = this._template.clone();
                this.updateInstanceVariables();
                
                //initiating the color picker
                this._picker.customColorpicker();
                
                //building the scale slider
                this._scaleSlider.customSlider({
                    min:1,
                    max:10,
                    slide: function slide(event, ui){
                        backgroundSettings._scaleValue.text((ui.value*100)+"%");
                    }
                });
                
                //building the opacity slider
                this._currentInstance.find(".opacity-slider").customSlider({
                    min: 0,
                    max: 100,
                    value: 100,
                    slide: function slide(event,ui){
                        backgroundSettings._opacityValue.text(ui.value+"%");
                    }
                });
                
                //populating the panel list
                for(var i=0;i<11;i++){
                    this._patterns.append('<option class="pattern-sample" style="background-position-y:'+(i*60)+'px;">&nbsp;</option>');
                }
                
                //hooking the update to the scrollbars when the panels are being opened
                thePanel.on({
                    panelOpen: function(){
                        //backgroundSettings._patterns.mCustomScrollbar("update");
                    }
                })
                
                //appending the cloned template to the panel
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