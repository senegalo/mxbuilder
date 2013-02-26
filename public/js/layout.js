(function($){
    
    mxBuilder.layout = {     
        syncContentHeight: function(){
            var heights = {
                header: this.header.height(),
                body: this.body.height()
            }
            
            //the -6 to compensate for the resize handler
            var documentHeight = $(window).height();
            if(document.body.scrollHeight <= documentHeight){
                documentHeight = documentHeight-6;
                heights.footer = documentHeight-heights.header-heights.body;
                this.footer.height(heights.footer);
            } else {
                heights.footer = this.footer.height();
            }
            
            //the Layout sections
            this.layoutHeader.height(heights.header);
            this.layoutBody.height(heights.body);
            this.layoutFooter.height(heights.footer);
            
            //the Ouline Divs
            this.headerOutline.outerHeight(heights.header);
            this.bodyOutline.outerHeight(heights.body);
            this.footerOutline.outerHeight(heights.footer);
        },
        getMaxComponentHeight: function(container){
            var max = 0;
            container = mxBuilder.layout[container];
            var containerPosition = container.position();
            container.children(".mx-component").each(function(){
                var that = $(this);
                var position = that.position();
                var componentHeight = that.outerHeight()+position.top;
                
                if(max < componentHeight){
                    max = componentHeight;
                }
            });
            return max-containerPosition.top;
        },
        revalidateContainer: function(container,keepComponentsFlag){
            //first we get the maximum component height
            var maxHeight = this.getMaxComponentHeight(container);
            
            if(container == "body"){
                //if revalidating the body compare the content height with the page content height
                var contentHeight = mxBuilder.pages.getContentHeight();

                if(contentHeight > maxHeight){
                    maxHeight = contentHeight;
                } else {
                    mxBuilder.pages.setContentHeight(maxHeight);
                }
                maxHeight = contentHeight > maxHeight ? contentHeight : maxHeight;
            }
            
            //make sure that we did not shrink beyond the limits
            maxHeight = maxHeight < mxBuilder.config.minContainerHeight ? mxBuilder.config.minContainerHeight : maxHeight;
            
            //calculating the offset between our new height and the current container height
            var offsetHeight = maxHeight-mxBuilder.layout[container].height();
            
            if(offsetHeight > 0){
                //setting the new height
                mxBuilder.layout[container].height(maxHeight);
                
                if(keepComponentsFlag !== true){
                    this.offsetComponents(container, offsetHeight);
                }
            }
            
        },
        revalidateLayout: function(keepComponentsFlag){
            var containers = ["body","footer"];
            for(var c in containers){
                this.revalidateContainer(containers[c],keepComponentsFlag);
            }
            
            this.syncContentHeight();
        },
        revalidateLayoutWidth: function(){
            var layoutWidth = this.layoutHeader.outerWidth();
            this.container.children(".mx-component").each(function(){
                var element = $(this);
                var position = element.position();
            });
        },
        setLayout: function(heights,noOffsetFlag){
            for(var container in heights){
                if(noOffsetFlag !== true){
                    this.offsetComponents(container, heights[container]-mxBuilder.layout[container].height());
                }
                this[container].height(heights[container]);
            }
            if(container){
                this.syncContentHeight();
            }
        },
        outline: function(container){
            this[container].find("."+container+"-outline").show();
        },
        clearOutline: function(container){
            this[container].find("."+container+"-outline").hide();
        },
        offsetComponents: function(container, offsetHeight){
            var selector = $();
            //select everything beneath the current container
            if(container == "header"){
                selector = selector.add(mxBuilder.layout.body.children(".mx-component"));
                selector = selector.add(mxBuilder.layout.footer.children(".mx-component"));
            } else if(container == "body"){
                selector = selector.add(mxBuilder.layout.footer.children(".mx-component"));
            }
                    
            //offset them all with our calculated offset
            selector.each(function(){
                var that = $(this);
                var thePosition = that.position();
                thePosition.top += offsetHeight;
                that.css("top",thePosition.top);
            });
        },
        setBackgroundImage: function(container, image){
            var className = container+"-background-image";
            
            if(container == "header"){
                container = this.layoutHeader;
            } else if (container == "body") {
                container = $(document.body);
            } else {
                container = this.layoutFooter;
            }
            
            container.find("."+className).remove();
            
            var theDiv = $('<div style="position:'+(className == "body-background-image"?"fixed":"absolute")+';top:0;left:0;width:100%;height:100%;z-index:1" class="'+className+' flexly-background-image" data-id="'+image.id+'"></div>')
            .appendTo(container);
                                    
            var theImg = $('<img src="'+image.location+"/"+image[mxBuilder.imageUtils.getBiggestImageSize(image.id)]+'"/>')
            .appendTo(theDiv);
                                    
            var wDiv = theDiv.width();
            var hDiv = theDiv.height();
                
            var ratioDiv = wDiv/hDiv;
            
            var wImg, hImg, ratioImg = image.ratio;
            if(ratioImg > 0){
                wImg = wDiv;
                hImg = ratioImg/wImg;
            } else {
                wImg = hDiv*ratioImg;
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
        getBackgroundImage: function(container){
            if(typeof container == "string" && container != "body"){
                return mxBuilder.layout['layout'+container.uppercaseFirst()].children(".flexly-background-image");
            } else if(typeof container == "string"){
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
        menu: null,
        templates: null,
        settingsPanels: {},
        globalSettingsPanels: {}
    } 
    
    $(function(){
        
        $.extend(mxBuilder.layout,{
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
            editorArea: $("#editor-area")
        });
        
        $.extend(mxBuilder.layout,{
            headerOutline: mxBuilder.layout.header.find(".header-outline"),
            bodyOutline: mxBuilder.layout.body.find(".body-outline"),
            footerOutline: mxBuilder.layout.footer.find(".footer-outline")
        });
        
        var bodyWidth = mxBuilder.layout.body.width();
        var handle = $('<div style="z-index:1000000;background-color:#00dbff;"/>');
        var makeResizable = function makeResizable(container,alsoResize){
            container.resizable({
                minWidth: bodyWidth,
                maxWidth: bodyWidth,
                alsoResize: alsoResize,
                handles: {
                    s: handle.clone().appendTo(container).addClass("ui-resizable-handle ui-resizable-s")
                },
                start: function(event,ui){
                    var that = $(ui.element);
                    var selector = $();
                    if(that.get(0) === mxBuilder.layout.layoutHeader.get(0)){
                        selector = selector.add(mxBuilder.layout.body.children(".mx-component"));
                        selector = selector.add(mxBuilder.layout.footer.children(".mx-component"));
                    //that.resizable("option","minHeight",mxBuilder.layout.getMaxComponentHeight("header"));
                    } else if(that.get(0) === mxBuilder.layout.layoutBody.get(0)){
                        selector = selector.add(mxBuilder.layout.footer.children(".mx-component"));
                        that.resizable("option","minHeight",mxBuilder.layout.getMaxComponentHeight("body"));
                    } else {
                        that.resizable("option","minHeight",mxBuilder.layout.getMaxComponentHeight("footer"));
                    }
                    that.data("elements",selector);
                    that.data("lastheight",that.height());
                },
                resize: function(event,ui) {
                    var that = $(ui.element);
                    
                    if(that.height() < mxBuilder.config.minContainerHeight){
                        that.height(mxBuilder.config.minContainerHeight);
                        return false;
                    }
                    
                    var lastHeight = that.data("lastheight");
                    var currentHeight = that.height();
                    var elements = that.data("elements");
                    var offsetHeight = currentHeight-lastHeight;
                    
                    
                    elements.each(function(){
                        var that = $(this);
                        var thePosition = that.position();
                        thePosition.top += offsetHeight;
                        that.css("top",thePosition.top);
                    });
                    
                    that.data("lastheight",currentHeight);
                    
                    //footer only
                    var body = $(document.body);
                    var docHeight;
                    if(that.get(0) === mxBuilder.layout.layoutFooter.get(0)){
                        docHeight = body.height();
                        if(event.offsetY+10 >= docHeight){
                            var newHeight = body.height()+10;
                            body.height(newHeight).scrollTop(newHeight);
                        }
                    } else {
                        docHeight = $(window).height();
                        if(event.clientY >= docHeight-10){
                            body.scrollTop(body.scrollTop()+10);
                        }
                    }
                    
                    mxBuilder.selection.revalidateSelectionContainer();
                },
                stop: function(event,ui){
                    
                    //if it's the body we are resizing update the content hight
                    if(this === mxBuilder.layout.layoutBody.get(0)){
                        mxBuilder.pages.setContentHeight(mxBuilder.layout.layoutBody.height());
                    }
                    
                    mxBuilder.layout.syncContentHeight();
                    $(document.body).css("height","");
                }
            });
        }
        
        makeResizable(mxBuilder.layout.layoutBody,mxBuilder.layout.body);
        makeResizable(mxBuilder.layout.layoutHeader,mxBuilder.layout.header);
        makeResizable(mxBuilder.layout.layoutFooter,mxBuilder.layout.footer);
        
    //mxBuilder.layout.revalidateLayout();
        
    });
}(jQuery));