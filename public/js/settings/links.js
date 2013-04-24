(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.links = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".linkto").remove(),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            _controls: null,
            hasPicker: true,
            getPanel: function(settings) {
                var links = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(settings && settings.expand ? settings.expand : false);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Link To");

                var theInstance = this._template.clone();

                //fill in all the controls 
                this._controls = {
                    linkType: theInstance.find('.link-type'),
                    newWindow: theInstance.find('#linkto-new-window'),
                    pages: theInstance.find("#linkto-pages"),
                    externalLinkText: theInstance.find("#linkto-external-link"),
                    externalLinkProtocol: theInstance.find("#linkto-protocol"),
                    linktoExternal: theInstance.find("#linkto-external"),
                    linktoPage: theInstance.find("#linkto-page"),
                    linktoLightbox: theInstance.find("#linkto-lightbox"),
                    lightboxContainer: theInstance.find(".lightbox")
                };


                //Configure the controls here
                this.applyToSelectionOn("linkType", "change");
                this.applyToSelectionOn("newWindow", "change");
                this.applyToSelectionOn("pages", "change", function() {
                    links._controls.linktoPage.attr("checked", "checked").trigger("change");
                });
                this.applyToSelectionOn("externalLinkText", "input");
                this.applyToSelectionOn("externalLinkProtocol", "change", function() {
                    links._controls.linktoExternal.attr("checked", "checked").trigger("change");
                    links._controls.externalLinkText.focus();
                });

                this._controls.externalLinkText.on({
                    focus: function focus() {
                        links._controls.linktoExternal.attr("checked", "checked").trigger("change");
                    }
                });

                this._controls.pages.append(mxBuilder.layout.utils.getOrderdPagesList());

                if (settings && settings.lightbox) {
                    this._controls.lightboxContainer.show();
                } else {
                    this._controls.lightboxContainer.hide();
                }

                this._settingsTab.monitorChangeOnControls(this._controls);
                var originalSettings = {};

                //define component properties to add to the original settings object
                var properties = ["linkType", "linkURL", "linkProtocol", "linkOpenIn"];

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
                        links.applyToSelection();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        links.applyToSelection();
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
                if (values.linkType !== false) {
                    this._controls.linkType.filter('input[value="' + values.linkType + '"]').attr("checked", "checked").trigger("change");

                    switch (values.linkType) {
                        case "external":
                            this._controls.externalLinkText.val(values.linkURL !== false ? values.linkURL : "");
                            if (values.linkProtocol !== false) {
                                this._controls.externalLinkProtocol.find('option[value="' + values.linkProtocol + '"]').attr("selected", "selected");
                            } else {
                                this._controls.externalLinkProtocol.prepend('<option value="none">-----</option>').one(function() {
                                    change: function change() {
                                        $(this).find('option[value="none"]').remove();
                                    }
                                });
                            }
                            break;
                        case "page":
                            this._controls.pages.find('option[value="' + values.linkURL + '"]').attr("selected", "selected");
                            break;
                    }

                } else {
                    this._controls.linkType.remoteAttr("checked").trigger("change");
                }

                if (values.linkOpenIn !== false) {
                    this._controls.newWindow.attr("checked", "checked").trigger("change");
                }
            },
            getValues: function(all) {
                //if no values passed how to do we get the values ?
                var values = {};
                if (all || this._settingsTab.hasChanged(this._controls.linkType)) {
                    values.linkType = this._controls.linkType.filter(":checked").val();
                    if (values.linkType === "external") {
                        values.linkURL = this._controls.externalLinkText.val();
                        values.linkProtocol = this._controls.externalLinkProtocol.find("option:selected").val();
                    } else if (values.linkType === "page") {
                        values.linkURL = this._controls.pages.find("option:selected").val();
                    }
                    if (all || this._settingsTab.hasChanged(this._controls.newWindow)) {
                        values.linkOpenIn = this._controls.newWindow.is(":checked") ? true : false;
                    }
                } else {
                    if (all || this._settingsTab.hasChanged(this._controls.newWindow)) {
                        values.linkOpenIn = this._controls.newWindow.is(":checked") ? true : false;
                    }
                    if (values.linkType === "external") {
                        if (this._settingsTab.hasChanged(this._controls.externalLinkText)) {
                            values.linkURL = this._controls.externalLinkText.val();
                        }
                        if (all || this._settingsTab.hasChanged(this._controls.externalLinkProtocol)) {
                            values.linkProtocol = this._controls.externalLinkProtocol.find("option:selected").val();
                        }
                    } else if (values.linkType === "page" && (all || this._settingsTab.hasChanged(this._controls.pages))) {
                        values.linkURL = this._controls.pages.find("option:selected").val();
                    }
                }
                
                return { links: values };
                
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
                var links = this;
                this._controls[controlKey].on(event, function() {
                    links._settingsTab.setChanged(links._controls[controlKey]);
                    if (links._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        links.applyToSelection();
                    }
                });
            }
        };
    });
}(jQuery));