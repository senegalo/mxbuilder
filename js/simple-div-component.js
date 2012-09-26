(function($){
    mxBuilder.SimpleDiv = function SimpleDiv(instance){
        mxBuilder.Component.apply(this,[{
            ID: "simple-div",
            title: "Simple Div",
            draggable: {},
            resizable: {},
            ctxZIndex: true,
            selectable: true,
            instance: instance
        }]);
        instance.addClass("simple-div");
        instance.on({
            dblclick: function(){
                instance
                .draggable("disable")
                .attr("contenteditable","true");
                $(document.body).selectable( "distroy" );
                console.log("Editing...");
                var theComponent = mxBuilder.components.getComponent(instance);
                var refreshInterval = setInterval(function(){
                    var metrics = theComponent.getMetrics();
                    if(typeof metrics.offsetWidth != "undefined"){
                        mxBuilder.components.pushComponentsBelow(metrics);
                        mxBuilder.selection.revalidateSelectionContainer();
                        mxBuilder.layout.revalidateLayout();
                    }
                },100);
                instance.data("refreshinterval",refreshInterval);
            },
            deslected: function(){
                clearInterval(instance.data("refreshinterval"));
                $(document.body).selectable("enable");
                instance
                .draggable("enable")
                .removeAttr("contenteditable");
            }
        });
    }
    mxBuilder.SimpleDiv.prototype = new mxBuilder.Component();
    
    $(function(){
        $('<div class="simple-div-comp menu-item">Simple Div</div>').draggable({
            grid: mxBuilder.properties.gridSize,
            helper: function(event){
                var theContent = $('<div style="height:100px;width:400px;padding:5px;overflow:hidden;z-index:10000;"></div>').data("component",mxBuilder.SimpleDiv)
                theContent.append("I’ve had to work with jQuery UI’s Resizable plugin on a recent project.  I wanted to use custom handles to drag the element for resize, but the documentation page is a bit sparse when it comes to specifying a DOM Element to use for your custom handle.  For the sanity of others, here is the correct syntax to use when trying to add a custom handle to the jQuery UI Resize plugin.");
                theContent.css({
                    backgroundColor: "rgba("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+",100)"
                });
                theContent.appendTo(mxBuilder.layout.container);
                return theContent;
            }
        }).appendTo(mxBuilder.layout.menu);
    });
    
}(jQuery));