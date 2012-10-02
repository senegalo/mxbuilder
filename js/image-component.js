(function($){
    
    $(function(){
        mxBuilder.ImageComponent = function ImageComponent(properties){
            var self = this;
        
            self.init(properties);
        
            mxBuilder.Component.apply(this,[{
                type: "ImageComponent",
                draggable: {},
                resizable: {},
                ctxZIndex: true,
                ctxEditableBorder: true,
                selectable: true,
                element: properties.element
            }]);
            self.theImage = properties.element.find("img").css({
                position: 'absolute'
            });
            properties.element.addClass("image-component-element").css({
                overflow: 'hidden'
            }).on({
                componentDropped: function componentDropped(){
                    self.setImageSize("thumb");
                    self.element.css({
                        width: self.theImage.width() + 'px', 
                        height: self.theImage.height() + 'px'
                    });
                },
                borderWidthChanged: function borderWidthChanged(){
                    properties.element.width(self.theImage.outerWidth());
                    properties.element.height(self.theImage.outerHeight());
                },
                selected: function selected(){
                    mxBuilder.activeStack.push(properties.element);
                },
                dblclick: function dblclick(){
                    mxBuilder.dialogs.imageComponentChangeTitle.show(self.element);
                },
                resize: function resize(event,ui){
                    var wDiv = self.element.width();
                    var hDiv = self.element.height();
                
                    var ratioDiv = wDiv/hDiv;
                    var sourceSwitchMargin = 10;
                
                    var wImg = self.theImage.width();
                    var hImg = self.theImage.height();
                    var ratioImg = self.getImageObj().ratio;
                
                    //Implementing different resize methods
                    switch(self.getResizeMethod()){
                        case "crop":
                            if (ratioDiv < ratioImg) {
                                hImg = hDiv;
                                wImg = hDiv * ratioImg;
                            } else if (ratioDiv > ratioImg) {
                                wImg = wDiv;
                                hImg = wDiv / ratioImg;
                            } else {
                                wImg = wDiv;
                                hImg = hDiv;
                            }
                            break;
                        case "center":
                            if (ratioDiv > ratioImg) {
                                hImg = hDiv;
                                wImg = hDiv * ratioImg;
                            } else if (ratioDiv < ratioImg) {
                                wImg = wDiv;
                                hImg = wDiv / ratioImg;
                            } else {
                                wImg = wDiv;
                                hImg = hDiv;
                            }
                            break;
                        case "ratio":
                        case "stretch":
                            wImg = wDiv;
                            hImg = hDiv;
                    }
                
                    self.theImage.width(wImg);
                    self.theImage.height(hImg);
                    self.theImage.css({
                        top: ((hDiv - hImg) / 2) + 'px', 
                        left: ((wDiv - wImg) / 2) + 'px'
                    });
                
                    //Change source if necessary
                    var length = ratioDiv < 1 ? hDiv : wDiv;
                
                    var size = "";
                    if(self.getImageSize() == "thumb" && length > 100+sourceSwitchMargin){
                        size = "small";
                    } else if (self.getImageSize() == "small" && length <= 100){
                        size = "thumb";
                    } else if(self.getImageSize() == "small" && length >= 300+sourceSwitchMargin){
                        size = "medium";
                    } else if(self.getImageSize() == "medium" && length <= 300){
                        size = "small";
                    } else if(self.getImageSize() == "medium" && length >= 500+sourceSwitchMargin){
                        size = "full";
                    } else if(self.getImageSize() == "full" && length <= 500){
                        size = "medium";
                    }
                    self.setImageSize(size, wImg, hImg);
                
                },
                mousedown: function mousedown(event){
                    if(event.which === 3){
                        mxBuilder.contextmenu.getMainCtx().addSubgroup({
                            label: "Resize Method"
                        }).addItem({
                            label: "Stretch",
                            checked: self.getResizeMethod() == "stretch",
                            callback: function(){
                                self.setResizeMethod("stretch");
                                self.element.resizable("option","aspectRatio",false).trigger("resize");
                            }
                        }).addItem({
                            label: "Center",
                            checked: self.getResizeMethod() == "center",
                            callback: function(){
                                self.setResizeMethod("center");
                                self.element.resizable("option","aspectRatio",false).trigger("resize");
                            }
                        }).addItem({
                            label: "Lock Ratio",
                            checked: self.getResizeMethod() == "ratio",
                            callback: function(){
                                self.setResizeMethod("ratio");
                                var imageRatio = self.getImageObj().ratio;
                                if(imageRatio > 1){
                                    self.theImage.height(self.theImage.width()/imageRatio);
                                    self.element.height(self.theImage.outerHeight());
                                } else {
                                    self.theImage.width(self.theImage.height()*imageRatio);
                                    self.element.width(self.theImage.outerWidth());
                                }
                                mxBuilder.selection.revalidateSelectionContainer();
                                self.element.resizable("option","aspectRatio",imageRatio).trigger("resize");
                            }
                        }).addItem({
                            label: "Crop",
                            checked: self.getResizeMethod() == "crop",
                            callback: function(){
                                self.setResizeMethod("crop");
                                self.element.resizable("option","aspectRatio",false).trigger("resize");
                            }
                        }).end()
                        .addItem({
                            label: "Change image title...",
                            callback: function(){
                                mxBuilder.dialogs.imageComponentChangeTitle.show(self.element);
                            }
                        }).addItem({
                            label: "Link To...",
                            callback: function(){
                                mxBuilder.dialogs.linkTo.show({
                                    link: function(urlObj){
                                        self.link = urlObj;
                                    },
                                    unlink: function(){
                                        self.link = null;
                                    }
                                });
                            }
                        })
                    }
                }
            });
        }
        $.extend(mxBuilder.ImageComponent.prototype,new mxBuilder.Component(),{
            __currentSize: "small",
            __currentResizeMethod: "stretch",
            template: mxBuilder.layout.templates.find(".image-component-instance").remove(),
            theImage:  null,
            getImageObj: function getImageObj(){
                return mxBuilder.assets.get(this.extra.originalAssetID);
            },
            setImageSize: function setImageSize(newSize) {
                var imageObj = this.getImageObj();
                if(imageObj[newSize] && this.__currentSize != newSize){
                    this.__currentSize = newSize;
                    this.theImage.attr("src",imageObj.location+"/"+imageObj[newSize]);
                    mxBuilder.selection.revalidateSelectionContainer();
                    return true;
                }
                return false;
            },
            getImageSize: function getImageSize(){
                return this.__currentSize;
            },
            getResizeMethod: function getResizeMethod(){
                return this.__currentResizeMethod;
            },
            setResizeMethod: function setResizeMethod(method){
                this.__currentResizeMethod = method;
            },
            save: function save(){
                var out = mxBuilder.Component.prototype.save.call(this);
                out.data.__currentSize = this.__currentSize;
                out.data.__currentResizeMethod = this.__currentReiszeMethod;
                out.data.extra = {
                    originalAssetID: this.extra.originalAssetID
                }
                return out;
            },
            init: function init(properties){
                $.extend(this,properties.data);
                if(typeof properties.element == "undefined"){
                    var obj = this.getImageObj();
                    
                    $.extend({
                        height: 100/obj.ratio,
                        width: 100
                    },properties.css)
                    
                    if(typeof properties.css.width == "undefined" || typeof properties.css.height == "undefined"){
                        if(obj.ratio > 1){
                            properties.css.width = 100;
                            properties.css.height = 100/obj.ratio;
                        } else {
                            properties.height = 100;
                            properties.css.width = 100/obj.ratio;
                        }
                    }
                    
                    properties.data.__currentSize = properties.data.__currentSize ? properties.data.__currentSize : "small";
                    
                    properties.element = this.template.clone().find("img")
                    .attr("src",obj.location+"/"+obj[properties.data.__currentSize])
                    .css({
                        width: properties.css.width,
                        height: properties.css.height
                    })
                    .end()
                    .css(properties.css)
                    .appendTo(mxBuilder.layout[properties.data.container]);
                }
            }
        });
    });
    
}(jQuery))