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
            this.labelContainer.css({
                margin: "-"+(this.labelContainer.height()/2)+"px 0 0 -"+(this.labelContainer.width()/2)+"px"
            });
    
            properties.element.on({
                selected: function(){
                    mxBuilder.activeStack.push(properties.element);
                },
                resize: function(){
                    instance.labelContainer.css({
                        margin: "-"+(instance.labelContainer.height()/2)+"px 0 0 -"+(instance.labelContainer.width()/2)+"px"
                    });
                }
            });
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
                return mxBuilder.Component.prototype.publish.call(this);
            },
            getHeadIncludes: function getHeadIncludes(){
                return mxBuilder.Component.prototype.getHeadIncludes.call(this);
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
                
                out.linkto = mxBuilder.layout.settingsPanels.links.getPanel(false);
                out.button = mxBuilder.layout.settingsPanels.button.getPanel(true);
                
                return out;
            },
            setLabel: function setLabel(txt){
                this.label = txt;
                this.labelContainer.text(txt);
                this.element.trigger("resize");
            },
            getSettings: function getSettings(){
                return {
                    label: this.label,
                    linkObj: this.linkObj
                }
            }
        });
        
        var widgets = mxBuilder.menuManager.menus.widgets;
        widgets.addComponent("root",{
            icon: "flexly-icon-box-component",
            title: "Button Component",
            draggableSettings: {
                grid: mxBuilder.properties.gridSize,
                helper: function(event){
                    var theContent = mxBuilder.ButtonsComponent.prototype.template.clone()
                    .addClass("mx-helper")
                    .data("component","ButtonsComponent")
                    .appendTo(mxBuilder.layout.container);
                    return theContent;
                }
            }
        });
    });
}(jQuery))