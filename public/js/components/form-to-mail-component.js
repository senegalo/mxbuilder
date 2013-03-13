(function($){
    $(function(){
        mxBuilder.FormToMailComponent = function FormToMailComponent(properties){
            this.init(properties);
            mxBuilder.Component.apply(this,[{
                type: "FormToMailComponent",
                draggable: {},
                resizable: false,
                editableZIndex: true,
                pinnable: true,
                deletable: true,
                hasSettings: true,
                selectable: true,
                element: properties.element
            }]);
    
            properties.element.on({
                selected: function(){
                    mxBuilder.activeStack.push(properties.element);
                }
            });
            
            this.theForm = this.element.find("form");
            
            this.setMode(this.mode);
            
        }
        $.extend(mxBuilder.FormToMailComponent.prototype, new mxBuilder.Component(), {
            template: mxBuilder.layout.templates.find(".form-to-mail-component-instance"),
            theForm: null,
            email: "senegalo@gmail.com",
            mode: "normal",
            afterSubmission: "message",
            redirectPage: null,
            message: "",
            hideForm: false,
            redisplay: false,
            redisplaySeconds: 10,
            setMode: function setMode(mode){
                this.mode = mode;
                if(mode == "normal"){
                    this.theForm.find(".form-split-one").css({
                        "float":"none"
                    }).end().find(".form-split-two").css({
                        "float":"none"
                    }).end().find("textarea").css({
                        width: "230px",
                        height: "100px"
                    });
                    this.element.css("width","240");
                } else {
                    this.theForm.find(".form-split-one").css({
                        "float":"left"
                    }).end().find(".form-split-two").css({
                        "float":"right"
                    }).end().find("textarea").css({
                        width: "190px",
                        height: "70px"
                    });
                    this.element.css("width","436");
                }
                this.revalidate();
            },
            revalidate: function revalidate(){
                this.element.height(this.theForm.outerHeight());
                this.element.width(this.theForm.outerWidth());
                mxBuilder.selection.revalidateSelectionContainer()
            },
            save: function save(){
                var out = mxBuilder.Component.prototype.save.call(this);
                
                out.data.email = this.email;
                out.data.mode = this.mode;
                out.data.afterSubmission = this.afterSubmission;
                out.data.redirectPage = this.redirectPage;
                out.data.message = this.message;
                out.data.hideForm = this.hideForm;
                out.data.redisplay = this.redisplay;
                out.data.redisplaySeconds = this.redisplaySeconds;
                
                return out;
            },
            publish: function publish(){
                var out = mxBuilder.Component.prototype.publish.call(this);
                
                var outAttrs = {
                    "data-after-submit": this.afterSubmission 
                };
                
                if(this.afterSubmission == "redirect"){
                    var page = mxBuilder.pages.getPageObj(this.redirectPage);
                    outAttrs["data-redirect-page"] = page.homepage ? "index.html" : page.address;
                } else {
                    out.find(".after-submit-message").text(this.message);
                    $.extend(outAttrs,{
                        "data-hide-form": this.hideForm?1:0,
                        "data-redisplay": this.redisplay?1:0,
                        "data-redisplay-seconds": this.redisplaySeconds
                    });
                }
                
                out.attr(outAttrs);
                
                return out;
            },
            getHeadIncludes: function getHeadIncludes(){
                var out = mxBuilder.Component.prototype.getHeadIncludes.call(this);
                
                out.scripts.formSubmit = "public/js-published/form-submit.js";
                out.css.formToMail = "public/css-published/form-to-mail.css";
                
                return out;
            },
            init: function init(properties){
                mxBuilder.Component.prototype.init.call(this,properties);
            },
            getBorder: function getBorder(element){
                return mxBuilder.Component.prototype.getBorder.call(this,element);
            },
            setBorder: function setBorder(obj){
                mxBuilder.Component.prototype.setBorder.call(this,obj);
            },
            getBackground: function getBackground(element){
                return mxBuilder.Component.prototype.getBackground.call(this,element);
            },
            setBackground: function setBackground(obj){
                mxBuilder.Component.prototype.setBackground.call(this,obj);
            },
            getSettingsPanels: function getSettingsPanels(){
                var out = mxBuilder.Component.prototype.getSettingsPanels.call(this);
                
                out.position = {
                    panel: mxBuilder.layout.settingsPanels.position
                };
                
                out.form = {
                    panel: mxBuilder.layout.settingsPanels.formToMail,
                    params: true
                };
                
                return out;
            },
            getSettings: function getSettings(){
                var out = mxBuilder.Component.prototype.getSettings.call(this);
                $.extend(out,{
                    email: this.email,
                    mode: this.mode,
                    afterSubmission: this.afterSubmission,
                    redirectPage: this.redirectPage,
                    message: this.message,
                    hideForm : this.hideForm,
                    redisplay : this.redisplay,
                    redisplaySeconds : this.redisplaySeconds
                });
                return out;
            }
        });
        
        var widgets = mxBuilder.menuManager.menus.widgets;
        widgets.addComponent("root",{
            icon: "flexly-icon-box-component",
            title: "Form To Mail",
            draggableSettings: {
                helper: function(event){
                    var theContent = mxBuilder.FormToMailComponent.prototype.template.clone()
                    .addClass("mx-helper")
                    .data("component","FormToMailComponent")
                    .appendTo(mxBuilder.layout.container);
                    return theContent;
                }
            }
        });
    });
}(jQuery))