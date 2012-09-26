(function($){
    $(function(){
        $("a").attr("href","javascript:void(0);");
        
        mxBuilder.layout.header.find(".an-item").each(function(){
            mxBuilder.components.addComponent($(this), mxBuilder.SimpleDiv).setContainer("header");
        }); 
        
        mxBuilder.layout.body.find(".an-item").each(function(){
            mxBuilder.components.addComponent($(this), mxBuilder.SimpleDiv).setContainer("body");
        }); 
        
        mxBuilder.layout.footer.find(".an-item").each(function(){
            mxBuilder.components.addComponent($(this), mxBuilder.SimpleDiv).setContainer("footer");
        }); 
        
    });
    
}(jQuery));