(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.gplusButton = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".flexly-gplus-button-settings"),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            _controls: null,
            hasPicker: true,
            getPanel: function(expand) {
                var gplusButton = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Google Plus Button");

                var theInstance = this._template.clone();

                //fill in all the controls 
                this._controls = {
                    sizeSelect: theInstance.find('#gplus-size'),
                    annotation: theInstance.find(".gplus-annotation input"),
                    annotationNone: theInstance.find("#gplus-annotation-none"),
                    annotationHr: theInstance.find("#gplus-annotation-hr"),
                    annotationVr: theInstance.find("#gplus-annotation-vr")
                };


                //Configure the controls here
                this.applyToSelectionOn("sizeSelect", "change", function() {
                    if (gplusButton._controls.sizeSelect.val() !== "standard" && gplusButton._controls.annotationVr.is(":checked")) {
                        gplusButton._controls.annotationHr.attr("checked", "checked");
                    }
                });
                this.applyToSelectionOn("annotation", "change", function() {
                    if (gplusButton._controls.annotationVr.is(":checked")) {
                        gplusButton._controls.sizeSelect.val("standard");
                    }
                });

                this._settingsTab.monitorChangeOnControls(this._controls);
                var originalSettings = {};

                //define component properties to add to the original settings object
                var properties = ["size", "counterPosition"];

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
                        gplusButton.applyToSelection();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        gplusButton.applyToSelection();
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
                if (values.counterPosition !== false) {
                    this._controls.annotation.filter('[value="' + values.counterPosition + '"]').attr("checked", "checked");
                } else {
                    this._controls.annotation.removeAttr("checked");
                }
                if (values.size !== false) {
                    if (values.counterPosition === "vertical") {
                        values.size = "standard";
                    }
                    this._controls.sizeSelect.find('[value="' + values.size + '"]').attr("selected", "selected");
                } else {
                    this._controls.sizeSelect.removeAttr("checked")
                            .append('<option class="no-choice">---</option>').one({
                        change: function change() {
                            $(this).find(".not-choice").remove();
                        }
                    });
                }
            },
            getValues: function(all) {
                //if no values passed how to do we get the values ?
                values = {};
                var annotation = this._controls.annotation.filter(":checked").val();
                var size = this._controls.sizeSelect.val();

                if (all || this._settingsTab.hasChanged(this._controls.sizeSelect)) {
                    values.size = size;
                }
                if (all || this._settingsTab.hasChanged(this._controls.annotation)) {
                    values.counterPosition = annotation;
                }

                return {gplusButton: values};

            },
            applyToSelection: function(values) {
                if (typeof values === "undefined") {
                    values = this.getValues();
                }
                mxBuilder.selection.each(function() {
                    this.setSettings(values);
                });
            },
            applyToSelectionOn: function(controlKey, event, extra) {
                var gplusButton = this;
                this._controls[controlKey].on(event, function() {
                    gplusButton._settingsTab.setChanged(gplusButton._controls[controlKey]);
                    if (gplusButton._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        gplusButton.applyToSelection();
                    }
                });
            }
        };
    });
}(jQuery));