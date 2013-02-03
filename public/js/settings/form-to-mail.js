(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.formToMail = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".form-to-mail-settings"),
            getPanel: function(expand){
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                var formToMail = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(expand);
                
                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Form Settings");
                
                var theInstance = this._template.clone();
                
                //fill in all the controls 
                var controls = {
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
                controls.redirectPage.append(mxBuilder.layout.utils.getOrderdPagesList());
                
                this.applyToSelectionOn(controls, "email", "input");
                
                this.applyToSelectionOn(controls, "mode", "change");
                
                this.applyToSelectionOn(controls,"afterSubmission","change");
                
                this.applyToSelectionOn(controls,"redirectPage","change",function(){
                    controls.redirectToPage.attr("checked","checked");
                });
                
                this.applyToSelectionOn(controls, "message", "input", function(){
                    controls.showMessage.attr("checked","checked");
                });
                
                this.applyToSelectionOn(controls, "hideForm", "change", function(){
                    controls.showMessage.attr("checked","checked");
                    if(!controls.hideForm.is(":checked")){
                        controls.redisplay.removeAttr("checked");
                    }
                });
                
                this.applyToSelectionOn(controls, "redisplay", "change", function(){
                    controls.showMessage.attr("checked","checked");
                    if(controls.redisplay.is(":checked")){
                        controls.hideForm.attr("checked","checked");
                    }
                });
                
                this.applyToSelectionOn(controls, "redisplaySeconds", "input", function(){
                    controls.showMessage.attr("checked","checked");
                    controls.redisplay.attr("checked","checked");
                    controls.hideForm.attr("checked","checked");
                });
                
                
                var originalSettings = {};
                
                //define component properties to add to the original settings object
                var properties = ["email","mode","afterSubmission","redirectPage","message","hideForm","redisplay","redisplaySeconds"];
                
                var firstPass = true;
                mxBuilder.selection.each(function(){
                    var theSettings = this.getSettings();
                    for(var p in properties){
                        if(firstPass){
                            originalSettings[properties[p]] = theSettings[properties[p]];
                        }
                        var data = theSettings[properties[p]];
                        if (originalSettings[properties[p]] !== data){
                            originalSettings[properties[p]] = false;
                        }
                    }
                    firstPass = false;
                });
                
                this.setValues(controls,originalSettings);
                
                thePanel.on({
                    previewEnabled: function(){
                        formToMail.applyToSelection(controls);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    save: function(){
                        formToMail.applyToSelection(controls);
                        mxBuilder.menuManager.closeTab();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    previewDisabled: function(){
                        formToMail.applyToSelection(controls,originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    cancel: function(){
                        formToMail.applyToSelection(controls,originalSettings);
                        mxBuilder.selection.revalidateSelectionContainer();
                        mxBuilder.menuManager.closeTab();
                    }
                });                
                
                thePanel.find(".flexly-collapsable-content").append(theInstance);
                return thePanel;
            },
            setValues: function(controls, values){    
                //implement the setValue function
                
                //setting up the email field
                if(values.email !== false){
                    controls.email.val(values.email);
                } else {
                    controls.email.val('');
                }
                
                //setting up the mode radios
                if(values.mode !== false){
                    controls.mode.filter('[value="'+values.mode+'"]').attr("checked","checked");
                } else {
                    controls.mode.removeAttr("checked");
                }
                
                //setting up the after submission radios
                if(values.afterSubmission !== false){
                    controls.afterSubmission.filter('[value="'+values.afterSubmission+'"]').attr("checked","checked");
                    
                    if(values.afterSubmission == "redirect"){
                        //setting up the redirect page select box
                        if(values.redirectPage !== false){
                            controls.redirectPage.find('option[value="'+values.redirectPage+'"]').attr("selected","selected");
                        } else {
                            controls.redirectPage.prepend('<option value="">-----</option>').once("change",function(){
                                $(this).find('option[value=""]').remove();  
                            });
                        }
                    } else {
                        //setting up the message field
                        if(values.message !== false){
                            controls.message.val(values.message);
                        } else {
                            controls.message.val('');
                        }
                        
                        //setting up the hide form checkbox
                        if(values.hideForm !== false){
                            controls.hideForm.attr("checked","checked");
                        } else {
                            controls.hideForm.removeAttr("checked");
                        }
                        
                        //setting up the form redisplay Checkbox
                        if(values.redisplay !== false){
                            controls.redisplay.attr("checked","checked");
                        } else {
                            controls.redisplay.removeAttr("checked");
                        }
                        
                        //setting up the redisplay Seconds checkbox
                        if(values.redisplaySeconds !== false){
                            controls.redisplaySeconds.val(values.redisplaySeconds);
                        } else {
                            controls.redisplaySeconds.val('');
                        }
                    }
                } else {
                    controls.afterSubmission.removeAttr("checked");
                }
            },
            applyToSelection: function applyToSelection(controls,values){
                if(typeof values === "undefined"){
                    //if no values passed how to do we get the values ?
                    values = {
                        email: controls.email.val(),
                        mode: controls.mode.filter(":checked").val(),
                        afterSubmission: controls.afterSubmission.filter(":checked").val()
                    }
                    if(values.afterSubmission == "redirect"){
                        values.redirectPage = controls.redirectPage.find("option:selected").val();
                    } else {
                        $.extend(values,{
                            message: controls.message.val(),
                            hideForm : controls.hideForm.is(":checked"),
                            redisplay : controls.redisplay.is(":checked"),
                            redisplaySeconds : controls.redisplaySeconds.val()
                        });
                    }
                }
                mxBuilder.selection.each(function(){
                    //apply the values to the selection
                    for(var p in values){
                        this.setMode(values.mode);
                        $.extend(this,values);
                    }
                });
            },
            applyToSelectionOn: function applyToSelectionOn(controls,controlKey,event,extra){
                var formToMail = this;
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                controls[controlKey].on(event,function(){
                    if(settingsTab.isPreview()){
                        if(typeof extra != "undefined"){
                            extra.call();
                        }
                        formToMail.applyToSelection(controls);
                    }
                });
            }
        }
    });
}(jQuery))