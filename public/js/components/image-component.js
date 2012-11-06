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
            properties.element.addClass("image-component-element").find(".image").css({
                overflow: 'hidden',
                position:"relative",
                width:"100%",
                height:"100%"
            }).end().on({
                componentDropped: function componentDropped(){
                    self.setImageSize("thumb");
                    self.element.css({
                        width: self.theImage.width() + 'px', 
                        height: self.theImage.height() + 'px'
                    });
                },
                borderWidthChanged: function borderWidthChanged(){
                    properties.element.width(properties.element.find(".image").outerWidth());
                    properties.element.height(properties.element.find(".image").outerHeight());
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
                    if(event.which === 3 && mxBuilder.selection.isAllSelectedSameType()){
                        var resizeMethod = {};
                        mxBuilder.selection.getSelection().each(function(){
                            resizeMethod[mxBuilder.components.getComponent(this).getResizeMethod()] = true;
                        });
                        resizeMethod = Object.keys(resizeMethod);
                        resizeMethod = resizeMethod.length == 1 ? resizeMethod[0] : false;
                        
                        mxBuilder.contextmenu.getMainCtx().addSubgroup({
                            label: "Resize Method"
                        }).addItem({
                            label: "Stretch",
                            checked: resizeMethod == "stretch",
                            callback: function(){
                                mxBuilder.selection.each(function(element){
                                    this.setResizeMethod("stretch");
                                });
                            }
                        }).addItem({
                            label: "Lock Ratio",
                            checked: resizeMethod == "ratio",
                            callback: function(){
                                mxBuilder.selection.each(function(){
                                    this.setResizeMethod("ratio");
                                });
                            }
                        }).addItem({
                            label: "Crop",
                            checked: resizeMethod == "crop",
                            callback: function(){
                                mxBuilder.selection.each(function(){
                                    this.setResizeMethod("crop");
                                });
                            }
                        }).end()
                        .addItem({
                            label: "Change image title...",
                            callback: function(){
                                mxBuilder.dialogs.imageComponentChangeTitle.show(mxBuilder.selection.getSelection());
                            }
                        }).addItem({
                            label: "Link To...",
                            callback: function(){
                                var currentLinkObj = self.getLinkObj();
                                mxBuilder.dialogs.linkTo.show({
                                    link: function(urlObj){
                                        mxBuilder.selection.each(function(){
                                            this.setLinkObj(urlObj);
                                        });
                                    },
                                    unlink: function(){
                                        mxBuilder.selection.each(function(){
                                            this.setLinkObj(null);
                                        });
                                    },
                                    lightbox: true,
                                    urlObj: currentLinkObj
                                });
                            }
                        });
                    }
                }
            });
            
            this.setResizeMethod(this.__currentResizeMethod);
            
        }
        $.extend(mxBuilder.ImageComponent.prototype,new mxBuilder.Component(),{
            __currentSize: "small",
            __currentResizeMethod: "ratio",
            template: mxBuilder.layout.templates.find(".image-component-instance").remove(),
            theImage:  null,
            getImageObj: function getImageObj(){
                return mxBuilder.assets.get(this.extra.originalAssetID);
            },
            getBiggestSize: function getBiggestSize(){
                var imgObj = this.getImageObj();
                if(imgObj.full)
                    return "full";
                else if (imgObj.medium)
                    return "medium";
                else if (imgObj.small)
                    return "small";
                else {
                    return "thumb";
                }
            },
            getClosestSize: function getClosestSize(size,directionUp){
                var imgObj = this.getImageObj();
                var sizes = ["full","medium","small","thumb"];
                
                if(directionUp){
                    sizes.reverse();
                }
                var start = false;
                for(var s in sizes){
                    if(sizes[s] == size){
                        start = true;
                    }
                    if(start && imgObj[sizes[s]]){
                       return sizes[s]; 
                    }
                }
                return false;
            },
            getAssetID: function getAssetID(){
                return this.extra.originalAssetID;
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
                switch(method){
                    case "stretch":
                        this.element.resizable("option","aspectRatio",false).trigger("resize"); 
                        break;
                    case "center":
                        this.element.resizable("option","aspectRatio",false).trigger("resize");
                        break;
                    case "ratio":
                        var imageRatio = this.getImageObj().ratio;
                        if(imageRatio > 1){
                            this.theImage.height(this.theImage.width()/imageRatio);
                            this.element.css({
                                height: this.theImage.outerHeight(),
                                width: this.theImage.outerWidth()
                            });
                        } else {
                            this.theImage.width(this.theImage.height()*imageRatio);
                            this.element.css({
                                height: this.theImage.outerHeight(),
                                width: this.theImage.outerWidth()
                            });
                        }
                        mxBuilder.selection.revalidateSelectionContainer();
                        this.element.resizable("option","aspectRatio",imageRatio).trigger("resize");
                        break;
                    case "crop":
                        this.element.resizable("option","aspectRatio",false).trigger("resize");
                        break;
                }
            },
            setLinkObj: function setLinkObj(obj){
                this.linkObj = obj;
            }, 
            getLinkObj: function getLinkObj(){
                return this.linkObj;
            },
            save: function save(){
                var out = mxBuilder.Component.prototype.save.call(this);
                out.data.__currentSize = this.__currentSize;
                out.data.__currentResizeMethod = this.__currentResizeMethod;
                out.data.linkObj = this.linkObj;
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
                    
                    properties.data.__currentSize = properties.data.__currentSize ? properties.data.__currentSize : this.getClosestSize("small");
                    
                    properties.element = this.template.clone().find("img")
                    .attr({
                        src: obj.location+"/"+obj[properties.data.__currentSize],
                        title: obj.title
                    })
                    .css({
                        width: properties.css.width,
                        height: properties.css.height
                    })
                    .end()
                    .css(properties.css)
                    .appendTo(mxBuilder.layout[properties.data.container]);
                }
            },
            publish: function publish(){
                var out = mxBuilder.Component.prototype.publish.call(this)
                var obj = this.getImageObj();
                var img = out.find("img").attr("src","images/"+obj[this.getImageSize()]);
                
                var linkObj = this.getLinkObj();
                if(linkObj){
                    var url = "";
                    if(linkObj.type !== "lightbox"){
                        switch(linkObj.type){
                            case "external":
                                url = linkObj.url;
                                break;
                            case "page":
                                var pageObj = mxBuilder.pages.getPageObj(linkObj.pageID);
                                url = pageObj.address+".html";
                                break;
                        }
                        img.wrap('<a href="'+url+'" target="_blank"/>');
                    } else {
                        img.wrap('<a href="images/'+obj[this.getBiggestSize()]+'" class="lightbox"/>');
                    }
                }
                
                return out;
            }
        });
    });
    
}(jQuery))