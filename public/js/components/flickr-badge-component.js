(function($){
    $(function(){
        mxBuilder.FlickrBadgeComponent = function FlickrBadgeComponent(properties){
            var instance = this;
            this.init(properties);
            mxBuilder.Component.apply(this,[{
                type: "FlickrBadgeComponent",
                draggable: {},
                resizable: {},
                editableZIndex: true,
                pinnable: true,
                deletable: true,
                hasSettings: true,
                selectable: true,
                element: properties.element
            }]);
    
            properties.element.on({
                componentInit: function(){
                    instance.render();
                },
                selected: function(){
                    mxBuilder.activeStack.push(properties.element);
                },
                resizestart: function(){
                    $(this).data("intial-position",$(this).position());
                },
                resize: function(event){
                    var imagesContainerHeight = instance.imagesContainer.height();
                    var minWidth;
                    switch(instance.imgSize){
                        case "s":
                            minWidth = 75;
                            break;
                        case "t":
                            minWidth = 100;
                            break;
                        case "m":
                            minWidth = 240;
                            break;
                    }
                    //adding the margin to the minWidth
                    minWidth += 6;
                    
                    var styles = {};
                    
                    if(imagesContainerHeight > instance.element.height()){
                        styles.height = imagesContainerHeight;
                    }
                    if(instance.element.width() < minWidth){
                        styles.width = minWidth;
                    }
                    
                    if(Object.keys(styles).length > 0){
                        $.extend(styles,instance.element.data("intial-position"));
                        instance.element.css(styles);
                    }
                    
                    mxBuilder.selection.revalidateSelectionContainer();
                }
            });
            
            this.imagesContainer = this.element.find(".images");
        }
        $.extend(mxBuilder.FlickrBadgeComponent.prototype, new mxBuilder.Component(), {
            template: mxBuilder.layout.templates.find(".flexly-flickr-badge-component-instance").remove(),
            count: 5,
            display: "latest",
            imgSize: "t",
            user: "80023452@N03",
            imagesContainer: null,
            render: function render(){
                var instance = this;
                var src = "http://www.flickr.com/badge_code_v2.gne?show_name=0";
                src += "&count="+this.count; 
                src += "&display="+this.display;
                src += "&size="+this.imgSize;
                src += "&layout=h";
                src += "&source=user&user="+this.user;
                
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = src;
                $(script).on({
                    load: function(){
                        var theImages = $(b_txt).find('img');
                        theImages.addClass("flickr-badge-img");
                        instance.imagesContainer.empty().append(theImages);
                        instance.element.width(instance.imagesContainer.outerWidth(true));
                        instance.element.height(instance.imagesContainer.outerHeight(true));
                        delete b_txt;
                        mxBuilder.selection.revalidateSelectionContainer();
                    }
                });
                this.imagesContainer.get(0).appendChild(script);
            },
            save: function save(){
                var out = mxBuilder.Component.prototype.save.call(this);
                out.data.count = this.count;
                out.data.display = this.display;
                out.data.user = this.user;
                out.data.imgSize = this.imgSize;
                return out;
            },
            publish: function publish(){
                var out = mxBuilder.Component.prototype.publish.call(this);
                out.attr({
                    "data-count": this.count,
                    "data-display": this.display,
                    "data-imgsize": this.imgSize,
                    "data-user": this.user
                });
                out.find(".images").empty();
                return out;
            },
            getHeadIncludes: function getHeadIncludes(){
                var out = mxBuilder.Component.prototype.getHeadIncludes.call(this);
                out.scripts.flickrBadgeLoader = "public/js-published/flickr-badge-loader.js";
                out.css.flickrBadge = "public/css-published/flickr-badge.css";
                return out;
            },
            init: function init(properties){
                mxBuilder.Component.prototype.init.call(this,properties);                
            },
            getBorder: function getBorder(element){
                return mxBuilder.Component.prototype.getBorder.call(this,this.element);
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
                out.flickrBadgeSettings = {
                    panel: mxBuilder.layout.settingsPanels.flickrBadge,
                    params: true
                };
                return out;
            },
            getSettings: function getSettings(){
                return {
                    count: this.count,
                    imgSize: this.imgSize,
                    user: this.user,
                    display: this.display
                }
            }
        });
        
        var widgets = mxBuilder.menuManager.menus.widgets;
        widgets.addComponent("root",{
            icon: "flexly-icon-box-component",
            title: "Flickr Badge",
            draggableSettings: {
                grid: mxBuilder.properties.gridSize,
                helper: function(event){
                    var theContent = mxBuilder.FlickrBadgeComponent.prototype.template.clone()
                    .addClass("mx-helper")
                    .data("component","FlickrBadgeComponent")
                    .appendTo(mxBuilder.layout.container);
                    return theContent;
                }
            }
        });
    });
}(jQuery))