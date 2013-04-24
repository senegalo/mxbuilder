(function($) {
    $(function() {
        mxBuilder.layout.settingsPanels.formToMail = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".form-to-mail-settings"),
            _settingsTab: mxBuilder.menuManager.menus.componentSettings,
            _controls: null,
            hasPicker: true,
            getPanel: function(expand) {
                var formToMail = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);

                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Form Settings");

                var theInstance = this._template.clone();

                //fill in all the controls 
                this._controls = {
                    email: theInstance.find("#form-mail-to"),
                    mode: theInstance.find(".form-mode input"),
                    afterSubmission: theInstance.find('.form-after-submit input[type="radio"]'),
                    redirectToPage: theInstance.find("#form-redirect-to-page"),
                    showMessage: theInstance.find("#form-show-message"),
                    redirectPage: theInstance.find("#form-redirect-page"),
                    message: theInstance.find("#form-message"),
                    hideForm: theInstance.find("#form-hide"),
                    redisplay: theInstance.find("#form-redisplay"),
                    redisplaySeconds: theInstance.find("#form-redisplay-seconds")
                };

                //Configure the controls here
                this._controls.redirectPage.append(mxBuilder.layout.utils.getOrderdPagesList());

                this.applyToSelectionOn("email", "input");

                this.applyToSelectionOn("mode", "change");

                this.applyToSelectionOn("afterSubmission", "change");

                this.applyToSelectionOn("redirectPage", "change", function() {
                    formToMail._controls.redirectToPage.attr("checked", "checked");
                });

                this.applyToSelectionOn("message", "input", function() {
                    formToMail._controls.showMessage.attr("checked", "checked");
                });

                this.applyToSelectionOn("hideForm", "change", function() {
                    formToMail._controls.showMessage.attr("checked", "checked");
                    if (!formToMail._controls.hideForm.is(":checked")) {
                        formToMail._controls.redisplay.removeAttr("checked");
                    }
                });

                this.applyToSelectionOn("redisplay", "change", function() {
                    formToMail._controls.showMessage.attr("checked", "checked");
                    if (formToMail._controls.redisplay.is(":checked")) {
                        formToMail._controls.hideForm.attr("checked", "checked");
                    }
                });

                this.applyToSelectionOn("redisplaySeconds", "input", function() {
                    formToMail._controls.showMessage.attr("checked", "checked");
                    formToMail._controls.redisplay.attr("checked", "checked");
                    formToMail._controls.hideForm.attr("checked", "checked");
                });

                this._settingsTab.monitorChangeOnControls(this._controls);
                var originalSettings = {};

                //define component properties to add to the original settings object
                var properties = ["email", "mode", "afterSubmission", "redirectPage", "message", "hideForm", "redisplay", "redisplaySeconds"];

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
                        formToMail.applyToSelection();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function() {
                        formToMail.applyToSelection();
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

                //setting up the email field
                if (values.email !== false) {
                    this._controls.email.val(values.email);
                } else {
                    this._controls.email.val('');
                }

                //setting up the mode radios
                if (values.mode !== false) {
                    this._controls.mode.filter('[value="' + values.mode + '"]').attr("checked", "checked");
                } else {
                    this._controls.mode.removeAttr("checked");
                }

                //setting up the after submission radios
                if (values.afterSubmission !== false) {
                    this._controls.afterSubmission.filter('[value="' + values.afterSubmission + '"]').attr("checked", "checked");

                    if (values.afterSubmission === "redirect") {
                        //setting up the redirect page select box
                        if (values.redirectPage !== false) {
                            this._controls.redirectPage.find('option[value="' + values.redirectPage + '"]').attr("selected", "selected");
                        } else {
                            this._controls.redirectPage.prepend('<option value="">-----</option>').once("change", function() {
                                $(this).find('option[value=""]').remove();
                            });
                        }
                    } else {
                        //setting up the message field
                        if (values.message !== false) {
                            this._controls.message.val(values.message);
                        } else {
                            this._controls.message.val('');
                        }

                        //setting up the hide form checkbox
                        if (values.hideForm !== false) {
                            this._controls.hideForm.attr("checked", "checked");
                        } else {
                            this._controls.hideForm.removeAttr("checked");
                        }

                        //setting up the form redisplay Checkbox
                        if (values.redisplay !== false) {
                            this._controls.redisplay.attr("checked", "checked");
                        } else {
                            this._controls.redisplay.removeAttr("checked");
                        }

                        //setting up the redisplay Seconds checkbox
                        if (values.redisplaySeconds !== false) {
                            this._controls.redisplaySeconds.val(values.redisplaySeconds);
                        } else {
                            this._controls.redisplaySeconds.val('');
                        }
                    }
                } else {
                    this._controls.afterSubmission.removeAttr("checked");
                }
            },
            getValues: function(all) {
                var values = {};
                if (all || this._settingsTab.hasChanged(this._controls.email)) {
                    values.email = this._controls.email.val();
                }
                if (all || this._settingsTab.hasChanged(this._controls.mode)) {
                    values.mode = this._controls.mode.filter(":checked").val();
                }
                if (all || this._settingsTab.hasChanged(this._controls.afterSubmission)) {
                    values.afterSubmission = this._controls.afterSubmission.filter(":checked").val();
                }
                if (values.afterSubmission === "redirect" && (all || this._settingsTab.hasChanged(this._controls.redirectPage))) {
                    values.redirectPage = this._controls.redirectPage.find("option:selected").val();
                } else {
                    if (all || this._settingsTab.hasChanged(this._controls.message)) {
                        values.message = this._controls.message.val();
                    }
                    if (all || this._settingsTab.hasChanged(this._controls.hideForm)) {
                        values.hideForm = this._controls.hideForm.is(":checked");
                    }
                    if (all || this._settingsTab.hasChanged(this._controls.redisplay)) {
                        values.redisplay = this._controls.redisplay.is(":checked");
                    }
                    if (all || this._settingsTab.hasChanged(this._controls.redisplaySeconds)) {
                        values.redisplaySeconds = this._controls.redisplaySeconds.val();
                    }
                }
                return {formToMail: values};
            },
            applyToSelection: function(values) {
                if (typeof values === "undefined") {
                    //if no values passed how to do we get the values ?
                    values = this.getValues();
                }
                mxBuilder.selection.each(function() {
                    //apply the values to the selection
                    this.setSettings(values);
                });
            },
            applyToSelectionOn: function(controlKey, event, extra) {
                var formToMail = this;
                this._controls[controlKey].on(event, function() {
                    formToMail._settingsTab.setChanged(formToMail._controls[controlKey]);
                    if (formToMail._settingsTab.isPreview()) {
                        if (typeof extra !== "undefined") {
                            extra.apply(this, arguments);
                        }
                        formToMail.applyToSelection();
                    }
                });
            }
        };
    });
}(jQuery));