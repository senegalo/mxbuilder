(function($){
    $(function(){
        mxBuilder.ImageGridComponent = function ImageGridComponent(properties){
            var imageGridComponent = this;
            this.init(properties);
            
            //Edit component behavious settings...
            mxBuilder.Component.apply(this,[{
                type: "ImageGridComponent",
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
            properties.element.on({
                selected: function(){
                    mxBuilder.activeStack.push(properties.element);
                },
                resize: function resize(){
                    imageGridComponent.revalidate();
                },
                mousedown: function mousedown(event){
                    if(event.which == 3){
                        mxBuilder.contextmenu.allowPropagation().getMainCtx().addItem({
                            label: "Convert to a Slider Gallery",
                            callback: function(){
                                imageGridComponent.convertToSlider();
                            }
                        }).stopPropagation();
                    }
                }
            }).droppable({
                greedy: true,
                over: function over(event,ui){
                    ui.helper.data("deny-drop",true);
                },
                out: function out(event,ui){
                    ui.helper.data("deny-drop",false);
                },
                drop: function drop(event,ui){
                    if(ui.helper.hasClass("mx-helper")){
                        var component = ui.helper.data("component");
                        if(component == "ImageComponent"){
                            imageGridComponent.list.push({
                                id: ui.helper.data("extra").originalAssetID,
                                title: true,
                                caption: true,
                                link: {}
                            });
                            ui.helper.remove();
                            imageGridComponent.rebuild();
                            imageGridComponent.revalidate();
                            return false;
                        } else if(component == "ImageSliderComponent") {
                            var selected = ui.helper.data("extra");
                            for(var i in selected){
                                imageGridComponent.list.push({
                                    id: selected[i],
                                    title: true,
                                    caption: true,
                                    link: {}
                                });
                            }
                            ui.helper.remove();
                            imageGridComponent.rebuild();
                            imageGridComponent.revalidate();
                            return false;
                        }
                    }
                }
            });
            
            //Extra Initializtion actions...
            this.listContainer = this.element.find("table");
            if(this.extra){
                this.list = [];
                for(var i in this.extra){
                    //if the id is present then the list is transfered from another component
                    //otherwise it's coming stright from the photo list so we generate the missing
                    //properties
                    if(this.extra[i].id){
                        var listItem = {
                            id: this.extra[i].id,
                            caption: true,
                            title: true,
                            link: {}
                        }
                        $.extend(listItem,this.extra[i]);
                        this.list.push(listItem);
                    } else {
                        this.list.push({
                            id: this.extra[i],
                            caption: true,
                            title: true,
                            link: {}
                        });
                    }
                }
            }
            
            this.rebuild();
            this.revalidate();
        }
        $.extend(mxBuilder.ImageGridComponent.prototype, new mxBuilder.Component(), {
            template: mxBuilder.layout.templates.find(".image-grid-component-instance").remove(),
            gridSettings: {
                cols: 3,
                spacing: 10
            },
            thumbSize: "full",
            list: null,       
            border: null,
            listContainer: null,
            rebuild: function rebuild(){
                var gridContainer = this.listContainer.empty().css({
                    borderCollapse:"separate",
                    borderSpacing: this.gridSettings.spacing+"px",
                    width: "100%",
                    height: "100%"
                });
                var iterator = 0;
                var breakRow = this.gridSettings.cols;
                var row = $('<tr/>').appendTo(gridContainer);
                for(var i in this.list){
                    
                    var imgObj = mxBuilder.assets.get(this.list[i].id);
                    
                    if(!imgObj){
                        this.removeImage(this.list[i].id);
                        break;
                    }
                    
                    if(iterator != 0 && iterator%breakRow == 0){
                        row = $('<tr/>').appendTo(gridContainer);
                    }
                    var td = $('<td class="slide-'+imgObj.id+'" data-id="'+imgObj.id+'"/>').css({
                        width: (100/this.gridSettings.cols)+"%",
                        backgroundImage: 'url("'+imgObj.location+"/"+imgObj[mxBuilder.imageUtils.getClosestImageSize(this.list[i].id, this.thumbSize, false)]+'")',
                        position: "relative"
                    });
                    
                    var captionContainer = this.buildCaptionContainer(imgObj.title, imgObj.caption).appendTo(td);
                    this.validateCaption(captionContainer, this.list[i]);
                    
                    if(this.border){
                        td.css(this.border);
                    }
                    
                    td.data("id",imgObj.id).appendTo(row);
                    
                    iterator++;
                }
                gridContainer.appendTo(this.element);
            },
            revalidate: function revalidate(){
                var imageGrid = this;
                var thumbSize = mxBuilder.imageUtils.getImageSource(this.thumbSize, this.element);
                if(thumbSize != this.thumbSize){
                    this.thumbSize = thumbSize;
                    thumbSize = true;
                }
                this.element.find("td").each(function(){
                    var theTd = $(this);
                    
                    var wTd = theTd.width();
                    var hTd = theTd.height();
                
                    var ratioTd = wTd/hTd;
                    
                    var hImg,wImg;
                    
                    var imgObj = mxBuilder.assets.get(theTd.data("id"));
                    
                    var ratioImg = imgObj.ratio;
                    
                    if (ratioTd < ratioImg) {
                        hImg = hTd;
                        wImg = hTd * ratioImg;
                    } else if (ratioTd > ratioImg) {
                        wImg = wTd;
                        hImg = wTd / ratioImg;
                    } else {
                        wImg = wTd;
                        hImg = hTd;
                    }
                    
                    theTd.css({
                        backgroundPosition: ((wTd - wImg) / 2) +"px "+((hTd - hImg) / 2) + "px",
                        backgroundSize: wImg+"px "+hImg+"px"
                    });
                    
                    if(thumbSize === true){
                        theTd.css({
                            backgroundImage: 'url("'+imgObj.location+"/"+imgObj[mxBuilder.imageUtils.getClosestImageSize(imgObj.id, imageGrid.thumbSize, false)]+'")'
                        });
                    }
                    
                });
            },
            removeImage: function removeImage(id){
                var revalidate = false;
                for(var i in this.list){
                    if(this.list[i].id == id){
                        this.list.splice(i,1);
                        revalidate = true;
                        break;
                    }
                }
                
                if(revalidate){
                    var listLen = this.list.length;
                    if(listLen == 1){
                        var properties = this.save();
                        properties.data.type = "ImageComponent";                        
                        properties.data.extra = {
                            originalAssetID: this.list[0].id
                        }
                        this.destroy();
                        mxBuilder.components.addComponent(properties);
                    } else if(listLen == 0 ){
                        this.destroy();
                    } else {
                        this.rebuild();
                    }
                }
                
            },
            save: function save(){
                var out = mxBuilder.Component.prototype.save.call(this);
                out.data.gridSettings = this.gridSettings;
                out.data.list = this.list;
                out.data.thumbSize = this.thumbSize;
                out.data.border = this.border;
                return out;
            },
            publish: function publish(){
                var out = mxBuilder.Component.prototype.publish.call(this);
                
                for(var i in this.list){
                    var theTD = out.find("td.slide-"+this.list[i].id);
                    if(this.list[i].link.type && this.list[i].link.type != "none"){
                        var theLink = $('<a></a>');
                        
                        var attr = {};
                        if(this.list[i].link.type == "external"){
                            attr.href = this.list[i].link.protocol+this.list[i].link.url;
                        } else if (this.list[i].link.type == "page"){
                            var thePage = mxBuilder.pages.getPageObj(this.list[i].link.page);
                            if(thePage.homepage){
                                attr.href = "index.html";
                            } else {
                                attr.href = mxBuilder.pages.address;
                            }
                        } else if( this.list[i].link.type == "lightbox"){
                            var imgObj = mxBuilder.assets.get(this.list[i].id);
                            theLink.addClass("lightbox");
                            attr.href = imgObj.location+"/"+imgObj[mxBuilder.imageUtils.getBiggestImageSize(imgObj.id)];
                        }
                        theLink.css({
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            top:0,
                            left: 0
                        }).attr(attr).appendTo(theTD);
                    }
                }                
                return out;
            },
            getHeadIncludes: function getHeadIncludes(){
                var out =  mxBuilder.Component.prototype.getHeadIncludes.call(this);
                out.css.gridGallery = "public/css/image-grid.css";
                out.scripts.lightbox = "public/js-libs/lightbox/jquery.lightbox-0.5.pack.js";
                return out;
            },
            init: function init(properties){
                mxBuilder.Component.prototype.init.call(this,properties);
            },
            getBorder: function getBorder(element){
                return mxBuilder.Component.prototype.getBorder.call(this,this.listContainer.find("td:first"));
            },
            setBorder: function setBorder(obj){
                this.border = this.border === null ? {} : this.border;
                $.extend(this.border,obj);
                this.listContainer.find("td").css(obj);
            },
            getBackground: function getBackground(element){
                return mxBuilder.Component.prototype.getBackground.call(this,element);
            },
            setBackground: function setBackground(obj){
                mxBuilder.Component.prototype.setBackground.call(this,obj);
            },
            getSettingsPanels: function getSettingsPanels(){
                var out = mxBuilder.Component.prototype.getSettingsPanels.call(this);
                
                out.background.remove();
                delete out.background;
                
                out.gridGallerySettings = {
                    panel: mxBuilder.layout.settingsPanels.imageGrid
                };
                out.galleryImageList = {
                    panel: mxBuilder.layout.settingsPanels.galleryImageList,
                    params: {
                        expand: true,
                        lightbox: true
                    }
                };
                
                return out;
            },            
            getImageList: function getImageList(){
                return this.list;
            },
            setImageList: function setImageList(list){
                this.list = list;
            },
            getSettings: function getSettings(){
                return this.gridSettings;
            },
            setSettings: function setSettings(settings){
                this.gridSettings = settings;
            },
            convertToSlider: function convertToSlider(){
                var imageGrid = this;
                var properties = this.save();
                properties.data.type = "ImageSliderComponent";
                
                if(this.sliderSettings){
                    properties.data.sliderSettings = this.sliderSettings;
                }
                
                //doing the animation transition
                var firstTD = this.element.find("td:first");
                var imgObj = mxBuilder.assets.get(firstTD.data("id"));
                var theSize = mxBuilder.imageUtils.getImageSource("small", this.element);
                
                   
                var metrics = mxBuilder.imageUtils.getImageCropped(imgObj.id, this.element);
                var initialMetrics = mxBuilder.imageUtils.getImageCropped(imgObj.id, firstTD);
                initialMetrics.imageCss.position = "absolute";
                
                var container = $('<div/>').css({
                    height: initialMetrics.sourceHeight,
                    width: initialMetrics.sourceWidth,
                    overflow: "hidden",
                    position: "absolute",
                    left: this.gridSettings.spacing+"px",
                    top: this.gridSettings.spacing+"px"
                }).appendTo(this.element).animate({
                    top: 0,
                    left: 0,
                    width: metrics.sourceWidth,
                    height: metrics.sourceHeight
                },300,"easeInExpo");
                
                $("<img/>").attr({
                    src: imgObj.location+"/"+imgObj[mxBuilder.imageUtils.getClosestImageSize(imgObj.id, theSize, false)]
                }).css(initialMetrics.imageCss).appendTo(container)
                .animate(metrics.imageCss,300,"easeInExpo",function(){
                    imageGrid.trashComponent();
                    var component = mxBuilder.components.addComponent(properties);
                    mxBuilder.selection.addToSelection(component.element);
                });
            },
            toggleSlideTitle: function toggleSlideTitle(imgObj,flag){
                var theTd = this.element.find(".slide-"+imgObj.id);
                var container = theTd.find(".caption-container");
                if(flag){
                    if(container.length == 0){
                        container = this.buildCaptionContainer(imgObj.title, imgObj.caption);
                    }
                    this.validateCaption(container, {
                        title:true
                    });
                } else {
                    container.find(".image-title").removeClass("visible").hide();
                }
            },
            toggleSlideCaption: function toggleSlideCaption(imgObj,flag){
                var theTd = this.element.find(".slide-"+imgObj.id);
                var container = theTd.find(".caption-container");
                if(flag){
                    if(container.length == 0){
                        container= this.buildCaptionContainer(imgObj.title,imgObj.caption);
                    }
                    this.validateCaption(container, {
                        caption:true
                    });
                } else {
                    container.find(".image-caption").removeClass("visible").hide();
                }
            },
            buildCaptionContainer: function buildCaptionContainer(title,caption){
                var captionContainer = $('<div class="caption-container"/>');
                
                var titleContainer = $('<div class="image-title visible">'+title+'</div>').appendTo(captionContainer);
                if(title == ""){
                    titleContainer.removeClass("visible").hide();
                }
                
                var captionTextContainer = $('<div class="image-caption visible">'+caption+'</div>').appendTo(captionContainer);
                if(caption == ""){
                    captionTextContainer.removeClass("visible").hide();
                }
                
                return captionContainer;
            },
            validateCaption: function validateCaption(captionContainer,rules){
                var title = captionContainer.find(".image-title");
                var caption = captionContainer.find(".image-caption");
                
                if(rules.title === false){
                    title.removeClass("visible").hide();                        
                } else if(rules.title === true){
                    title.addClass("visible").show();
                    captionContainer.show();
                }
                
                if(rules.caption === false){
                    caption.removeClass("visible").hide();
                } else if(rules.caption === true){
                    caption.addClass("visible").show();
                    captionContainer.show();
                }
                
                var hideCaption = true;
                captionContainer.children().each(function(){
                    if($(this).text() != ""){
                        hideCaption = false;
                    }
                }); 
                if(hideCaption){
                    captionContainer.hide();
                }
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