(function($){
    
    mxBuilder.layout = {     
        syncContentHeight: function syncContentHeight(){
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
        getMaxComponentHeight: function getMaxComponentHeight(container){
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
        revalidateContainer: function revalidateContainer(container,keepComponentsFlag){
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
        revalidateLayout: function revalidateLayout(keepComponentsFlag){
            var containers = ["header","body","footer"];
            for(var c in containers){
                this.revalidateContainer(containers[c],keepComponentsFlag);
            }
            
            this.syncContentHeight();
        },
        setLayout: function setLayout(heights,noOffsetFlag){
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
        outline: function outline(container){
            this[container].find("."+container+"-outline").show();
        },
        clearOutline: function clearOutline(container){
            this[container].find("."+container+"-outline").hide();
        },
        offsetComponents: function offsetComponents(container, offsetHeight){
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
        templates: null
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
                        that.resizable("option","minHeight",mxBuilder.layout.getMaxComponentHeight("header"));
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
                    if(that.get(0) === mxBuilder.layout.layoutFooter.get(0)){
                        
                        var docHeight = $(document.body).height();
                        if(event.offsetY+10 >= docHeight){
                            var newHeight = $(document.body).height()+10;
                            $(document.body).height(newHeight).scrollTop(newHeight);
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