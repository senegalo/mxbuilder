(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.imageGrid = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".image-grid-settings").remove(),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            _controls: null,
            hasPicker: true,
            getPanel: function(expand) {
                var imageGrid = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Grid Gallery Settings");

                var theInstance = this._template.clone();

                //fill in all the controls 
                this._controls = {
                    columns: theInstance.find("#image-grid-columns"),
                    spacing: theInstance.find("#image-grid-spacing")
                };


                //Configure the controls here
                this.applyToSelectionOn("columns", "input");
                this.applyToSelectionOn("spacing", "input");

                this._settingsTab.monitorChangeOnControls(this._controls);
                var originalSettings = {};

                //define component properties to add to the original settings object
                var properties = ["spacing", "cols"];

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

                this.setValues(originalSettings);

                thePanel.on({
                    previewEnabled: function() {
                        imageGrid.applyToSelection();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        imageGrid.applyToSelection();
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
                if (values.cols !== false) {
                    this._controls.columns.val(values.cols);
                } else {
                    this._controls.columns.val('');
                }

                if (values.spacing !== false) {
                    this._controls.spacing.val(values.spacing);
                } else {
                    this._controls.spacing.val('');
                }
            },
            getValues: function(all, isPicker, sourceEvent, ui) {
                var values = {};

                if (all || this._settingsTab.hasChanged(this._controls.columns)) {
                    //fill up the values array
                    values.cols = this._controls.columns.val();
                }
                if (all || this._settingsTab.hasChanged(this._controls.spacing)) {
                    values.spacing = this._controls.spacing.val();
                }

                return {imageGrid: values};
            },
            applyToSelection: function(values) {
                if (typeof values === "undefined") {
                    //if no values passed how to do we get the values ?
                    values = this.getValues();
                }
                mxBuilder.selection.each(function() {
                    //apply the values to the selection
                    this.setSettings(values);
                });
            },
            applyToSelectionOn: function(controlKey, event, extra) {
                var imageGrid = this;
                this._controls[controlKey].on(event, function() {
                    imageGrid._settingsTab.setChanged(imageGrid._controls[controlKey]);
                    if (imageGrid._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        imageGrid.applyToSelection();
                    }
                });
            }
        };
    });
}(jQuery));