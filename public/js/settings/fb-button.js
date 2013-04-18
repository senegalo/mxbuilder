(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.fbButton = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".flexly-fb-button-settings"),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            _controls: null,
            hasPicker: true,
            getPanel: function(expand) {
                var fbButton = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Facebook Button");

                var theInstance = this._template.clone();

                //fill in all the controls 
                this._controls = {
                    counterPosition: theInstance.find('.fb-counter-position input'),
                    counterPositionHr: theInstance.find('#fb-count-position-hr'),
                    counterPositionVr: theInstance.find('#fb-count-position-vr'),
                    action: theInstance.find(".fb-action input"),
                    actionLike: theInstance.find("#fb-action-like"),
                    actionRecommend: theInstance.find("#fb-action-recommend")
                };


                //Configure the controls here
                this.applyToSelectionOn("counterPosition", "change");
                this.applyToSelectionOn("action", "change");

                this._settingsTab.monitorChangeOnControls(this._controls);
                var originalSettings = {};

                //define component properties to add to the original settings object
                var properties = ["action", "counterPosition"];

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
                        fbButton.applyToSelection();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        fbButton.applyToSelection();
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
                    if (values.counterPosition === "button_count") {
                        this._controls.counterPositionHr.attr("checked", "checked");
                    } else {
                        this._controls.counterPositionVr.attr("checked", "checked");
                    }
                } else {
                    this._controls.counterPosition.removeAttr("checked");
                }
                if (values.action !== false) {
                    if (values.action === "like") {
                        this._controls.actionLike.attr("checked", "checked");
                    } else {
                        this._controls.actionRecommend.attr("checked", "checked");
                    }
                } else {
                    this._controls.action.removeAttr("checked");
                }
            },
            getValues: function(all) {
                var values = {};
                if (all || this._settingsTab.hasChanged(this._controls.counterPosition)) {
                    values.counterPosition = this._controls.counterPosition.filter(":checked").val();
                }
                if (all || this._settingsTab.hasChanged(this._controls.action)) {
                    values.action = this._controls.action.filter(":checked").val();
                }
                return {fbButton: values};
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
                var fbButton = this;
                this._controls[controlKey].on(event, function() {
                    fbButton._settingsTab.setChanged(fbButton._controls[controlKey]);
                    if (fbButton._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        fbButton.applyToSelection();
                    }
                });
            }
        };
    });
}(jQuery));