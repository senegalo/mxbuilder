(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.imageOpacity = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".image-opacity-settings").remove(),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            getPanel: function(expand) {
                var imageOpacity = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Image Opacity");

                var theInstance = this._template.clone();
                
                thePanel.find(".flexly-collapsable-content").append(theInstance);

                //fill in all the controls 
                var controls = {
                    opacitySlider: theInstance.find(".opacity-slider")
                };


                //Configure the controls here
                controls.opacitySlider.customSlider({
                    min: 0,
                    max: 100,
                    value: 100,
                    suffix: "%"
                });
                this.applyToSelectionOn(controls, "opacitySlider", "slide");

                this._settingsTab.monitorChangeOnControls(controls);
                var originalSettings = {};

                //define component properties to add to the original settings object
                var properties = ["imageOpacity"];

                var firstPass = true;
                mxBuilder.selection.each(function() {
                    var theSettings = this.getSettings();
                    for (var p in properties) {
                        if (firstPass) {
                            originalSettings[properties[p]] = theSettings[properties[p]];
                        }
                        var data = theSettings[properties[p]];
                        if (originalSettings[properties[p]] !== data) {
                            originalSettings[properties[p]] = false;
                        }
                    }
                    firstPass = false;
                });

                this.setValues(controls, originalSettings);

                thePanel.on({
                    previewEnabled: function() {
                        imageOpacity.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        imageOpacity.applyToSelection(controls);
                        mxBuilder.menuManager.closeTab();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    previewDisabled: function() {
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    cancel: function() {
                        mxBuilder.selection.revalidateSelectionContainer();
                        mxBuilder.menuManager.closeTab();
                    }
                });
                return thePanel;
            },
            setValues: function(controls, values) {
                //implement the setValue function
                if (values.imageOpacity !== false) {
                    controls.opacitySlider.customSlider("value", Math.round(values.imageOpacity * 100));
                }
            },
            applyToSelection: function(controls, values) {
                if (typeof values === "undefined") {
                    //if no values passed how to do we get the values ?
                    values = {};
                    if (this._settingsTab.hasChanged(controls.opacitySlider)) {
                        //fill up the values array
                        values.imageOpacity = controls.opacitySlider.customSlider("value");
                    }
                }
                mxBuilder.selection.each(function() {
                    //apply the values to the selection
                    if (typeof values !== "undefined" && typeof values.imageOpacity !== "undefined") {
                        this.setImageOpacity(values.imageOpacity/100);
                    }
                });
            },
            applyToSelectionOn: function(controls, controlKey, event, extra) {
                var imageOpacity = this;
                controls[controlKey].on(event, function() {
                    imageOpacity._settingsTab.setChanged(controls[controlKey]);
                    if (imageOpacity._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        imageOpacity.applyToSelection(controls);
                    }
                });
            }
        };
    });
}(jQuery));