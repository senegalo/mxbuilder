(function($){
    
    $(function(){
        mxBuilder.ImageComponent = function ImageComponent(properties){
            var self = this;
        
            self.init(properties);
            
            this.element.on({
                
                });
        
            mxBuilder.Component.apply(this,[{
                type: "ImageComponent",
                draggable: {},
                resizable: {},
                editableZIndex: true,
                selectable: true,
                element: properties.element
            }]);
            self.theImage.css({
                position: 'absolute'
            });
            properties.element.addClass("image-component-element").find(".image").css({
                overflow: 'hidden',
                position:"relative",
                width:"100%",
                height:"100%"
            }).end().on({
                componentDropped: function componentDropped(){
                    self.setImageSize("small");
                },
                selected: function selected(){
                    mxBuilder.activeStack.push(properties.element);
                },
                dblclick: function dblclick(){
                //                    mxBuilder.dialogs.imageComponentChangeTitle.show(self.element);
                },
                resize: function resize(event,ui){
                    var wDiv = self.element.width();
                    var hDiv = self.element.height();
                
                    var ratioDiv = wDiv/hDiv;
                
                    var imgSource = self.getResizeMethod() == "crop" ? self.theImageContainer : self.theImage;
                
                    var wImg = imgSource.outerWidth(true);
                    var hImg = imgSource.outerHeight(true);
                    var imageOuterLength = wImg - imgSource.width();
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
                            wImg = wDiv-imageOuterLength;
                            hImg = hDiv-imageOuterLength;
                    }
                
                    self.theImage.width(wImg);
                    self.theImage.height(hImg);
                    
                    if(self.getResizeMethod() != "crop"){
                        self.theImage.css({
                            top: ((hDiv - hImg - imageOuterLength) / 2) + 'px', 
                            left: ((wDiv - wImg - imageOuterLength) / 2) + 'px'
                        });
                    } else {
                        self.theImageContainer.css({
                            backgroundPosition: ((wDiv - wImg - imageOuterLength) / 2) +"px "+((hDiv - hImg - imageOuterLength) / 2) + "px",
                            backgroundSize: wImg+"px "+hImg+"px"
                        });
                        self.theImageContainer.outerHeight(self.element.height());
                        self.theImageContainer.outerWidth(self.element.width());
                    }
                
                    //Change source if necessary
                    var size = mxBuilder.imageUtils.getImageSource(self.getImageSize(), self.element);
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
                        
                        var ctx = mxBuilder.contextmenu.allowPropagation().getMainCtx().addSubgroup({
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
                                    imageBox: true,
                                    urlObj: currentLinkObj
                                });
                            }
                        });
                        if(mxBuilder.selection.getSelectionCount() > 1){
                            ctx.addSubgroup({
                                label: "Transform to"
                            }).addItem({
                                label: "Grid Gallery",
                                callback: function callback(){
                                    mxBuilder.imageUtils.createGalleryFromSelected("ImageGridComponent");
                                }
                            }).addItem({
                                label: "Slider Gallery",
                                callback: function callback(){
                                    mxBuilder.imageUtils.createGalleryFromSelected("ImageSliderComponent");
                                }
                            }).end()
                        }                        
                        ctx.stopPropagation();
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
            theImageContainer: null,
            getSettings: function getSettings(){
                var imgObj = this.getImageObj();
                return {
                    name: imgObj.name,
                    title: imgObj.title,
                    caption: imgObj.caption
                };
            },
            getImageObj: function getImageObj(){
                var obj = mxBuilder.assets.get(this.extra.originalAssetID);
                return obj?obj:mxBuilder.assets.get(0);
            },
            getBiggestSize: function getBiggestSize(){
                var imgObj = this.getImageObj();
                return mxBuilder.imageUtils.getBiggestImageSize(imgObj.id);
            },
            getClosestSize: function getClosestSize(size,directionUp){
                var imgObj = this.getImageObj();
                return mxBuilder.imageUtils.getClosestImageSize(imgObj.id, size, directionUp);
            },
            getAssetID: function getAssetID(){
                return this.extra.originalAssetID;
            },
            setImageSize: function setImageSize(newSize) {
                var imageObj = this.getImageObj();
                if(imageObj[newSize] && this.__currentSize != newSize){
                    this.__currentSize = newSize;
                    if(this.getResizeMethod() != "crop"){
                        this.theImage.attr("src",imageObj.location+"/"+imageObj[newSize]);
                    } else {
                        this.theImageContainer.css({
                            backgroundImage: 'url("'+imageObj.location+"/"+imageObj[newSize]+'")'
                        });
                    }
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
                if(method == "crop"){
                    this.setCropResize();
                } else {
                    this.unsetCropResize();
                }
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
            setCropResize: function setCropResize(){
                if(this.theImage.is(":visible")){
                    var styles = {
                        backgroundImage: 'url("'+this.theImage.attr("src")+'")',
                        border: this.theImage.css("border"),
                        borderRadius: this.theImage.css("border-radius"),
                        backgroundRepeat: "no-repeat"
                    }
                    
                    this.theImageContainer.outerHeight(this.element.height());
                    this.theImageContainer.outerWidth(this.element.width());
                    this.theImage.hide();
                    var imageContainer = this.theImageContainer;
                    imageContainer.css(styles);
                }
            },
            unsetCropResize: function unsetCropResize(){
                if(!this.theImage.is(":visible")){
                    var imageContainer = this.theImageContainer;
                    this.setImageSize(this.__currentSize);
                    var styles = {
                        border: imageContainer.css("border"),
                        borderRadius: imageContainer.css("borderRadius")
                    }
                    this.theImageContainer.css({
                        backgroundImage: '',
                        border: '',
                        borderRadius: '',
                        backgroundRepeat: "no-repeat",
                        width: "100%",
                        height: "100%"
                    });
                    this.theImage.css(styles);
                    this.theImage.show();
                }
            },
            setLinkObj: function setLinkObj(obj){
                this.linkObj = obj;
            }, 
            getLinkObj: function getLinkObj(){
                if(this.linkObj && this.linkObj.type == "page" && !mxBuilder.pages.getPageObj(this.linkObj.pageID)){
                    this.linkObj = null;
                }
                return this.linkObj;
            },
            getBorder: function getBorder(){
                return mxBuilder.Component.prototype.getBorder(this.theImage);
            },
            setBorder: function setBorder(obj){
                var theImage = this.getResizeMethod() == "crop" ? this.theImageContainer : this.theImage;
                theImage.css(obj);
                
                //apply it to the image eitherway !
                this.theImage.css(obj);
                
                theImage.outerWidth(this.element.width());
                theImage.outerHeight(this.element.height());
                this.revalidateShadow();
                mxBuilder.selection.revalidateSelectionContainer();
            },
            applyShadow: function applyShadow(id,element){
                var theImage = this.getResizeMethod() == "crop" ? this.theImageContainer : this.theImage
                
                mxBuilder.shadowManager.applyShadow({
                    id: id,
                    element: element,
                    leftRadius: theImage.css("borderBottomLeftRadius"),
                    rightRadius: theImage.css("borderBottomRightRadius")
                });
            },
            cleanDeadLinksFromSaveObj: function cleanDeadLinksFromSaveObj(saveObj,pageID){
                if(saveObj.data.linkObj && saveObj.data.linkObj.type == "page" && saveObj.data.linkobj.pageID == pageID){
                    delete saveObj.data.linkObj;
                }
                return saveObj;
            },
            updateImageInfo: function updateImageInfo(){
                this.theImage.attr("title",this.getImageObj().title);
            },
            save: function save(){
                var out = mxBuilder.Component.prototype.save.call(this);
                out.data.__currentSize = this.__currentSize;
                out.data.__currentResizeMethod = this.__currentResizeMethod;
                out.data.linkObj = this.linkObj;
                out.data.extra = {
                    originalAssetID: this.extra.originalAssetID
                }
                out.data.border = this.getBorder();
                return out;
            },
            init: function init(properties){
                $.extend(this,properties.data);
                if(typeof properties.element == "undefined"){
                    var obj = this.getImageObj();
                    
                    $.extend({
                        height: 300/obj.ratio,
                        width: 300
                    },properties.css)
                    
                    if(typeof properties.css.width == "undefined" || typeof properties.css.height == "undefined"){
                        if(obj.ratio > 1){
                            properties.css.width = 300;
                            properties.css.height = 300/obj.ratio;
                        } else {
                            properties.css.height = 300;
                            properties.css.width = 300/obj.ratio;
                        }
                    }
                    
                    properties.data.__currentSize = properties.data.__currentSize ? properties.data.__currentSize : this.getClosestSize("small");
                    
                    this.element = properties.element = this.template.clone().find("img")
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
                    
                    this.theImage = this.element.find("img");
                    this.theImageContainer = this.element.find(".image");
                    
                    if(properties.data.border){
                        this.setBorder(properties.data.border);
                    }
                }
                this.revalidateShadow();
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
                        img.wrap('<a href="'+url+'" '+(linkObj.newWindow?'target="_blank"':'')+'/>');
                    } else {
                        img.wrap('<a href="images/'+obj[this.getBiggestSize()]+'" class="lightbox"/>');
                    }
                }
                
                return out;
            },
            getSettingsPanels: function getSettingsPanels(){
                var out = mxBuilder.Component.prototype.getSettingsPanels.call(this);
                delete out.background;
                return out;
            }
        });
    });
    
}(jQuery))