(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.flickrBadge = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".flickr-badge-settings").remove(),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            _controls: null,
            hasPicker: true,
            getPanel: function(expand) {
                var flickrBadge = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Flickr Badge");

                var theInstance = this._template.clone();

                //fill in all the controls 
                this._controls = {
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
                this.applyToSelectionOn("count", "change");
                this.applyToSelectionOn("imgSize", "change");
                this.applyToSelectionOn("display", "change");
                this.applyToSelectionOn("user", "input");

                this._settingsTab.monitorChangeOnControls(this._controls);
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

                this.setValues(originalSettings);

                thePanel.on({
                    previewEnabled: function() {
                        flickrBadge.applyToSelection();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        flickrBadge.applyToSelection();
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
                if (values.count !== false) {
                    this._controls.count.find('option[value="' + values.count + '"]').attr("selected", "selected");
                } else {
                    this._controls.count.append('<option class="none">----------</option>');
                }

                if (values.user !== false) {
                    this._controls.user.val(values.user);
                } else {
                    this._controls.user.val('');
                }


                if (values.display !== false) {
                    this._controls.display.filter('[value="' + values.display + '"]').attr("checked", "checked");
                } else {
                    this._controls.display.removeAttr("checked");
                }

                if (values.imgSize !== false) {
                    this._controls.imgSize.filter('[value="' + values.imgSize + '"]').attr("checked", "checked");
                } else {
                    this._controls.imgSize.removeAttr("checked");
                }
            },
            getValues: function(all, isPicker) {
                //if no values passed how to do we get the values ?
                values = {};
                if (all || this._settingsTab.hasChanged(this._controls.count)) {
                    values.count = this._controls.count.val();
                }
                if (!isPicker && (all || this._settingsTab.hasChanged(this._controls.user))) {
                    values.user = this._controls.user.val();
                }
                if (all || this._settingsTab.hasChanged(this._controls.display)) {
                    values.display = this._controls.display.filter(":checked").val();
                }
                if (all || this._settingsTab.hasChanged(this._controls.imgSize)) {
                    values.imgSize = this._controls.imgSize.filter(":checked").val();
                }
                
                return {flickrBadge: values};
                
            },
            applyToSelection: function(values) {
                if (typeof values === "undefined") {
                    values = this.getValues();
                }
                mxBuilder.selection.each(function() {
                    //apply the values to the selection
                    this.setSettings(values);
                });
            },
            applyToSelectionOn: function(controlKey, event, extra) {
                var flickrBadge = this;
                this._controls[controlKey].on(event, function() {
                    flickrBadge._settingsTab.setChanged(flickrBadge._controls[controlKey]);
                    if (flickrBadge._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        flickrBadge.applyToSelection();
                    }
                });
            }
        };
    });
}(jQuery));