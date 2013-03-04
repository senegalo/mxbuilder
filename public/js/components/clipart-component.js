(function($){
    $(function(){
        mxBuilder.ClipartComponent = function ClipartComponent(properties){
            this.init(properties);
            
            //Edit component behavious settings...
            mxBuilder.Component.apply(this,[{
                type: "ClipartComponent",
                draggable: {},
                resizable: {
                    orientation: "hv",
                    aspectRatio: true
                },
                editableZIndex: true,
                pinnable: true,
                deletable: true,
                hasSettings: true,
                selectable: true,
                element: properties.element
            }]);
    
            //Add element events...
            properties.element.on({
                selected: function(){
                    mxBuilder.activeStack.push(properties.element);
                },
                resize: function resize(){
                    mxBuilder.components.getComponent($(this)).revalidate();
                }
            });
            
        //Extra Initializtion actions...
            
        }
        $.extend(mxBuilder.ClipartComponent.prototype, new mxBuilder.Component(), {
            template: mxBuilder.layout.templates.find(".clipart-component-instance").remove(),
            clipartContainer: null,
            save: function save(){
                var out = mxBuilder.Component.prototype.save.call(this);
                
                out.data.clipartID = this.clipartID;
                
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
                if(properties.data.extra){
                    this.clipartID = properties.data.extra;
                }
                this.clipartContainer = this.element.find(".clipart").append("&#"+this.clipartID+";");
                this.revalidate();
            },
            revalidate: function revalidate(){
                var height = this.element.height();
                this.clipartContainer.css({
                    lineHeight: height+"px",
                    fontSize: height
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
                var out =  mxBuilder.Component.prototype.getSettingsPanels.call(this);
                
                delete out.border;
                delete out.shadow;
                delete out.background;
                
                 out.color = {
                    panel: mxBuilder.layout.settingsPanels.color,
                    params: {
                        expand: true
                    }
                };
                
                return out;
            },
            getSettings: function getSettings(){
                return {
                    color: this.clipartContainer.css("color")
                };
            },
            setColor: function setColor(color){
                this.clipartContainer.css("color",color);
            }
        });
        
        
    });
}(jQuery))