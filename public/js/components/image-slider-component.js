(function($) {
    $(function() {
        mxBuilder.ImageSliderComponent = function ImageSliderComponent(properties) {
            this.init(properties);
            var imageSlider = this;

            this.element.on({
                mousedown: function mousedown(event) {
                    //yes selection count is 0 !! because right clicking a component won't select it.. clicking it will !!
                    if (event.which === 3 && (mxBuilder.selection.getSelectionCount() === 0 || mxBuilder.selection.isAllSelectedSameType())) {
                        mxBuilder.contextmenu.getMainCtx().addItem({
                            label: "Convert to Grid Gallery",
                            callback: function() {
                                mxBuilder.selection.each(function() {
                                    this.convertToGrid();
                                });
                            }
                        });
                    }
                }
            });

            //Edit component behavious settings...
            mxBuilder.Component.apply(this, [{
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
            if (this.extra) {
                this.list = [];
                for (var i in this.extra) {
                    //if the id is present then the list is transfered from another component
                    //otherwise it's coming stright from the photo list so we generate the missing
                    //properties
                    if (this.extra[i].id) {
                        this.addToList(this.extra[i]);
                    } else {
                        this.addToList({
                            id: this.extra[i]
                        });
                    }
                }
            }

            properties.element.on({
                selected: function selected() {
                    mxBuilder.activeStack.push(properties.element);
                },
                resize: function resize() {
                    imageSlider.revalidate();
                }
            }).droppable({
                over: function over(event, ui) {
                    if (ui.helper.hasClass("mx-helper")) {
                        ui.helper.data("deny-drop", true);
                    }
                },
                out: function out(event, ui) {
                    if (ui.helper.hasClass("mx-helper")) {
                        ui.helper.data("deny-drop", false);
                    }
                },
                drop: function drop(event, ui) {
                    if (ui.helper.hasClass("mx-helper") && ui.helper.data("over-main-menu") !== true) {
                        var component = ui.helper.data("component");
                        if (component === "ImageComponent") {
                            imageSlider.list.push({
                                id: ui.helper.data("extra").originalAssetID,
                                title: true,
                                caption: true,
                                link: {}
                            });
                            ui.helper.remove();
                            imageSlider.rebuild();
                            return false;
                        } else if (component === "ImageSliderComponent") {
                            var selected = ui.helper.data("extra");
                            for (var i in selected) {
                                imageSlider.list.push({
                                    id: selected[i],
                                    title: true,
                                    caption: true,
                                    link: {}
                                });
                            }
                            ui.helper.remove();
                            imageSlider.rebuild();
                            return false;
                        } else if (component === "FlickerAdapterComponent") {
                            imageSlider.element.find(".loading-overlay").show();
                            var flickrObj = ui.helper.data("extra").flickerObj;
                            if (!Array.isArray(imageSlider._flickrImageCount)) {
                                imageSlider._flickrImageCount = [];
                            }
                            imageSlider._flickrImageCount.push(true);
                            mxBuilder.api.assets.addFlickerImage({
                                flickerObj: flickrObj,
                                success: function(data) {
                                    mxBuilder.assets.add(data.asset, true);
                                    imageSlider.list.push({
                                        id: data.asset.id,
                                        caption: true,
                                        title: true,
                                        link: {}
                                    });
                                    imageSlider.rebuild();
                                },
                                error: function() {
                                    mxBuilder.dialogs.alertDialog.show("Couldn't add the image to your assets...<br/>Please try again later");
                                },
                                complete: function() {
                                    imageSlider._flickrImageCount.pop();
                                    if (imageSlider._flickrImageCount.length === 0) {
                                        imageSlider.element.find(".loading-overlay").hide();
                                    }
                                }
                            });
                        }
                    }
                }
            });

            //restricting the resize 
            if (this.element.width() < this.minWidth || this.element.height() < this.minHeight) {
                this.element.css({
                    height: 300,
                    width: 600
                });
            }

            this.element.resizable("option", "minWidth", this.minWidth)
                    .resizable("option", "minHeight", this.minHeight);

            this.rebuild();

            //Extra Initializtion actions...
        };
        $.extend(mxBuilder.ImageSliderComponent.prototype, new mxBuilder.Component(), {
            template: mxBuilder.layout.templates.find(".image-slider-component-instance"),
            sliderTemplate: mxBuilder.layout.templates.find(".image-gallery-slider"),
            sliderSettings: null,
            sliderDefaults: {
                autoPlay: false,
                transitionSpeed: 5000,
                indicator: true,
                action: true,
                navigation: "thumbs"
            },
            list: null,
            thumbSize: "full",
            minWidth: 535,
            minHeight: 222,
            revalidate: function revalidate() {
                var instance = this;
                this.thumbSize = mxBuilder.imageUtils.getImageSource(this.thumbSize, this.element);
                this.element.find(".image-gallery-slider")
                        .find(".image img")
                        .each(function() {
                    var image = $(this);
                    var id = image.data("id");
                    var imgObj = mxBuilder.assets.get(id);
                    image.attr("src", imgObj.location + '/' + imgObj[mxBuilder.imageUtils.getClosestImageSize(id, instance.thumbSize, false)]);
                })
                        .end().imageSlider("options", this.getSliderSettings()).imageSlider("revalidate");
            },
            rebuild: function rebuild(returnFlag, publishing) {
                var slider = this.sliderTemplate.clone();
                var sliderContainer = slider.find("ul");
                var slide = slider.find("li").remove();

                //Deciding which size to use !
                this.thumbSize = mxBuilder.imageUtils.getImageSource(this.thumbSize, this.element);


                for (var i in this.list) {
                    var imgObj = mxBuilder.assets.get(this.list[i].id);
                    var link;

                    if (!imgObj) {
                        this.removeImage(this.list[i].id);
                        break;
                    }

                    var imgLocation = publishing ? "images" : imgObj.location;

                    var theImage = $('<img src="' + imgLocation + '/' + imgObj[mxBuilder.imageUtils.getClosestImageSize(this.list[i].id, this.thumbSize, false)] + '" data-id="' + imgObj.id + '" data-oitar="' + imgObj.ratio + '"/>');

                    if (publishing && this.list[i].link.type !== "none") {
                        if (this.list[i].link.type === "external") {
                            link = this.list[i].link.protocol + this.list[i].link.url;
                        } else if (this.list[i].link.type === "page") {
                            var page = mxBuilder.pages.getPageObj(this.list[i].link.page);
                            link = page.homepage ? "index.html" : page.address + ".html";
                        }
                        theImage = $('<a href="' + link + '"/>').append(theImage);
                    }

                    var theSlide = slide.clone().data("id", imgObj.id).find('.image')
                            .append(theImage)
                            .end()
                            .find(".thumb")
                            .append('<img src="' + imgLocation + '/' + imgObj.thumb + '" data-id="' + imgObj.id + '" data-oitar="' + imgObj.ratio + '"/>')
                            .end()
                            .addClass("slide-" + this.list[i].id);

                    var titleWritten = false, captionWritten = false;
                    if (imgObj.title !== "" && this.list[i].title) {
                        theSlide.find(".slider-caption")
                                .find("h1")
                                .append(imgObj.title);
                        titleWritten = true;
                    }

                    if (imgObj.caption !== "" && this.list[i].caption) {
                        theSlide.find("p")
                                .append(imgObj.caption);
                        captionWritten = true;
                    }

                    if (!titleWritten && !captionWritten) {
                        theSlide.find(".slider-caption").hide();
                    }

                    theSlide.appendTo(sliderContainer);
                }
                if (!returnFlag) {
                    this.element.find(".image-gallery-slider").remove().end().append(slider);
                    slider.imageSlider(this.getSliderSettings());
                } else {
                    return slider;
                }
            },
            getSliderSettings: function getSliderSettings() {
                var out = {};
                $.extend(out, this.sliderSettings);
                return out;
            },
            updateImagesInfo: function updateImagesInfo() {
                this.element.find("li img").each(function() {
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
                    if (imageObj.title !== "" && imageObj.caption !== "") {
                        theCaptionBlock.show();
                    } else {
                        theCaptionBlock.hide();
                    }
                });
            },
            convertToGrid: function convertToGrid() {
                var imageSlider = this;
                var properties = this.save();
                properties.data.type = "ImageGridComponent";
                if (this.border) {
                    properties.data.border = this.border;
                }
                if (this.gridSettings) {
                    properties.data.gridSettings = this.gridSettings;
                }

                //transition animation
                var initialElement = this.element.find(".current");
                var imgObj = mxBuilder.assets.get(initialElement.data("id"));
                var theSize = mxBuilder.imageUtils.getImageSource("small", this.element);


                //gettings the image index
                var imageIndex = 0;
                for (imageIndex in this.list) {
                    if (this.list[imageIndex].id === imgObj.id) {
                        break;
                    }
                }

                var totalCols = this.gridSettings && this.gridSettings.cols ? this.gridSettings.cols : mxBuilder.ImageGridComponent.prototype.gridDefaults.cols;
                var spacing = this.gridSettings && this.gridSettings.spacing ? this.gridSettings.spacing : mxBuilder.ImageGridComponent.prototype.gridDefaults.spacing;
                var row = Math.floor(imageIndex / totalCols);
                var col = imageIndex % totalCols;
                var singleRowHeight = (this.element.height() / Math.ceil(this.list.length / totalCols)) - 2 * spacing;
                var singleColWidth = (this.element.width() / totalCols) - 2 * spacing;
                var finalTop = row * singleRowHeight + (row + 1) * spacing;
                var finalLeft = singleColWidth * col + (col + 1) * spacing;

                var container = $('<div/>').css({
                    height: singleRowHeight,
                    width: singleColWidth,
                    overflow: "hidden",
                    position: "absolute",
                    left: 0,
                    top: 0
                });

                var metrics = mxBuilder.imageUtils.getImageCropped(imgObj.id, container);
                var initialMetrics = mxBuilder.imageUtils.getImageCropped(imgObj.id, initialElement);
                initialMetrics.imageCss.position = "absolute";


                container.appendTo(mxBuilder.layout[this.container]).css({
                    width: this.element.width(),
                    height: this.element.height(),
                    top: properties.css.top,
                    left: properties.css.left
                }).animate({
                    top: properties.css.top + finalTop,
                    left: properties.css.left + finalLeft,
                    width: singleColWidth,
                    height: singleRowHeight
                }, 300, "easeInExpo");

                $("<img/>").attr({
                    src: imgObj.location + "/" + imgObj[mxBuilder.imageUtils.getClosestImageSize(imgObj.id, theSize, false)]
                }).css(initialMetrics.imageCss).appendTo(container)
                        .animate(metrics.imageCss, 300, "linear", function() {
                    imageSlider.trashComponent();
                    var component = mxBuilder.components.addComponent(properties);
                    component.element.hide().fadeTo(300, 1, function() {
                        mxBuilder.selection.addToSelection(component.element);
                    });
                    container.remove();
                });
                this.trashComponent();
            },
            save: function save() {
                var out = mxBuilder.Component.prototype.save.call(this);
                out.data.sliderSettings = {};
                $.extend(out.data.sliderSettings, this.sliderSettings);
                out.data.list = this.list;
                return out;
            },
            publish: function publish() {
                var out = mxBuilder.Component.prototype.publish.call(this);
                out.find(".loading-overlay").remove();
                var slider = this.rebuild(true, true);

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
            getHeadIncludes: function getHeadIncludes() {
                var out = mxBuilder.Component.prototype.getHeadIncludes.call(this);

                out.scripts.imageSlider = "public/js-libs/image-slider.js";
                out.scripts.imageSliderLoader = "public/js-published/image-slider-loader.js";
                out.css.imageSlider = "public/css/image-slider.css";

                return out;
            },
            init: function init(properties) {
                //Setting default slider settings
                this.sliderSettings = {};
                $.extend(this.sliderSettings, this.sliderDefaults);
                mxBuilder.Component.prototype.init.call(this, properties);
            },
            getBorder: function getBorder(element) {
                return mxBuilder.Component.prototype.getBorder.call(this, element);
            },
            setBorder: function setBorder(obj) {
                mxBuilder.Component.prototype.setBorder.call(this, obj);
            },
            getBackground: function getBackground(element) {
                return mxBuilder.Component.prototype.getBackground.call(this, element);
            },
            setBackground: function setBackground(obj) {
                mxBuilder.Component.prototype.setBackground.call(this, obj);
            },
            getImageList: function getImageList() {
                return this.list;
            },
            setImageList: function setImageList(list) {
                this.list = list;
            },
            getSettingsPanels: function getSettingsPanels() {
                var out = mxBuilder.Component.prototype.getSettingsPanels.call(this);

                delete out.background;

                out.imageSlider = {
                    panel: mxBuilder.layout.settingsPanels.imageSlider
                };
                out.galleryImageList = {
                    panel: mxBuilder.layout.settingsPanels.galleryImageList,
                    params: {
                        expand: true
                    }
                };

                return out;
            },
            removeImage: function removeImage(id) {
                var revalidate = false;
                for (var i in this.list) {
                    if (this.list[i].id === id) {
                        this.list.splice(i, 1);
                        revalidate = true;
                        break;
                    }
                }

                if (revalidate) {
                    var listLen = this.list.length;
                    if (listLen === 1) {
                        var properties = this.save();
                        properties.data.type = "ImageComponent";
                        properties.data.extra = {
                            originalAssetID: this.list[0].id
                        };
                        this.trashComponent();
                        mxBuilder.components.addComponent(properties);
                    } else if (listLen === 0) {
                        this.trashComponent();
                    } else {
                        this.rebuild();
                    }
                }

            },
            getSpeed: function getSpeed() {
                switch (this.sliderSettings.transitionSpeed) {
                    case 3000:
                        return "fast";
                    case 5000:
                        return "medium";
                    case 10000:
                        return "slow";
                }
            },
            setSpeed: function setSpeed(speedText) {
                switch (speedText) {
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
            setSettings: function setSettings(obj) {
                if (obj && obj.transitionSpeed) {
                    this.setSpeed(obj.transitionSpeed);
                    delete obj.transitionSpeed;
                }
                $.extend(this.sliderSettings, obj);
            },
            getSettings: function getSettings() {
                var out = mxBuilder.Component.prototype.getSettings.call(this);
                $.extend(out, {
                    autoPlay: this.sliderSettings.autoPlay,
                    transitionSpeed: this.getSpeed(),
                    indicator: this.sliderSettings.indicator,
                    action: this.sliderSettings.action,
                    navigation: this.sliderSettings.navigation
                });
                return out;
            },
            updateLink: function updateLink(id, link) {
                for (var i in this.list) {
                    if (this.list[i].id === id) {
                        this.list[i].link = link;
                        break;
                    }
                }
            },
            toggleSlideTitle: function toggleSlideTitle(imgObj, flag) {
                var caption = this.element.find("li.slide-" + imgObj.id + " .slider-caption")
                        .find("h1")
                        .text(flag ? imgObj.title : "")
                        .end();

                if (caption.find("h1").text() === "" && caption.find("p").text() === "") {
                    caption.hide();
                } else {
                    caption.show();
                }
            },
            toggleSlideCaption: function toggleSlideCaption(imgObj, flag) {
                var caption = this.element.find("li.slide-" + imgObj.id + " .slider-caption")
                        .find("p")
                        .text(flag ? imgObj.caption : "")
                        .end();

                if (caption.find("h1").text() === "" && caption.find("p").text() === "") {
                    caption.hide();
                } else {
                    caption.show();
                }
            },
            addToList: function addToList(item) {
                if (typeof item === "number" || typeof item === "string") {
                    item = {
                        id: item
                    };
                }
                var listItem = {
                    id: 0,
                    caption: true,
                    title: true,
                    link: {
                        type: "none"
                    }
                };
                $.extend(listItem, item);
                this.list.push(listItem);
            },
            getUsedAssets: function getUsedAssets() {
                var out = {};
                for (var i in this.list) {
                    out[this.list[i].id] = ["thumb"];
                    if (this.thumbSize !== "thumb") {
                        out[this.list[i].id].push(this.thumbSize);
                    }
                }
                return out;
            },
            setWidth: function(val) {
                mxBuilder.Component.prototype.setWidth.call(this, val < this.minWidth ? this.minWidth : val);
                this.revalidate();
            },
            setHeight: function(val) {
                mxBuilder.Component.prototype.setHeight.call(this, val < this.minHeight ? this.minHeight : val);
                this.revalidate();
            },
            getWidthBounds: function() {
                var out = mxBuilder.Component.prototype.getWidthBounds.call(this);
                out.min = this.minWidth;
                return out;
            },
            getHeightBounds: function() {
                var out = mxBuilder.Component.prototype.getHeightBounds.call(this);
                out.min = this.minHeight;
                return out;
            }
        });
    });
}(jQuery));