(function($){
    mxBuilder.ImageComponent = function ImageComponent(instance){
        var self = this;
        mxBuilder.Component.apply(this,[{
            ID: "image-component",
            title: "Image Component",
            draggable: {},
            resizable: {},
            ctxZIndex: true,
            ctxEditableBorder: true,
            ctxEditableBackground: true,
            selectable: true,
            instance: instance
        }]);
        self.theImage = instance.find("img").addClass("apply-border").css({
            position: 'absolute'
        });
        instance.addClass("image-component-instance").css({
            overflow: 'hidden'
        }).on({
            componentDropped: function(){
                self.setImageSize("thumb");
                self.instance.css({width: self.theImage.width() + 'px', height: self.theImage.height() + 'px'});
            },
            borderWidthChanged: function(){
                instance.width(self.theImage.outerWidth());
                instance.height(self.theImage.outerHeight());
            },
            selected: function(){
                mxBuilder.activeStack.push(instance);
            },
            dblclick: function(){
                mxBuilder.components.getComponent(instance).openBackgroundStyleDialog();
            },
            resize: function(event,ui){
                var wDiv = self.instance.width();
                var hDiv = self.instance.height();
                
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
                            console.log("equal size");
                        }
                        break;
                    case "center": 
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
            mousedown: function(event){
                if(event.which === 3){
                    mxBuilder.contextmenu.getMainCtx().addSubgroup({
                        label: "Resize Method"
                    }).addItem({
                        label: "Stretch",
                        checked: self.getResizeMethod() == "stretch",
                        callback: function(){
                            self.setResizeMethod("stretch");
                            self.instance.resizable("option","aspectRatio",false);
                        }
                    }).addItem({
                        label: "Center",
                        checked: self.getResizeMethod() == "center",
                        callback: function(){
                            self.setResizeMethod("center");
                            self.instance.resizable("option","aspectRatio",false);
                        }
                    }).addItem({
                        label: "Lock Ratio",
                        checked: self.getResizeMethod() == "ratio",
                        callback: function(){
                            self.setResizeMethod("ratio");
                            var imageRatio = self.getImageObj().ratio;
                            if(imageRatio > 1){
                                self.theImage.height(self.theImage.width()/imageRatio);
                                self.instance.height(self.theImage.outerHeight());
                            } else {
                                self.theImage.width(self.theImage.height()*imageRatio);
                                self.instance.width(self.theImage.outerWidth());
                            }
                            mxBuilder.selection.revalidateSelectionContainer();
                            self.instance.resizable("option","aspectRatio",imageRatio);
                        }
                    }).addItem({
                        label: "Crop",
                        checked: self.getResizeMethod() == "crop",
                        callback: function(){
                            self.setResizeMethod("crop");
                            self.instance.resizable("option","aspectRatio",false);
                        }
                    })
                }
            }
        });
    }
    $.extend(mxBuilder.ImageComponent.prototype,new mxBuilder.Component(),{
        __currentSize: "small",
        __currentResizeMethod: "stretch",
        theImage:  null,
        getImageObj: function(){
            return mxBuilder.assets.getFromContainer(this.instance);
        },
        setImageSize: function(newSize) {
            var imageObj = this.getImageObj();
            if(imageObj[newSize] && this.__currentSize != newSize){
                this.__currentSize = newSize;
                this.theImage.attr("src",imageObj.location+"/"+imageObj[newSize]);
                mxBuilder.selection.revalidateSelectionContainer();
                return true;
            }
            return false;
        },
        getImageSize: function(){
            return this.__currentSize;
        },
        getResizeMethod: function(){
            return this.__currentResizeMethod;
        },
        setResizeMethod: function(method){
            this.__currentResizeMethod = method;
        }
    });
    
    
}(jQuery))