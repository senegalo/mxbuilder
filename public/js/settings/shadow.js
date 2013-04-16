(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.shadow = {
            //update the template variable
            _shadowTemplate: mxBuilder.layout.templates.find(".shadow-settings").find(".shadow-demo-box").remove(),
            _template: mxBuilder.layout.templates.find(".shadow-settings").remove(),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            _controls: null,
            hasPicker: true,
            getPanel: function(expand) {
                var shadow = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Shadow Settings");

                var theInstance = this._template.clone().appendTo(thePanel.find(".flexly-collapsable-content"));

                //fill in all the controls 
                this._controls = {
                    shadowContainer: theInstance.find(".shadow-container"),
                    shadowBoxes: $()
                };


                //Configure the controls here

                var noneShadow = this._shadowTemplate.clone().data({
                    id: "none"
                }).text("No Shadow").addClass("shadow-none").appendTo(this._controls.shadowContainer);

                this._controls.shadowBoxes = this._controls.shadowBoxes.add(noneShadow);

                mxBuilder.shadowManager.each(function() {
                    var shadowDemo = shadow._shadowTemplate.clone()
                            .addClass("shadow-" + this.id)
                            .data("id", this.id)
                            .appendTo(shadow._controls.shadowContainer);
                    mxBuilder.shadowManager.applyShadow({
                        id: this.id,
                        element: shadowDemo.find(".shadow")
                    });
                    shadow._controls.shadowBoxes = shadow._controls.shadowBoxes.add(shadowDemo);
                });

                this.applyToSelectionOn("shadowBoxes", "click", function() {
                    shadow._controls.shadowContainer.find(".selected").removeClass("selected");
                    $(this).addClass("selected");
                });
                this._controls.shadowContainer.jqueryScrollbar();

                thePanel.on({
                    panelOpen: function() {
                        shadow._controls.shadowContainer.jqueryScrollbar("update");
                    }
                });

                this._settingsTab.monitorChangeOnControls(this._controls);
                var originalSettings = {};

                //define component properties to add to the original settings object

                var firstPass = true;
                mxBuilder.selection.each(function() {
                    if (firstPass) {
                        originalSettings.shadowIndex = this.shadow;
                    }
                    if (originalSettings.shadowIndex !== this.shadow) {
                        originalSettings.shadowIndex = false;
                    }
                    firstPass = false;
                });

                this.setValues(originalSettings);

                thePanel.on({
                    previewEnabled: function() {
                        shadow.applyToSelection(shadow._controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        shadow.applyToSelection(shadow._controls);
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
                var klass;
                if (values.shadowIndex && values.shadowIndex !== "none") {
                    klass = ".shadow-" + values.shadowIndex;
                } else {
                    klass = ".shadow-none";
                }
                this._controls.shadowContainer.find(klass).addClass("selected");
            },
            getValues: function(all) {
                //if no values passed how to do we get the values ?
                var values = {};
                if (all || this._settingsTab.hasChanged(this._controls.shadowBoxes)) {
                    //fill up the values array
                    values.shadowIndex = this._controls.shadowContainer.find(".selected").data("id");
                }
                return { shadow: values };
            },
            applyToSelection: function(values) {
                values = this.getValues();
                mxBuilder.selection.each(function() {
                    //apply the values to the selection
                    this.setSettings(values);
                });
            },
            applyToSelectionOn: function(controlKey, event, extra) {
                var shadow = this;
                this._controls[controlKey].on(event, function() {
                    shadow._settingsTab.setChanged(shadow._controls[controlKey]);
                    if (shadow._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        shadow.applyToSelection();
                    }
                });
            }
        };
    });
}(jQuery));