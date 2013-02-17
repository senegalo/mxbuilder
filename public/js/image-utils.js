(function($){
    
    $(function(){
        mxBuilder.imageUtils = {
            getBiggestImageSize: function(id){
                var imgObj = mxBuilder.assets.get(id);
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
            getClosestImageSize: function(id,size,directionUp){
                var imgObj = mxBuilder.assets.get(id);
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
            getImageSource: function(currentThumbSize,element){
                var elementWidth = element.width();
                var elementHeight = element.height();
                
                //Deciding which size to use !
                var length = elementWidth/elementHeight < 1 ? elementHeight : elementWidth;
                var sourceSwitchMargin = 10;
                var thumbSize = "small";
                if(thumbSize == "thumb" && length > 100+sourceSwitchMargin){
                    thumbSize = "small";
                } else if (thumbSize == "small" && length <= 100){
                    thumbSize = "thumb";
                } else if(thumbSize == "small" && length >= 300+sourceSwitchMargin){
                    thumbSize = "medium";
                } else if(thumbSize == "medium" && length <= 300){
                    thumbSize = "small";
                } else if(thumbSize == "medium" && length >= 500+sourceSwitchMargin){
                    thumbSize = "full";
                } else if(thumbSize == "full" && length <= 500){
                    thumbSize = "medium";
                }
                return thumbSize;
            },
            getImageCropped:function(id,relativeTo){
                var imageDim = {};
                imageDim.sourceWidth = relativeTo.width();
                imageDim.sourceHeight = relativeTo.height();
                imageDim.sourceRatio = imageDim.sourceWidth/imageDim.sourceHeight;
                
                var imgObj = mxBuilder.assets.get(id);
                
                var ratioImg = imgObj.ratio;
                
                if (imageDim.sourceRatio < ratioImg) {
                    imageDim.height = imageDim.sourceHeight;
                    imageDim.width = imageDim.sourceHeight * ratioImg;
                } else if (imageDim.sourceRatio > ratioImg) {
                    imageDim.width = imageDim.sourceWidth;
                    imageDim.height = imageDim.sourceWidth / ratioImg;
                } else {
                    imageDim.width = imageDim.sourceWidth;
                    imageDim.height = imageDim.sourceHeight;
                }
                
                imageDim.imageCss = {
                    width: imageDim.width+"px",
                    height: imageDim.height+"px",
                    left:((imageDim.sourceWidth - imageDim.width) / 2)+"px ",
                    top: ((imageDim.sourceHeight - imageDim.height) / 2) + "px"
                }
                
                return imageDim;
            },
            createGalleryFromSelected: function(galleryType){
                var properties = {
                    data: {
                        type: galleryType,
                        extra: []
                    },
                    css: {
                        width: "500px",
                        height: "300px",
                        top: 3000,
                        left: 3000
                    }
                };
                mxBuilder.selection.each(function(){
                    var pos = this.element.position();
                    if(pos.top < properties.css.top && pos.left < properties.css.left){
                        properties.css.top = pos.top;
                        properties.css.left = pos.left;
                        properties.data.container = this.container;
                    }
                    properties.data.extra.push(this.extra.originalAssetID);
                    this.destroy();
                });
                mxBuilder.components.addComponent(properties);
                mxBuilder.selection.revalidateSelectionContainer();
            }
        }
    });

}(jQuery));