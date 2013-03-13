(function($){
    $(function(){
        mxBuilder.YoutubeComponent = function YoutubeComponent(properties){
            var instance = this;
            this.init(properties);
            mxBuilder.Component.apply(this,[{
                type: "YoutubeComponent",
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
    
            properties.element.on({
                selected: function(){
                    mxBuilder.activeStack.push(properties.element);
                },
                resize: function(){
                    instance.revalidate();
                }
            });
            
            this.videoContainer = this.element.find(".video");
            
            this.rebuild();
        }
        $.extend(mxBuilder.YoutubeComponent.prototype, new mxBuilder.Component(), {
            template: mxBuilder.layout.templates.find(".youtube-component-instance").remove(),
            videoID: "d-1xU0VfJ-g",
            autoplay: false,
            videoContainer: null,
            rebuild: function rebuild(){
                this.videoContainer.empty()
                .append('<iframe width="'+this.element.width()+'" height="'+this.element.height()
                    +'" src="http://www.youtube.com/embed/'+this.videoID+(this.autoplay?"?autoplay=1&wmode=transparent":"?wmode=transparent")
                    +'" frameborder="0" allowfullscreen></iframe>')
                this.element.find(".overlay").height(this.element.height()-39);
                mxBuilder.selection.revalidateSelectionContainer();
            },
            revalidate: function revalidate(){
                this.videoContainer.find("iframe").attr({
                    width: this.element.width(),
                    height: this.element.height()
                });
                this.element.find(".overlay").height(this.element.height()-39);
            },
            save: function save(){
                var out = mxBuilder.Component.prototype.save.call(this);
                out.data.videoID = this.videoID;
                out.data.autoplay = this.autoplay;
                return out;
            },
            publish: function publish(){
                return mxBuilder.Component.prototype.publish.call(this).find(".overlay").remove().end();
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
                out.youtube = {
                    panel: mxBuilder.layout.settingsPanels.youtube,
                    params: true
                };
                    
                delete out.background;
                
                return out;
            },
            getSettings: function getSettings(){
                var out = mxBuilder.Component.prototype.getSettings.call(this);
                $.extend(out,{
                    videoID: this.videoID,
                    autoplay: this.autoplay
                });
                return out;
            },
            setWidth: function setWidth(val){
                mxBuilder.Component.prototype.setWidth.call(this,val);
                this.revalidate();
            },
            setHeight: function setHeight(val){
                mxBuilder.Component.prototype.setHeight.call(this,val);
                this.revalidate();
            }
        });
        
        var widgets = mxBuilder.menuManager.menus.widgets;
        widgets.addComponent("root",{
            icon: "flexly-icon-box-component",
            title: "Youtube Video",
            draggableSettings: {
                helper: function(event){
                    var theContent = $('<div><img src="public/images/youtube.png"/></div>')
                    .addClass("mx-helper")
                    .data("component","YoutubeComponent")
                    .appendTo(mxBuilder.layout.container);
                    return theContent;
                }
            }
        });
    });
}(jQuery))