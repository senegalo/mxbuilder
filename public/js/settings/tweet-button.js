(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.tweetButton = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".flexly-tweet-button-settings"),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            getPanel: function(expand) {
                var tweetButton = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Tweet Button");

                var theInstance = this._template.clone();

                //fill in all the controls 
                var controls = {
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

                this.applyToSelectionOn(controls, "countPosition", "click");
                this.applyToSelectionOn(controls, "urlText", "input");
                this.applyToSelectionOn(controls, "tweetText", "input");
                this.applyToSelectionOn(controls, "url", "change");

                controls.urlText.on({
                    focus: function() {
                        controls.urlCustom.attr("checked", "checked");
                    }
                });

                this._settingsTab.monitorChangeOnControls(controls);
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

                this.setValues(controls, originalSettings);

                thePanel.on({
                    previewEnabled: function() {
                        tweetButton.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        tweetButton.applyToSelection(controls);
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
                if (values.text !== false) {
                    controls.tweetText.val(values.text);
                } else {
                    controls.tweetText.val('');
                }

                controls.countPosition.removeAttr("checked");
                if (values.count !== false) {
                    controls['countPosition' + values.count.uppercaseFirst()].attr("checked", "checked");
                }

                controls.url.removeAttr("checked");
                if (values.url !== false) {
                    if (typeof values.url === "undefined" || values.url === "none") {
                        controls.urlNone.attr("checked", "checked");
                        controls.urlText.val("");
                    } else {
                        controls.urlCustom.attr("checked", "checked");
                        controls.urlText.val(values.url);
                    }
                }
            },
            applyToSelection: function(controls, values) {
                if (typeof values === "undefined") {
                    //if no values passed how to do we get the values ?
                    values = {};
                    if (this._settingsTab.hasChanged(controls.tweetText)) {
                        values.text = controls.tweetText.val();
                    }
                    if (this._settingsTab.hasChanged(controls.countPosition)) {
                        values.count = controls.countPosition.filter(":checked").val();
                    }
                    if (this._settingsTab.hasChanged(controls.url)) {
                        values.url = controls.urlNone.is(":checked") ? "none" : controls.urlText.val();
                    }
                }
                mxBuilder.selection.each(function() {
                    //apply the values to the selection
                    for (var p in values) {
                        if (values[p] === false) {
                            continue;
                        }
                        this[p] = values[p];
                    }
                    if (typeof values.count !== "undefined") {
                        this.rebuild();
                        mxBuilder.selection.revalidateSelectionContainer();
                    }
                });
            },
            applyToSelectionOn: function(controls, controlKey, event, extra) {
                var tweetButton = this;
                controls[controlKey].on(event, function() {
                    tweetButton._settingsTab.setChanged(controls[controlKey]);
                    if (tweetButton._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        tweetButton.applyToSelection(controls);
                    }
                });
            }
        };
    });
}(jQuery));