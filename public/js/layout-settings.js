(function($){
    
    $(function(){
        
        var layoutParts = ["header","body","footer"];
        
        for(var p in layoutParts){
            var selector = $().add(mxBuilder.layout["layout"+layoutParts[p].uppercaseFirst()]);
            selector = selector.add(mxBuilder.layout[layoutParts[p]]);
            (function(layoutPart){
                selector.on({
                    mousedown: function mousedown(event){
                        if(event.which == 3){
                            var ctx = mxBuilder.contextmenu.getMainCtx();
                            ctx.addItem({
                                label: layoutPart.uppercaseFirst()+" Background settings...",
                                callback: function(){
                                    var expand = {};
                                    expand[layoutPart] = true;
                                    mxBuilder.menuManager.showTab("themes", expand);
                                }
                            });                    
                        }
                    }
                });
            }(layoutParts[p]));
        }        
    });
    
}(jQuery));