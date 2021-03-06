(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.position = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".position-settings").remove(),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            getPanel: function(expand) {
                var position = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Position");

                var theInstance = this._template.clone();

                //fill in all the controls 
                var controls = {
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
                controls.x.spinner({numberFormat: "n"});
                controls.y.spinner({numberFormat: "n"});
                controls.z.spinner({numberFormat: "n"});
                controls.width.spinner({numberFormat: "n"});
                controls.height.spinner({numberFormat: "n"});

                this.applyToSelectionOn(controls, "x", "spin");
                this.applyToSelectionOn(controls, "x", "input", this.validateInteger(controls.x));

                this.applyToSelectionOn(controls, "y", "spin");
                this.applyToSelectionOn(controls, "y", "input", this.validateInteger(controls.y));

                this.applyToSelectionOn(controls, "z", "spin");
                this.applyToSelectionOn(controls, "z", "input", this.validateInteger(controls.z));

                this.applyToSelectionOn(controls, "width", "spin");
                this.applyToSelectionOn(controls, "width", "input", this.validateInteger(controls.width));

                this.applyToSelectionOn(controls, "height", "spin");
                this.applyToSelectionOn(controls, "height", "input", this.validateInteger(controls.height));

                //refresh values on spinstop
                for (var c in controls) {
                    if (controls.hasOwnProperty(c)) {
                        switch (c) {
                            case "x":
                            case "y":
                            case "z":
                            case "width":
                            case "height":
                                controls[c].on({
                                    spinstop: position.refreshValues(controls)
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
                            "drag.settings-event": position.refreshValues(controls),
                            "resize.settings-event": position.refreshValues(controls),
                            "zIndexChange.settings-event": position.refreshValues(controls),
                            "deselected.settings-event": function() {
                                $(this).off(".settings-event");
                            }
                        });
                    });
                }

                this._settingsTab.monitorChangeOnControls(controls);
                var originalSettings = this.getCurrentValues(controls);

                this.setValues(controls, originalSettings);

                thePanel.on({
                    previewEnabled: function() {
                        position.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        position.applyToSelection(controls);
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
            getCurrentValues: function(controls) {
                //define component properties to add to the original settings object
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

                    controls.width.spinner("option", "min", widthBounds.min);
                    controls.width.spinner("option", "max", widthBounds.max);
                    controls.height.spinner("option", "min", heightBounds.min);
                    controls.height.spinner("option", "max", heightBounds.max);

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
            setValues: function(controls, values) {
                //implement the setValue function
                if (values.x === null) {
                    controls.componentX.addClass("disabled");
                    controls.x.spinner("disable");
                } else if (values.x !== false) {
                    controls.x.val(values.x);
                } else {
                    controls.x.val("");
                }

                if (values.y === null) {
                    controls.componentY.addClass("disabled");
                    controls.y.spinner("disable");
                } else if (values.y !== false) {
                    controls.y.val(values.y);
                } else {
                    controls.y.val('');
                }

                if (mxBuilder.selection.getSelectionCount() > 1) {
                    controls.zIndexCategory.addClass("disabled");
                    controls.z.spinner("disable");
                } else if (values.z !== false) {
                    controls.z.val(values.z);
                } else {
                    controls.z.val('');
                }

                if (values.width === null) {
                    controls.componentWidth.addClass("disabled");
                    controls.width.spinner("disable");
                } else if (values.width !== false) {
                    controls.width.val(values.width);
                } else {
                    controls.width.val('');
                }

                if (values.height === null) {
                    controls.componentHeight.addClass("disabled");
                    controls.height.spinner("disable");
                } else if (values.height !== false) {
                    controls.height.val(values.height);
                } else {
                    controls.height.val('');
                }

            },
            applyToSelection: function(controls, sourceEvent, ui) {
                var values = {};
                if (this._settingsTab.hasChanged(controls.x)) {
                    //fill up the values array
                    values.x = controls.x.spinner("value");
                }
                if (this._settingsTab.hasChanged(controls.y)) {
                    values.y = controls.y.spinner("value");
                }
                if (this._settingsTab.hasChanged(controls.z)) {
                    if ($(sourceEvent.srcElement).parents(".ui-spinner:first").get(0) === controls.z.parent().get(0) && typeof ui !== "undefined") {
                        values.z = ui.value+1000;
                    } else {
                        values.z = parseInt(controls.z.spinner("value"), 10) + 1000;
                    }
                }
                if (this._settingsTab.hasChanged(controls.width)) {
                    values.width = controls.width.spinner("value");
                }
                if (this._settingsTab.hasChanged(controls.height)) {
                    values.height = controls.height.spinner("value");
                }

                mxBuilder.selection.each(function() {
                    //apply the values to the selection
                    for (var v in values) {
                        var val = values[v];
                        switch (v) {
                            case "x":
                                this.setLeftPosition(val);
                                break;
                            case "y":
                                this.setTopPosition(val);
                                break;
                            case "z":
                                this.setZIndexTo(val);
                                break;
                            case "width":
                                this.setWidth(val);
                                break;
                            case "height":
                                this.setHeight(val);
                                break;
                        }
                    }
                    mxBuilder.selection.revalidateSelectionContainer();
                });
                this.setValues(controls, this.getCurrentValues(controls));
            },
            applyToSelectionOn: function(controls, controlKey, event, extra) {
                var position = this;
                controls[controlKey].on(event, function(event, ui) {
                    position._settingsTab.setChanged(controls[controlKey]);
                    if (position._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        position.applyToSelection(controls, event, ui);
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
            refreshValues: function(controls) {
                var position = this;
                return function() {
                    position.setValues(controls, position.getCurrentValues(controls));
                };
            }
        };
    });
}(jQuery));