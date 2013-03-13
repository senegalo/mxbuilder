(function($){
    $(function(){
        mxBuilder.ButtonsComponent = function ButtonsComponent(properties){
            var instance = this;
            this.init(properties);
            mxBuilder.Component.apply(this,[{
                type: "ButtonsComponent",
                draggable: {},
                resizable: {
                    orientation: "hv"
                },
                editableZIndex: true,
                pinnable: true,
                deletable: true,
                hasSettings: true,
                selectable: true,
                element: properties.element
            }]);
    
            this.labelContainer = this.element.find(".label");
            
            this.setLabel(this.label);
    
            properties.element.on({
                selected: function(){
                    mxBuilder.activeStack.push(properties.element);
                },
                resize: function(){
                    instance.labelContainer.css({
                        marginTop: "-"+(instance.labelContainer.height()/2)+"px"
                    });
                }
            }).trigger("resize");
        }
        $.extend(mxBuilder.ButtonsComponent.prototype, new mxBuilder.Component(), {
            template: mxBuilder.layout.templates.find(".button-component-instance").remove(),
            labelContainer: null,
            label: "Button",
            linkObj: {
                
            },
            save: function save(){
                var out = mxBuilder.Component.prototype.save.call(this);
                out.data.linkObj = this.linkObj;
                out.data.label = this.label;
                return out;
            },
            publish: function publish(){
                var out = mxBuilder.Component.prototype.publish.call(this);
                
                out.css({
                    cursor: "pointer"
                });
                
                var extras = this.linkObj.linkOpenIn?' target = "_blank"':"";
                
                extras += ' style="width:100%;height:100%;display:block"';
                
                switch(this.linkObj.linkType){
                    case "external":
                        out.find(".label").wrap('<a href="'+this.linkObj.linkURL+'"'+extras+'/>');
                        break;
                    case "page":
                        var page = mxBuilder.pages.getPageObj(this.linkObj.linkURL);
                        if(page.address){
                            out.find(".label").wrap('<a href="./'+page.address+'.html"'+extras+'/>');
                        }
                        break;
                }
                
                return out;
            },
            getHeadIncludes: function getHeadIncludes(){
                return mxBuilder.Component.prototype.getHeadIncludes.call(this);
            },
            init: function init(properties){
                mxBuilder.Component.prototype.init.call(this,properties);
                this.element.find(".label").css({
                    position: "absolute",
                    top: "50%",
                    width: "100%",
                    textAlign: "center",
                    display: "inline-block"
                });
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
                
                out.linkto = {
                    panel: mxBuilder.layout.settingsPanels.links,
                    params: false
                };
                out.button = { 
                    panel: mxBuilder.layout.settingsPanels.button,
                    params: true
                };
                
                return out;
            },
            setLabel: function setLabel(txt){
                this.label = txt;
                this.labelContainer.text(txt);
                this.element.trigger("resize");
            },
            getSettings: function getSettings(){
                var out = mxBuilder.Component.prototype.getSettings.call(this);
                $.extend(out, {
                    label: this.label,
                    linkObj: this.linkObj
                });
                return out;
            }
        });
        
        var widgets = mxBuilder.menuManager.menus.widgets;
        widgets.addComponent("root",{
            icon: "flexly-icon-box-component",
            title: "Button Component",
            draggableSettings: {
                helper: function(event){
                    var theContent = mxBuilder.ButtonsComponent.prototype.template.clone()
                    .find(".label")
                    .css({
                        position: "absolute",
                        top: "50%",
                        width: "100%",
                        textAlign: "center",
                        display: "inline-block",
                        marginTop: "-6px"
                    })
                    .end()
                    .addClass("mx-helper")
                    .data("component","ButtonsComponent")
                    .appendTo(mxBuilder.layout.container);
                    return theContent;
                }
            }
        });
    });
}(jQuery))