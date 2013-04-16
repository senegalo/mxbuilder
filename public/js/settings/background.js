(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.background = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".flexly-component-background-settings").remove(),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            getPanel: function(settings) {
                var background = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(settings.expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Background Settings");

                var theInstance = this._template.clone();

                thePanel.find(".flexly-collapsable-content").append(theInstance);

                //fill in all the controls 
                var controls = {
                    opacitySlider: theInstance.find(".opacity-slider"),
                    patterns: theInstance.find(".patterns"),
                    picker: theInstance.find(".picker"),
                    scaleSlider: theInstance.find(".scale-slider"),
                    thePanel: thePanel,
                    patternsContainer: theInstance.find(".pattern-settings")
                };

                //Configure the controls here
                controls.picker.customColorpicker();
                controls.scaleSlider.customSlider({
                    min: 10,
                    max: 200,
                    step: 10,
                    suffix: "px"
                });
                controls.opacitySlider.customSlider({
                    min: 0,
                    max: 100,
                    value: 100,
                    suffix: "%"
                });

                controls.samples = $('<div class="pattern-sample pattern-image-none pattern-sample-0">No Pattern</div>')
                        .data("flexly-pattern-index", -1)
                        .appendTo(controls.patterns);
                for (var i = 0; i < 11; i++) {
                    controls.samples = controls.samples.add($('<div class="pattern-sample pattern-image pattern-sample-' + (i + 1) + '" style="background-position-y:-' + (i * 60) + 'px;"/>')
                            .data("flexly-pattern-index", i)
                            .appendTo(controls.patterns));
                }
                controls.patterns.jqueryScrollbar();
                thePanel.on({
                    panelOpen: function() {
                        controls.patterns.jqueryScrollbar("update");
                    }
                });
                if (settings.expand) {
                    thePanel.trigger("panelOpen");
                }

                this.applyToSelectionOn(controls, "picker", "pickerColorChanged", function(event, color) {
                    var sliderVal = controls.opacitySlider.customSlider("value");
                    if (sliderVal === 0) {
                        sliderVal = 100;
                        controls.opacitySlider.customSlider("value", 100);
                    }
                });
                this.applyToSelectionOn(controls, "picker", "pickerColorRest", function() {
                    controls.opacitySlider.customSlider("value", 0);
                });
                this.applyToSelectionOn(controls, "scaleSlider", "slide");
                this.applyToSelectionOn(controls, "opacitySlider", "slide");
                this.applyToSelectionOn(controls, "samples", "click", function() {
                    var element = $(this);
                    controls.patterns.data("change-monitor", true).data("current-selection", element.data("flexly-pattern-index"))
                    .find(".selected").removeClass("selected");
                    element.addClass("selected");
                });
                
                if(settings.hidePattern){
                    controls.patternsContainer.hide();
                }


                this._settingsTab.monitorChangeOnControls(controls);
                var originalSettings = {};

                //define component properties to add to the original settings object
                var properties = ["backgroundColor",
                    "backgroundImage",
                    "backgroundSize"];

                var firstPass = true;
                mxBuilder.selection.each(function() {
                    var theSettings = this.getBackground();
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
                        background.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        background.applyToSelection(controls);
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
                if (values.backgroundColor) {
                    var colorObj = mxBuilder.colorsManager.createColorObjFromRGBAString(values.backgroundColor);

                    //setting the color picker
                    controls.picker.customColorpicker("value", colorObj);

                    //setting the opacity slider
                    var opacity = Math.round(colorObj.a * 100);
                    controls.opacitySlider.customSlider("value", opacity);
                }
                if (values.backgroundSize) {
                    if (values.backgroundSize === "auto" || values.backgroundSize === "100% 100%") {
                        scale = 60;
                    } else {
                        var scale = values.backgroundSize.split(" ")[0].replace("%", "");
                        try {
                            scale = parseInt(scale);
                        } catch (e) {
                            scale = 60;
                        }
                    }
                    controls.scaleSlider.customSlider("value", scale);
                }
                if (values.backgroundImage) {
                    var matches = values.backgroundImage.match(/(\d*)(?=\.png)/im);
                    var match = matches === null ? "0" : matches[0];

                    controls.samples.filter(".pattern-sample-" + match).trigger("click");
                    
                    controls.patterns.data("current-selection",match);

                    controls.thePanel.on({
                        panelOpen: function() {
                            var match = controls.patterns.data("current-selection")+1;
                            var theSelected = controls.samples.filter(".pattern-sample-" + match).trigger("click");
                            controls.patterns.jqueryScrollbar("scrollTo", match * theSelected.outerHeight(), false);
                        }
                    });
                }
            },
            applyToSelection: function(controls, values) {
                if (typeof values === "undefined") {
                    //if no values passed how to do we get the values ?
                    values = {};

                    //Applying the background color
                    if (this._settingsTab.hasChanged(controls.picker) || this._settingsTab.hasChanged(controls.opacitySlider)) {
                        var backgroundColor = controls.picker.customColorpicker("value");
                        backgroundColor.a = controls.opacitySlider.customSlider("value") / 100;
                        values.backgroundColor = backgroundColor.toString();
                    }

                    //Applying the pattern
                    if (this._settingsTab.hasChanged(controls.patterns)) {
                        var pattern = controls.patterns.find(".selected");//.data("flexly-pattern-index");
                        if (pattern.length > 0 && pattern.data("flexly-pattern-index") !== -1) {
                            values.backgroundImage = 'url("public/images/patterns/pat' + (pattern.data("flexly-pattern-index") + 1) + '.png")';
                        } else {
                            values.backgroundImage = "none";
                        }
                    }

                    //Applying the size
                    if (this._settingsTab.hasChanged(controls.scaleSlider)) {
                        values.backgroundSize = controls.scaleSlider.customSlider("value");
                    }
                }
                mxBuilder.selection.each(function() {
                    //apply the values to the selection
                    this.setBackground(values);
                });
            },
            applyToSelectionOn: function(controls, controlKey, event, extra) {
                var background = this;
                controls[controlKey].on(event, function() {
                    background._settingsTab.setChanged(controls[controlKey]);
                    if (background._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        background.applyToSelection(controls);
                    }
                });
            }
        };
    });
}(jQuery));
