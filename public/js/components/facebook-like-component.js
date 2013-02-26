(function($){
    
    $(function(){
        mxBuilder.FBLikeComponent = function FBLikeComponent(properties){
            this.init(properties);
            
            var instance = this;
            
            mxBuilder.Component.apply(this,[{
                type: "FBLikeComponent",
                draggable: {
                    iframeFix: true
                },
                editableZIndex: true,
                selectable: true,
                element: properties.element
            }]);
        
            this.element.on({
                selected: function selected(){
                    instance.revalidate();
                }
            });
            
        }
        $.extend(mxBuilder.FBLikeComponent.prototype,new mxBuilder.Component(), {
            counterPosition: "button_count",
            action: "like",
            template: mxBuilder.layout.templates.find(".fb-like-component-instance").remove(),
            init: function init(properties){
                mxBuilder.Component.prototype.init.call(this,properties);
                this.rebuild(properties.element);
            },
            publish: function publish(){       
                var out = mxBuilder.Component.prototype.publish.call(this);
                out.empty().append(this.rebuild(false));
                return out;
            },
            getHeadIncludes: function getHeadIncludes(){
                return {
                    scripts: {
                        "fbLoader": "public/js-libs/facebook-loader.js",
                        "fbParser": "public/js-published/facebook-parser.js"
                    },
                    css: {}
                }
            },
            getSettingsPanels: function getSettingsPanels(){
                return {
                    fbButton: {
                        panel:mxBuilder.layout.settingsPanels.fbButton,
                        params: true
                    }
                };
            },
            setCounterPosition: function setCounterPosition(pos){
                this.counterPosition = pos == "horizontal" ? "button_count" : "box_count";
                this.rebuild();
            },
            setAction: function setAction(action){
                this.action = action;
            },
            rebuild: function rebuild(element){
                
                var instance = this;
                var width,height;
                    
                if(this.counterPosition == "horizontal"){
                    width = 90;
                    height = 20;
                } else {
                    width = 55;
                    height = 65;
                }
                    
                var str = '<fb:like';
                str += ' width = "'+width+'" height = "'+height+'"';
                str += ' layout="'+this.counterPosition+'"';
                str += ' action="'+this.action+'"></fb:like>';
                
                if(element === false){
                    return $(str);
                }
                
                element= element ? element : this.element;
                element.find(".button").empty().append(str);
                
                if(typeof FB == "undefined"){
                    $(document.body).on({
                        fbReady: function(){
                            instance.parse();
                        }
                    });
                } else {
                    instance.parse();
                }
            },
            parse: function parse(element){
                var instance = this;
                element = element ? element : this.element;
                FB.XFBML.parse(element.get(0),function(){
                    instance.revalidate(element);
                });
            },
            revalidate: function revalidate(element){
                element = element ? element : this.element;
                var theButton = element.find(".button").children(":first");
                var theHeight = theButton.height();
                var theWidth = theButton.width();
                
                element.css({
                    height: theHeight,
                    width: theWidth
                });
                mxBuilder.selection.revalidateSelectionContainer();
            },
            getSettings: function getSettings(){
                return {
                    counterPosition: this.counterPosition,
                    action: this.action
                }
            },
            save: function save(){
                var out = mxBuilder.Component.prototype.save.call(this);
                out.data.counterPosition = this.counterPosition;
                out.data.action = this.action;
                return out;
            }
        });
        
        var widgets = mxBuilder.menuManager.menus.widgets;
        widgets.addComponent("root",{
            icon: "flexly-icon-box-component",
            title: "Facebook Like Button",
            draggableSettings: {
                helper: function(event){
                    var theContent = $('<div><img src="public/images/facebook.png"/></div>')
                    .addClass("mx-helper")
                    .data("component","FBLikeComponent")
                    .appendTo(mxBuilder.layout.container);
                    return theContent;
                }
            }
        }); 
    });
    
}(jQuery));