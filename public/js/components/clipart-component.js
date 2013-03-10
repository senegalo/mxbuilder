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
            linkObj: null,
            save: function save(){
                var out = mxBuilder.Component.prototype.save.call(this);
                
                out.data.clipartID = this.clipartID;
                out.data.linkObj = this.linkObj;
                
                return out;
            },
            publish: function publish(){
                var out = mxBuilder.Component.prototype.publish.call(this);
                
                if(this.linkObj){
                    out.css({
                        cursor: "pointer"
                    }).find(".clipart").css("cursor","");
                
                    var extras = this.linkObj.linkOpenIn?' target = "_blank"':"";
                
                    extras += ' style="width:100%;height:100%;display:block"';
                
                    switch(this.linkObj.linkType){
                        case "external":
                            if(typeof this.linkObj.protocol == "undefined"){
                                this.linkObj.protocol = "http://";
                            }
                            if(typeof this.linkObj.linkOpenIn == "undefined"){
                                this.linkObj.linkOpenIn = true;
                            }
                            out.find(".clipart").wrap('<a href="'+this.linkObj.protocol+this.linkObj.linkURL+'"'+extras+'/>');
                            break;
                        case "page":
                            var page = mxBuilder.pages.getPageObj(this.linkObj.linkURL);
                            if(page.address){
                                out.find(".clipart").wrap('<a href="./'+page.address+'.html"'+extras+'/>');
                            }
                            break;
                    }
                }
                
                return out;
            },
            getHeadIncludes: function getHeadIncludes(){
                var out = mxBuilder.Component.prototype.getHeadIncludes.call(this);
                
                out.css.clipart = "public/css-published/clipart.css";
                
                return out;
            },
            init: function init(properties){
                mxBuilder.Component.prototype.init.call(this,properties);                
                if(properties.data.extra){
                    this.clipartID = properties.data.extra;
                }
                this.clipartContainer = this.element.find(".clipart").append("&#"+this.clipartID+";");
                this.revalidate();
                if(this.linkObj === null){
                    this.linkObj = {};
                }
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
                
                out.linkto = {
                    panel: mxBuilder.layout.settingsPanels.links,
                    params: false
                };
                
                return out;
            },
            getSettings: function getSettings(){
                return {
                    color: this.clipartContainer.css("color"),
                    linkType: this.linkObj.linkType,
                    linkURL: this.linkObj.linkURL,
                    linkProtocol: this.linkObj.protocol,
                    linkOpenIn: this.linkObj.linkOpenIn
                };
            },
            setColor: function setColor(color){
                this.clipartContainer.css("color",color);
            }
        });
        
        
    });
}(jQuery))