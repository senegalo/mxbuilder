(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.tweetButton = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".flexly-tweet-button-settings"),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            _controls: null,
            hasPicker: true,
            getPanel: function(expand) {
                var tweetButton = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Tweet Button");

                var theInstance = this._template.clone();

                //fill in all the controls 
                this._controls = {
                    countPositionHorizontal: theInstance.find("#twitter-count-position-hr"),
                    countPositionNone: theInstance.find("#twitter-count-position-none"),
                    countPositionVertical: theInstance.find("#twitter-count-position-vr"),
                    countPosition: theInstance.find('.tweet-counter-position input[name="twitter-count-position"]'),
                    tweetText: theInstance.find(".tweet-text"),
                    urlCustom: theInstance.find("#twitter-url-custom"),
                    urlNone: theInstance.find("#twitter-url-none"),
                    url: theInstance.find('.tweet-url input[name="twitter-url"]'),
                    urlText: theInstance.find(".tweet-button-url")
                };


                //Configure the controls here

                this.applyToSelectionOn("countPosition", "click");
                this.applyToSelectionOn("urlText", "input");
                this.applyToSelectionOn("tweetText", "input");
                this.applyToSelectionOn("url", "change");

                this._controls.urlText.on({
                    focus: function() {
                        tweetButton._controls.urlCustom.attr("checked", "checked");
                    }
                });

                this._settingsTab.monitorChangeOnControls(this._controls);
                var originalSettings = {};

                //define component properties to add to the original settings object
                var properties = ["text", "count", "url"];

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
                        tweetButton.applyToSelection();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        tweetButton.applyToSelection();
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
                if (values.text !== false) {
                    this._controls.tweetText.val(values.text);
                } else {
                    this._controls.tweetText.val('');
                }

                this._controls.countPosition.removeAttr("checked");
                if (values.count !== false) {
                    this._controls['countPosition' + values.count.uppercaseFirst()].attr("checked", "checked");
                }

                this._controls.url.removeAttr("checked");
                if (values.url !== false) {
                    if (typeof values.url === "undefined" || values.url === "none") {
                        this._controls.urlNone.attr("checked", "checked");
                        this._controls.urlText.val("");
                    } else {
                        this._controls.urlCustom.attr("checked", "checked");
                        this._controls.urlText.val(values.url);
                    }
                }
            },
            getValues: function(all) {
                var values = {};
                if (all || this._settingsTab.hasChanged(this._controls.tweetText)) {
                    values.text = this._controls.tweetText.val();
                }
                if (all || this._settingsTab.hasChanged(this._controls.countPosition)) {
                    values.count = this._controls.countPosition.filter(":checked").val();
                }
                if (all || this._settingsTab.hasChanged(this._controls.url)) {
                    values.url = this._controls.urlNone.is(":checked") ? "none" : this._controls.urlText.val();
                }
                return {
                    tweetButton: values
                };
            },
            applyToSelection: function(values) {
                values = this.getValues();
                mxBuilder.selection.each(function() {
                    this.setSettings(values);
                });
            },
            applyToSelectionOn: function(controlKey, event, extra) {
                var tweetButton = this;
                this._controls[controlKey].on(event, function() {
                    tweetButton._settingsTab.setChanged(tweetButton._controls[controlKey]);
                    if (tweetButton._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        tweetButton.applyToSelection(tweetButton._controls);
                    }
                });
            }
        };
    });
}(jQuery));