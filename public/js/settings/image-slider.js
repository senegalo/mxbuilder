(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.imageSlider = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".image-gallery-settings").remove(),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            _controls: null,
            hasPicker: true,
            getPanel: function(expand) {
                var imageSlider = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Gallery Settings");

                var theInstance = this._template.clone();

                //fill in all the controls 
                this._controls = {
                    autoPlay: theInstance.find(".gallery-autoplay input"),
                    transitionSpeed: theInstance.find(".gallery-transition input"),
                    indicator: theInstance.find(".gallery-timer-indicator input"),
                    action: theInstance.find(".gallery-action input"),
                    navigation: theInstance.find(".gallery-navigation input")
                };


                //Configure the controls here
                for (var c in this._controls) {
                    this.applyToSelectionOn(c, "change");
                }

                this._settingsTab.monitorChangeOnControls(this._controls);
                var originalSettings = {};

                //define component properties to add to the original settings object
                var properties = ["autoPlay", "transitionSpeed", "indicator", "action", "navigation"];

                var firstPass = true;
                mxBuilder.selection.each(function() {
                    var theSettings = this.getSettings();
                    for (var p in properties) {
                        if (firstPass) {
                            originalSettings[properties[p]] = theSettings[properties[p]];
                        }
                        var data = theSettings[properties[p]];
                        if (originalSettings[properties[p]] !== data) {
                            originalSettings[properties[p]] = null;
                        }
                    }
                    firstPass = false;
                });

                this.setValues(originalSettings);

                thePanel.on({
                    previewEnabled: function() {
                        imageSlider.applyToSelection();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        imageSlider.applyToSelection();
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

                thePanel.find(".flexly-collapsable-content").append(theInstance);
                return thePanel;
            },
            setValues: function(values) {
                //implement the setValue function
                if (values.autoPlay !== null) {
                    this._controls.autoPlay.filter('[value="' + (values.autoPlay ? "on" : "off") + '"]').attr("checked", "checked");
                } else {
                    this._controls.autoPlay.removeAttr("checked");
                }

                if (values.transitionSpeed !== null) {
                    this._controls.transitionSpeed.filter('[value="' + values.transitionSpeed + '"]').attr("checked", "checked");
                } else {
                    this._controls.transitionSpeed.removeAttr("checked");
                }

                if (values.indicator !== null) {
                    this._controls.indicator.filter('[value="' + (values.indicator ? "on" : "off") + '"]').attr("checked", "checked");
                } else {
                    this._controls.indicator.removeAttr("checked");
                }

                if (values.action !== null) {
                    this._controls.action.filter('[value="' + (values.action ? "on" : "off") + '"]').attr("checked", "checked");
                } else {
                    this._controls.action.removeAttr("checked");
                }

                if (values.navigation !== null) {
                    this._controls.navigation.filter('[value="' + values.navigation + '"]').attr("checked", "checked");
                } else {
                    this._controls.navigation.removeAttr("checked");
                }
            },
            getValues: function(all, isPicker, sourceEvent, ui) {
                var values = {};

                if (all || this._settingsTab.hasChanged(this._controls.autoPlay)) {
                    values.autoPlay = this._controls.autoPlay.filter(":checked").val() === "on" ? true : false;
                }
                if (all || this._settingsTab.hasChanged(this._controls.transitionSpeed)) {
                    values.transitionSpeed = this._controls.transitionSpeed.filter(":checked").val();
                }
                if (all || this._settingsTab.hasChanged(this._controls.indicator)) {
                    values.indicator = this._controls.indicator.filter(":checked").val() === "on" ? true : false;
                }
                if (all || this._settingsTab.hasChanged(this._controls.action)) {
                    values.action = this._controls.action.filter(":checked").val() === "on" ? true : false;
                }
                if (all || this._settingsTab.hasChanged(this._controls.navigation)) {
                    values.navigation = this._controls.navigation.filter(":checked").val();
                }
                return {imageSlider: values};
            },
            applyToSelection: function(values) {
                if (typeof values === "undefined") {
                    //if no values passed how to do we get the values ?
                    values = this.getValues();
                }
                mxBuilder.selection.each(function() {
                    this.setSettings(values);
                });
            },
            applyToSelectionOn: function(controlKey, event, extra) {
                var imageSlider = this;
                this._controls[controlKey].on(event, function() {
                    imageSlider._settingsTab.setChanged(imageSlider._controls[controlKey]);
                    if (imageSlider._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        imageSlider.applyToSelection();
                    }
                });
            }
        };
    });
}(jQuery));