(function($){
    $(function(){
        mxBuilder.SimpleDiv = function SimpleDiv(properties){
            
            this.init(properties);
            
            mxBuilder.Component.apply(this,[{
                type: "SimpleDiv",
                draggable: {},
                resizable: {},
                ctxZIndex: true,
                selectable: true,
                element: properties.element
            }]);
            properties.element.on({
                dblclick: function(){
                    properties.element
                    .draggable("disable")
                    .attr("contenteditable","true");
                    $(document.body).selectable( "distroy" );
                    console.log("Editing...");
                    var theComponent = mxBuilder.components.getComponent(properties.element);
                    var refreshInterval = setInterval(function(){
                        var metrics = theComponent.getMetrics();
                        if(typeof metrics.offsetWidth != "undefined"){
                            mxBuilder.components.pushComponentsBelow(metrics);
                            mxBuilder.selection.revalidateSelectionContainer();
                            mxBuilder.layout.revalidateLayout();
                        }
                    },100);
                    properties.element.data("refreshinterval",refreshInterval);
                },
                deslected: function(){
                    clearInterval(properties.element.data("refreshinterval"));
                    $(document.body).selectable("enable");
                    properties.element
                    .draggable("enable")
                    .removeAttr("contenteditable");
                }
            });
        }
        $.extend(mxBuilder.SimpleDiv.prototype, new mxBuilder.Component(), {
            template: mxBuilder.layout.templates.find(".simple-div").remove(),
            save: function save(){
                var out = mxBuilder.Component.prototype.save.call(this);
                out.data.html = this.element.html();
                return out;
            },
            init: function init(properties){
                mxBuilder.Component.prototype.init.call(this,properties);
                if(properties.data.html){
                    properties.element.html(properties.data.html);
                }
            }
        });

        $('<div class="simple-div-comp menu-item">Simple Div</div>').draggable({
            grid: mxBuilder.properties.gridSize,
            helper: function(event){
                var theContent = mxBuilder.SimpleDiv.prototype.template.clone().data("component","SimpleDiv");
                theContent.css({
                    backgroundColor: "rgba("+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+","+Math.round(Math.random()*255)+",100)"
                });
                theContent.appendTo(mxBuilder.layout.container);
                return theContent;
            }
        }).appendTo(mxBuilder.layout.menu);
    });
    
}(jQuery));