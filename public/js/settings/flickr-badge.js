(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.flickrBadge = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".flickr-badge-settings").remove(),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            getPanel: function(expand) {
                var flickrBadge = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Flickr Badge");

                var theInstance = this._template.clone();

                //fill in all the controls 
                var controls = {
                    imgSize: theInstance.find(".flickr-badge-imgsize input"),
                    imgSizeSquare: theInstance.find("#flickr-badge-imgsize-s"),
                    imgSizeThumb: theInstance.find("#flickr-badge-imgsize-t"),
                    imgSizeMedium: theInstance.find("#flikr-badge-imgsize-m"),
                    user: theInstance.find("#flickr-badge-username"),
                    display: theInstance.find(".flickr-badge-display input"),
                    displayLatest: theInstance.find("#flickr-badge-display-latest"),
                    displayRandom: theInstance.find("#flickr-badge-display-random"),
                    count: theInstance.find(".flickr-badge-count select")
                };


                //Configure the controls here
                this.applyToSelectionOn(controls, "count", "change");
                this.applyToSelectionOn(controls, "imgSize", "change");
                this.applyToSelectionOn(controls, "display", "change");
                this.applyToSelectionOn(controls, "user", "input");

                this._settingsTab.monitorChangeOnControls(controls);
                var originalSettings = {};

                //define component properties to add to the original settings object
                var properties = ["count", "display", "imgSize", "user"];

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
                        flickrBadge.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        flickrBadge.applyToSelection(controls);
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
            setValues: function(controls, values) {
                //implement the setValue function
                if (values.count !== false) {
                    controls.count.find('option[value="' + values.count + '"]').attr("selected", "selected");
                } else {
                    controls.count.append('<option class="none">----------</option>');
                }

                if (values.user !== false) {
                    controls.user.val(values.user);
                } else {
                    controls.user.val('');
                }


                if (values.display !== false) {
                    controls.display.filter('[value="' + values.display + '"]').attr("checked", "checked");
                } else {
                    controls.display.removeAttr("checked");
                }

                if (values.imgSize !== false) {
                    controls.imgSize.filter('[value="' + values.imgSize + '"]').attr("checked", "checked");
                } else {
                    controls.imgSize.removeAttr("checked");
                }
            },
            applyToSelection: function(controls, values) {
                if (typeof values === "undefined") {
                    //if no values passed how to do we get the values ?
                    values = {};
                    if (this._settingsTab.hasChanged(controls.count)) {
                        values.count = controls.count.val();
                    }
                    if (this._settingsTab.hasChanged(controls.user)) {
                        values.user = controls.user.val();
                    }
                    if (this._settingsTab.hasChanged(controls.display)) {
                        values.display = controls.display.filter(":checked").val();
                    }
                    if (this._settingsTab.hasChanged(controls.imgSize)) {
                        values.imgSize = controls.imgSize.filter(":checked").val();
                    }
                }
                mxBuilder.selection.each(function() {
                    //apply the values to the selection
                    for (var p in values) {
                        this[p] = values[p];
                    }
                    this.render();
                });
            },
            applyToSelectionOn: function(controls, controlKey, event, extra) {
                var flickrBadge = this;
                controls[controlKey].on(event, function() {
                    flickrBadge._settingsTab.setChanged(controls[controlKey]);
                    if (flickrBadge._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        flickrBadge.applyToSelection(controls);
                    }
                });
            }
        };
    });
}(jQuery));