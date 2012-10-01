(function($){
    
    mxBuilder.layout = {
        syncLayoutHeight: function syncLayoutHeight(){
            this.header.height(this.layoutHeader.height());
            this.body.height(this.layoutBody.height());
            this.footer.height(this.layoutFooter.height());
        },
        syncContentHeight: function syncContentHeight(){
            this.layoutHeader.height(this.header.height());
            this.layoutBody.height(this.body.height());
            this.layoutFooter.height(this.footer.height());
        },
        getMaxComponentHeight: function getMaxComponentHeight(container){
            var max = 0;
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
        setToMaxHeight: function setToMaxHeight(container){
            var theMax = this.getMaxComponentHeight(container);
            var offsetHeight = theMax-container.height();
            container.height(theMax);
            
            var selector = $();
            if(container.get(0) === mxBuilder.layout.header.get(0)){
                selector = selector.add(mxBuilder.layout.body.children(".mx-component"));
                selector = selector.add(mxBuilder.layout.footer.children(".mx-component"));
            } else if(container.get(0) === mxBuilder.layout.body.get(0)){
                selector = selector.add(mxBuilder.layout.footer.children(".mx-component"));
            }
            
            selector.each(function(){
                var that = $(this);
                var thePosition = that.position();
                thePosition.top += offsetHeight;
                that.css("top",thePosition.top);
            });
            
        },
        revalidateLayout: function revalidateLayout(){
            this.syncLayoutHeight();
            this.setToMaxHeight(mxBuilder.layout.header);
            this.setToMaxHeight(mxBuilder.layout.body);
            this.setToMaxHeight(mxBuilder.layout.footer);
            this.syncContentHeight();
        },
        header: null,
        body: null,
        footer: null,
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
            templates: $("#templates").remove()
        });
        
        var bodyWidth = mxBuilder.layout.body.width();
        var handle = $('<div style="z-index:1000000;background-color:#00dbff;"/>');
        var makeResizable = function makeResizable(container){
            container.resizable({
                minWidth: bodyWidth,
                maxWidth: bodyWidth,
                handles: {
                    s: handle.clone().appendTo(container).addClass("ui-resizable-handle ui-resizable-s")
                },
                start: function(event,ui){
                    var that = $(ui.element);
                    var selector = $();
                    if(that.get(0) === mxBuilder.layout.layoutHeader.get(0)){
                        selector = selector.add(mxBuilder.layout.body.children(".mx-component"));
                        selector = selector.add(mxBuilder.layout.footer.children(".mx-component"));
                        that.resizable("option","minHeight",mxBuilder.layout.getMaxComponentHeight(mxBuilder.layout.header));
                    } else if(that.get(0) === mxBuilder.layout.layoutBody.get(0)){
                        selector = selector.add(mxBuilder.layout.footer.children(".mx-component"));
                        that.resizable("option","minHeight",mxBuilder.layout.getMaxComponentHeight(mxBuilder.layout.body));
                    } else {
                        that.resizable("option","minHeight",mxBuilder.layout.getMaxComponentHeight(mxBuilder.layout.footer));
                    }
                    that.data("elements",selector);
                    that.data("lastheight",that.height());
                },
                resize: function(event,ui) {    
                    var that = $(ui.element);
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
                    mxBuilder.layout.syncLayoutHeight();
                    mxBuilder.selection.revalidateSelectionContainer();
                },
                stop: function(event,ui){
                    
                }
            });
        }
        
        makeResizable(mxBuilder.layout.layoutBody);
        makeResizable(mxBuilder.layout.layoutHeader);
        makeResizable(mxBuilder.layout.layoutFooter);
        
    });
}(jQuery));