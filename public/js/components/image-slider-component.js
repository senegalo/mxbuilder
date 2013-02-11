(function($){
    $(function(){
        mxBuilder.ImageSliderComponent = function ImageSliderComponent(properties){
            this.init(properties);
            var imageSlider = this;
            //Edit component behavious settings...
            mxBuilder.Component.apply(this,[{
                type: "ImageSliderComponent",
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
    
            //Add element events...
            if(this.extra){
                for(var i in this.extra){
                    this.list[this.extra[i]] = {
                        id: this.extra[i],
                        caption: true,
                        title: true,
                        link: {}
                    };
                }
            }
            
            properties.element.on({
                selected: function(){
                    mxBuilder.activeStack.push(properties.element);
                },
                resize: function(){
                    imageSlider.revalidate();
                }
            });
            
            //restricting the resize 
            if(this.element.width() < 535 || this.element.height() < 222){
                this.element.css({
                    height: 300,
                    width: 600
                });
            }
            
            this.element.resizable("option", "minWidth", 535)
            .resizable("option", "minHeight", 222);
            
            this.rebuild();
            
        //Extra Initializtion actions...
        }
        $.extend(mxBuilder.ImageSliderComponent.prototype, new mxBuilder.Component(), {
            template: mxBuilder.layout.templates.find(".image-slider-component-instance"),
            sliderTemplate: mxBuilder.layout.templates.find(".image-gallery-slider"),
            sliderSettings: {
                autoPlay: false,
                transitionSpeed: 5000,
                indicator: true,
                action: true,
                navigation: "thumbs"
            },
            list: {},
            thumbSize: "full",
            revalidateImageSize: function revalidateImageSize(){
                var elementWidth = this.element.width();
                var elementHeight = this.element.height();
                    
                //Deciding which size to use !
                var length = elementWidth/elementHeight < 1 ? elementHeight : elementWidth;
                var sourceSwitchMargin = 10;
                    
                if(this.thumbSize == "thumb" && length > 100+sourceSwitchMargin){
                    this.thumbSize = "small";
                } else if (this.thumbSize == "small" && length <= 100){
                    this.thumbSize = "thumb";
                } else if(this.thumbSize == "small" && length >= 300+sourceSwitchMargin){
                    this.thumbSize = "medium";
                } else if(this.thumbSize == "medium" && length <= 300){
                    this.thumbSize = "small";
                } else if(this.thumbSize == "medium" && length >= 500+sourceSwitchMargin){
                    this.thumbSize = "full";
                } else if(this.thumbSize == "full" && length <= 500){
                    this.thumbSize = "medium";
                }
            },
            revalidate: function revalidate(){
                var instance = this;
                this.revalidateImageSize();
                this.element.find(".image-gallery-slider")
                .find("a img")
                .each(function(){
                    var image = $(this);
                    var id = image.data("id");
                    var imgObj = mxBuilder.assets.get(id);
                        
                    image.attr("src",imgObj.location+'/'+imgObj[mxBuilder.assets.getClosestImageSize(id, instance.thumbSize, false)]);
                })
                .end().imageSlider("options",this.getSliderSettings()).imageSlider("revalidate");
                
            },
            rebuild: function rebuild(returnFlag,withLinks){
                var slider = this.sliderTemplate.clone();
                var sliderContainer = slider.find("ul");
                var slide = slider.find("li").remove();
                    
                //Deciding which size to use !
                this.revalidateImageSize();
                    
                    
                for(var i in this.list){
                    var imgObj = mxBuilder.assets.get(this.list[i].id);
                    var link;
                    
                    if(withLinks && this.list[i].link.type != "none"){
                        if(this.list[i].link.type == "external"){
                            link = this.list[i].link.protocol+this.list[i].link.url;
                        } else if(this.list[i].link.type == "page") {
                            var page = mxBuilder.pages.getPageObj(this.list[i].link.page);
                            link = page.homepage?"index.html":page.address;
                        }
                    } else {
                        link = "javascript:void(0);";
                    }
                    
                    var theSlide = slide.clone().find('a')
                    .attr("href",link)
                    .append('<img src="'+imgObj.location+'/'+imgObj[mxBuilder.assets.getClosestImageSize(this.list[i].id, this.thumbSize, false)]+'" data-id="'+imgObj.id+'" data-oitar="'+imgObj.ratio+'"/>')
                    .end()
                    .find(".thumb")
                    .append('<img src="'+imgObj.location+'/'+imgObj.thumb+'" data-id="'+imgObj.id+'" data-oitar="'+imgObj.ratio+'"/>')
                    .end()
                    .addClass("slide-"+this.list[i].id);
                    
                    var titleWritten = false, captionWritten = false;
                    if(imgObj.title != "" && this.list[i].title){
                        theSlide.find(".slider-caption")
                        .find("h1")
                        .append(imgObj.title);
                        titleWritten = true;
                    } 
                    
                    if(imgObj.caption != "" && this.list[i].caption){
                        theSlide.find("p")
                        .append(imgObj.caption);
                        captionWritten = true;
                    }
                    
                    if(!titleWritten && !captionWritten) {
                        theSlide.find(".slider-caption").hide();
                    }
                    
                    theSlide.appendTo(sliderContainer);
                }
                if(!returnFlag){
                    this.element.find(".image-gallery-slider").remove().end().append(slider);
                    slider.imageSlider(this.getSliderSettings());
                } else {
                    return slider;
                }
            },
            getSliderSettings: function getSliderSettings(){
                var out = {};
                $.extend(out,this.sliderSettings);
                return out;
            },
            updateImagesInfo: function updateImagesInfo(){
                this.element.find("img").each(function(){
                    var theImage = $(this);
                    var theSlide = theImage.parents('li:first');
                    var imageObj = mxBuilder.assets.get(theImage.data("id"));
                    
                    //updating image info
                    theSlide.find("h1:first")
                    .text(imageObj.title)
                    .end()
                    .find("p:first")
                    .text(imageObj.caption)
                    .end();
                    var theCaptionBlock = theSlide.find(".slider-caption");
                    if(imageObj.title != "" && imageObj.caption != ""){
                        theCaptionBlock.show();
                    } else {
                        theCaptionBlock.hide();
                    }
                });
            },
            isEqualSettings: function isEqualSettings (obj){
                if(obj.caption === this.caption &&
                    obj.title === this.title &&
                    obj.link.type === this.link.type &&
                    obj.link.protocole === this.link.protocole &&
                    obj.link.url === this.link.url &&
                    obj.link.page === this.link.page){
                    return true;
                }
                return false;
            },
            save: function save(){
                var out = mxBuilder.Component.prototype.save.call(this);
                out.data.sliderSettings = this.sliderSettings;
                out.data.list = this.list;
                return out;
            },
            publish: function publish(){
                var out = mxBuilder.Component.prototype.publish.call(this);
                
                var slider = this.rebuild(true,true);
                
                slider.attr({
                    "data-ap": this.sliderSettings.autoPlay,
                    "data-tr": this.sliderSettings.transitionSpeed,
                    "data-in": this.sliderSettings.indicator,
                    "data-ac": this.sliderSettings.action,
                    "data-na": this.sliderSettings.navigation
                });
                
                out.find(".image-gallery-slider").remove().end().append(slider);
                return out;
            },
            getHeadIncludes: function getHeadIncludes(){
                var out = mxBuilder.Component.prototype.getHeadIncludes.call(this);
                
                out.scripts.imageSlider = "public/js-libs/image-slider.js";
                out.scripts.imageSliderLoader = "public/js-published/image-slider-loader.js";
                out.css.imageSlider = "public/css/image-slider.css";
                
                return out;
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
            getImageList: function getImageList(){
                return this.list;
            },
            setImageList: function setImageList(list){
                this.list = list;
            },
            getSettingsPanels: function getSettingsPanels(){
                var out = mxBuilder.Component.prototype.getSettingsPanels.call(this);
                
                out.background.remove();
                delete out.background;
                
                out.imageGallery = mxBuilder.layout.settingsPanels.imageGallery.getPanel();
                out.galleryImageList = mxBuilder.layout.settingsPanels.galleryImageList.getPanel(true);
                
                return out;
            },
            getSpeed: function getSpeed(){
                switch(this.sliderSettings.transitionSpeed){
                    case 3000:
                        return "fast";
                    case 5000:
                        return "medium";
                    case 10000:
                        return "slow";
                }
            },
            setSpeed: function setSpeed(speedText){
                switch(speedText){
                    case "fast":
                        this.sliderSettings.transitionSpeed = 3000;
                        break;
                    case "medium":
                        this.sliderSettings.transitionSpeed = 5000;
                        break;
                    case "slow":
                        this.sliderSettings.transitionSpeed = 10000;
                        break;
                }
            },
            setSettings: function setSettings(obj){
                if(obj && obj.transitionSpeed){
                    this.setSpeed(obj.transitionSpeed);
                    delete obj.transitionSpeed;
                }
                $.extend(this.sliderSettings,obj);
            },
            getSettings: function getSettings(){
                return {
                    autoPlay: this.sliderSettings.autoPlay,
                    transitionSpeed: this.getSpeed(),
                    indicator: this.sliderSettings.indicator,
                    action: this.sliderSettings.action,
                    navigation: this.sliderSettings.navigation
                };
            },
            updateLink: function updateLink(id,link){
                for(var i in this.list){
                    if(this.list[i].id == id){
                        this.list[i].link = link;
                        break;
                    }
                }
            }
        });
       
    });
}(jQuery))