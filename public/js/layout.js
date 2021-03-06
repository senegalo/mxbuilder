(function($) {

    mxBuilder.layout = {
        syncContentHeight: function() {
            var heights = {
                header: this.header.height(),
                body: this.body.height(),
                footer: this.footer.height()
            };

            //the -6 to compensate for the resize handler
            var documentHeight = $(window).height();
            if (document.body.scrollHeight <= documentHeight) {
                documentHeight = documentHeight - 6;
                heights.footer = documentHeight - heights.header - heights.body;
                this.footer.height(heights.footer);
            } else {
                heights.footer = this.footer.height();
            }

            var containers = ["header", "body", "footer"];
            for (var c = 0; c < 3; c++) {
                //the Layout sections
                this["layout" + containers[c].uppercaseFirst()].height(heights[containers[c]]);

                //the Ouline Divs
                this[containers[c] + "Outline"].outerHeight(heights[containers[c]]);
            }

            this.syncResizer();
        },
        syncResizer: function() {
            var heights = {
                header: this.header.height(),
                body: this.body.height(),
                footer: this.footer.height()
            };
            //place resizers
            this.headerResizer.css({
                top: heights.header - 6
            });
            this.bodyResizer.css({
                top: heights.header + heights.body - 6
            });
            this.footerResizer.css({
                top: heights.header + heights.body + heights.footer - 6
            });
        },
        getMaxComponentHeight: function(container) {
            var max = 0;
            container = mxBuilder.layout[container];
            var containerPosition = container.position();
            container.children(".mx-component").each(function() {
                var that = $(this);
                var position = that.position();
                var componentHeight = that.outerHeight() + position.top;

                if (max < componentHeight) {
                    max = componentHeight;
                }
            });
            return max - containerPosition.top;
        },
        revalidateContainer: function(container, keepComponentsFlag) {
            //first we get the maximum component height
            var maxHeight = this.getMaxComponentHeight(container);

            if (container === "body") {
                //if revalidating the body compare the content height with the page content height
                var contentHeight = mxBuilder.pages.getContentHeight();

                if (contentHeight > maxHeight) {
                    maxHeight = contentHeight;
                } else {
                    mxBuilder.pages.setContentHeight(maxHeight);
                }
                maxHeight = contentHeight > maxHeight ? contentHeight : maxHeight;
            }

            //make sure that we did not shrink beyond the limits
            maxHeight = maxHeight < mxBuilder.config.minContainerHeight ? mxBuilder.config.minContainerHeight : maxHeight;

            //calculating the offset between our new height and the current container height
            var offsetHeight = maxHeight - mxBuilder.layout[container].height();

            if (offsetHeight > 0) {
                //setting the new height
                mxBuilder.layout[container].height(maxHeight);

                if (keepComponentsFlag !== true) {
                    this.offsetComponents(container, offsetHeight);
                }
            }

        },
        revalidateLayout: function(keepComponentsFlag) {
            var containers = ["body", "footer"];
            for (var c in containers) {
                this.revalidateContainer(containers[c], keepComponentsFlag);
            }

            this.syncContentHeight();
        },
        revalidateLayoutWidth: function() {
            var layoutWidth = this.layoutHeader.outerWidth();
            this.container.children(".mx-component").each(function() {
                var element = $(this);
                var position = element.position();
            });
        },
        setLayout: function(heights, noOffsetFlag) {
            for (var container in heights) {
                if (noOffsetFlag !== true) {
                    this.offsetComponents(container, heights[container] - mxBuilder.layout[container].height());
                }
                this[container].height(heights[container]);
            }
            if (container) {
                this.syncContentHeight();
            }
        },
        outline: function(container) {
            this[container].find("." + container + "-outline").show();
        },
        clearOutline: function(container) {
            this[container].find("." + container + "-outline").hide();
        },
        offsetComponents: function(container, offsetHeight) {
            var selector = $();
            //select everything beneath the current container
            if (container === "header") {
                selector = selector.add(mxBuilder.layout.body.children(".mx-component"));
                selector = selector.add(mxBuilder.layout.footer.children(".mx-component"));
            } else if (container === "body") {
                selector = selector.add(mxBuilder.layout.footer.children(".mx-component"));
            }

            //offset them all with our calculated offset
            selector.each(function() {
                var that = $(this);
                var thePosition = that.position();
                thePosition.top += offsetHeight;
                that.css("top", thePosition.top);
            });
        },
        setBackgroundImage: function(container, image) {
            var className = container + "-background-image";

            if (container === "header") {
                container = this.layoutHeader;
            } else if (container === "body") {
                container = $(document.body);
            } else {
                container = this.layoutFooter;
            }

            container.find("." + className).remove();

            var theDiv = $('<div style="position:' + (className === "body-background-image" ? "fixed" : "absolute") + ';top:0;left:0;width:100%;height:100%;z-index:1" class="' + className + ' flexly-background-image" data-id="' + image.id + '"></div>')
                    .appendTo(container);

            var theImg = $('<img src="' + image.location + "/" + image[mxBuilder.imageUtils.getBiggestImageSize(image.id)] + '"/>')
                    .appendTo(theDiv);

            var wDiv = theDiv.width();
            var hDiv = theDiv.height();

            var ratioDiv = wDiv / hDiv;

            var wImg, hImg, ratioImg = image.ratio;
            if (ratioImg > 0) {
                wImg = wDiv;
                hImg = ratioImg / wImg;
            } else {
                wImg = hDiv * ratioImg;
                hImg = hDiv;
            }


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

            theImg.css({
                position: "absolute",
                width: wImg,
                height: hImg,
                top: ((hDiv - hImg) / 2) + 'px',
                left: ((wDiv - wImg) / 2) + 'px'
            });
        },
        getBackgroundImage: function(container) {
            if (typeof container === "string" && container !== "body") {
                return mxBuilder.layout['layout' + container.uppercaseFirst()].children(".flexly-background-image");
            } else if (typeof container === "string") {
                return $(document.body).children(".flexly-background-image");
            } else {
                return container.children(".flexly-background-image");
            }
        },
        header: null,
        body: null,
        footer: null,
        headerOutline: null,
        bodyOutline: null,
        footerOutline: null,
        layoutBody: null,
        layoutHeader: null,
        layoutFooter: null,
        headerResizer: null,
        bodyResizer: null,
        footerResizer: null,
        menu: null,
        templates: null,
        settingsPanels: {},
        globalSettingsPanels: {}
    };

    $(function() {

        $.extend(mxBuilder.layout, {
            header: $("#header-content"),
            body: $("#body-content"),
            footer: $("#footer-content"),
            container: $("#container"),
            layoutBody: $("#body"),
            layoutHeader: $("#header"),
            layoutFooter: $("#footer"),
            menu: $("#menu"),
            pagesSelect: $("#website-pages"),
            templates: $("#templates").remove(),
            selectionSafe: $("#selection-safe"),
            editorArea: $("#editor-area"),
            headerResizer: $("#header-resizer"),
            bodyResizer: $("#body-resizer"),
            footerResizer: $("#footer-resizer")
        });

        $.extend(mxBuilder.layout, {
            headerOutline: mxBuilder.layout.header.find(".header-outline"),
            bodyOutline: mxBuilder.layout.body.find(".body-outline"),
            footerOutline: mxBuilder.layout.footer.find(".footer-outline")
        });

        var makeResizableRevenge = function(container) {
            $("#" + container + "-resizer").draggable({
                containment: "body",
                scrollSensitivity: 100,
                start: function() {
                    var handle = $(this);
                    var selector = $();
                    if (container === "header") {
                        selector = selector.add(mxBuilder.layout.body.children(".mx-component"));
                        selector = selector.add(mxBuilder.layout.footer.children(".mx-component"));
                    } else if (container === "body") {
                        selector = selector.add(mxBuilder.layout.footer.children(".mx-component"));
                        handle.data("min-height", mxBuilder.layout.getMaxComponentHeight("body"));
                    } else {
                        handle.data("min-height", mxBuilder.layout.getMaxComponentHeight("footer"));
                    }
                    handle.data("elements", selector);
                    handle.data("last-height", mxBuilder.layout[container].height());
                    mxBuilder.historyManager.setLayoutRestorePoint();
                },
                drag: function(event) {
                    var element = $(this);
                    var position = element.position();

                    //Adjusting the position
                    if (container === "body") {
                        position.top -= mxBuilder.layout.layoutHeader.height();
                    } else if (container === "footer") {
                        position.top -= mxBuilder.layout.layoutBody.height() + mxBuilder.layout.layoutHeader.height();
                    }

                    //resizing the layouts
                    mxBuilder.layout["layout" + container.uppercaseFirst()]
                            .add(mxBuilder.layout[container])
                            .add(mxBuilder.layout[container + "Outline"]).outerHeight(position.top + 6);


                    //checking for max component height breach
                    var minHeight = element.data("min-height");
                    if(typeof minHeight !== "undefined" && mxBuilder.layout[container].height() < minHeight){
                        mxBuilder.layout[container].height(minHeight);
                        mxBuilder.layout.syncContentHeight();
                        return false;
                    }

                    //checking for min height breach
                    if (position.top < mxBuilder.config.minContainerHeight) {
                        mxBuilder.layout[container].height(mxBuilder.config.minContainerHeight + 10);
                        mxBuilder.layout.syncContentHeight();
                        return false;
                    }

                    //Moving Components Below
                    var lastHeight = element.data("last-height");
                    var currentHeight = mxBuilder.layout[container].height();
                    var components = element.data("elements");
                    var offsetHeight = currentHeight - lastHeight;

                    components.each(function() {
                        var that = $(this);
                        var thePosition = that.position();
                        thePosition.top += offsetHeight;
                        that.css("top", thePosition.top);
                    });

                    element.data("last-height", currentHeight);

                    //revalidating the layout
                    mxBuilder.layout[container].find(".mx-layout-resize-indicator").show();
                    mxBuilder.selection.revalidateSelectionContainer();
                    mxBuilder.layout.syncContentHeight();
                },
                stop: function() {
                    mxBuilder.layout[container].find(".mx-layout-resize-indicator").hide();

                    //if it's the body we are resizing update the content hight
                    if (container === "body") {
                        mxBuilder.pages.setContentHeight(mxBuilder.layout.layoutBody.height());
                    }

                    mxBuilder.layout.syncContentHeight();
                    $(document.body).css("height", "");
                }
            });
        };

        makeResizableRevenge("header");
        makeResizableRevenge("body");
        makeResizableRevenge("footer");

    });
}(jQuery));