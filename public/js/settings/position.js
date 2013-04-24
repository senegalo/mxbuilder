(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.position = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".position-settings").remove(),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            _controls: null,
            hasPicker: true,
            getPanel: function(expand) {
                var position = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Position");

                var theInstance = this._template.clone();

                //fill in all the controls 
                this._controls = {
                    x: theInstance.find("#component-x-position"),
                    y: theInstance.find("#component-y-position"),
                    z: theInstance.find("#component-z-position"),
                    width: theInstance.find("#component-width"),
                    height: theInstance.find("#component-height"),
                    zIndexCategory: theInstance.find(".component-zindex"),
                    componentWidth: theInstance.find(".component-width"),
                    componentHeight: theInstance.find(".component-height"),
                    componentX: theInstance.find(".component-x"),
                    componentY: theInstance.find(".component-y")
                };

                //Configure the controls here
                this._controls.x.spinner({numberFormat: "n"});
                this._controls.y.spinner({numberFormat: "n"});
                this._controls.z.spinner({numberFormat: "n"});
                this._controls.width.spinner({numberFormat: "n"});
                this._controls.height.spinner({numberFormat: "n"});

                this.applyToSelectionOn("x", "spin");
                this.applyToSelectionOn("x", "input", this.validateInteger(this._controls.x));

                this.applyToSelectionOn("y", "spin");
                this.applyToSelectionOn("y", "input", this.validateInteger(this._controls.y));

                this.applyToSelectionOn("z", "spin");
                this.applyToSelectionOn("z", "input", this.validateInteger(this._controls.z));

                this.applyToSelectionOn("width", "spin");
                this.applyToSelectionOn("width", "input", this.validateInteger(this._controls.width));

                this.applyToSelectionOn("height", "spin");
                this.applyToSelectionOn("height", "input", this.validateInteger(this._controls.height));

                //refresh values on spinstop
                for (var c in this._controls) {
                    if (this._controls.hasOwnProperty(c)) {
                        switch (c) {
                            case "x":
                            case "y":
                            case "z":
                            case "width":
                            case "height":
                                this._controls[c].on({
                                    spinstop: position.refreshValues()
                                });
                                break;
                            default:
                                break;
                        }
                    }
                }

                //refresh on drag/resize and reorder if necaissairy
                if (mxBuilder.selection.getSelectionCount() === 1) {
                    mxBuilder.selection.each(function() {
                        this.element.off(".settings-event").on({
                            "drag.settings-event": position.refreshValues(),
                            "resize.settings-event": position.refreshValues(),
                            "zIndexChange.settings-event": position.refreshValues(),
                            "deselected.settings-event": function() {
                                $(this).off(".settings-event");
                            }
                        });
                    });
                }

                this._settingsTab.monitorChangeOnControls(this._controls);
                var originalSettings = this.readSelComponentsPos();

                this.setValues(originalSettings);

                thePanel.on({
                    previewEnabled: function() {
                        position.applyToSelection();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        position.applyToSelection();
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
            readSelComponentsPos: function() {
                //define component properties to add to the original settings object
                var position = this;
                var properties = ["x", "y", "z", "width", "height"];

                var firstPass = true;
                var widthBounds = {
                    max: 1000000000,
                    min: 0
                };
                var heightBounds = {
                    max: 1000000000,
                    min: 0
                };
                var out = {};
                mxBuilder.selection.each(function() {
                    var theSettings = this.getSettings();
                    for (var p = 0, cnt = properties.length; p < cnt; p++) {
                        if (firstPass) {
                            out[properties[p]] = theSettings[properties[p]];
                        }
                        var data = theSettings[properties[p]];

                        if (out[properties[p]] !== data) {
                            out[properties[p]] = false;
                        }
                    }

                    var cmpBounds = this.getWidthBounds();
                    if (cmpBounds.max < widthBounds.max) {
                        widthBounds.max = cmpBounds.max;
                    }
                    if (cmpBounds.min > widthBounds.min) {
                        widthBounds.min = cmpBounds.min;
                    }

                    cmpBounds = this.getHeightBounds();
                    if (cmpBounds.max < heightBounds.max) {
                        heightBounds.max = cmpBounds.max;
                    }
                    if (cmpBounds.min > heightBounds.min) {
                        heightBounds.min = cmpBounds.min;
                    }

                    position._controls.width.spinner("option", "min", widthBounds.min);
                    position._controls.width.spinner("option", "max", widthBounds.max);
                    position._controls.height.spinner("option", "min", heightBounds.min);
                    position._controls.height.spinner("option", "max", heightBounds.max);

                    if (typeof this.resizable === "undefined" || !this.resizable) {
                        out.width = null;
                        out.height = null;
                    } else if (this.resizable.orientation === "h") {
                        out.height = null;
                    } else if (this.resizable.orientation === "v") {
                        out.width = null;
                    }

                    if (typeof this.draggable === "undefined" || !this.draggable) {
                        out.x = null;
                        out.y = null;
                    } else if (this.draggable.axis === "y") {
                        out.x = null;
                    } else if (this.draggable.axis === "x") {
                        out.y = null;
                    }

                    firstPass = false;
                });
                return out;
            },
            setValues: function(values) {
                //implement the setValue function
                if (values.x === null) {
                    this._controls.componentX.addClass("disabled");
                    this._controls.x.spinner("disable");
                } else if (values.x !== false) {
                    this._controls.x.val(values.x);
                } else {
                    this._controls.x.val("");
                }

                if (values.y === null) {
                    this._controls.componentY.addClass("disabled");
                    this._controls.y.spinner("disable");
                } else if (values.y !== false) {
                    this._controls.y.val(values.y);
                } else {
                    this._controls.y.val('');
                }

                if (mxBuilder.selection.getSelectionCount() > 1) {
                    this._controls.zIndexCategory.addClass("disabled");
                    this._controls.z.spinner("disable");
                } else if (values.z !== false) {
                    this._controls.z.val(values.z);
                } else {
                    this._controls.z.val('');
                }

                if (values.width === null) {
                    this._controls.componentWidth.addClass("disabled");
                    this._controls.width.spinner("disable");
                } else if (values.width !== false) {
                    this._controls.width.val(values.width);
                } else {
                    this._controls.width.val('');
                }

                if (values.height === null) {
                    this._controls.componentHeight.addClass("disabled");
                    this._controls.height.spinner("disable");
                } else if (values.height !== false) {
                    this._controls.height.val(values.height);
                } else {
                    this._controls.height.val('');
                }

            },
            getValues: function(all, isPicker, sourceEvent, ui) {
                var values = {};
                if ((all || this._settingsTab.hasChanged(this._controls.x)) && !isPicker) {
                    values.x = this._controls.x.spinner("value");
                }
                if ((all || this._settingsTab.hasChanged(this._controls.y)) && !isPicker) {
                    values.y = this._controls.y.spinner("value");
                }
                if ((all || this._settingsTab.hasChanged(this._controls.z)) && !isPicker) {
                    if ($(sourceEvent.srcElement).parents(".ui-spinner:first").get(0) === this._controls.z.parent().get(0) && typeof ui !== "undefined") {
                        values.z = ui.value + 1000;
                    } else {
                        values.z = parseInt(this._controls.z.spinner("value"), 10) + 1000;
                    }
                }
                if (all || this._settingsTab.hasChanged(this._controls.width)) {
                    values.width = this._controls.width.spinner("value");
                }
                if (all || this._settingsTab.hasChanged(this._controls.height)) {
                    values.height = this._controls.height.spinner("value");
                }
                return {position: values};
            },
            applyToSelection: function(sourceEvent, ui) {
                var values = this.getValues(false,false, sourceEvent, ui);
                mxBuilder.selection.each(function() {
                    //apply the values to the selection
                    this.setSettings(values);
                    mxBuilder.selection.revalidateSelectionContainer();
                });
                this.setValues(this.readSelComponentsPos(this._controls));
            },
            applyToSelectionOn: function(controlKey, event, extra) {
                var position = this;
                this._controls[controlKey].on(event, function(event, ui) {
                    position._settingsTab.setChanged(position._controls[controlKey]);
                    if (position._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        position.applyToSelection(event, ui);
                    }
                });
            },
            validateInteger: function(control) {
                return function() {
                    var value = control.spinner("value");
                    if (value === null) {
                        control.spinner("value", 0);
                    }
                };
            },
            refreshValues: function() {
                var position = this;
                return function() {
                    position.setValues(position.readSelComponentsPos(position._controls));
                };
            }
        };
    });
}(jQuery));