(function($){
    $(function(){
        $("a").attr("href","javascript:void(0);");
        
        mxBuilder.layout.header.find(".an-item").each(function(){
            mxBuilder.components.addComponent({ 
                element: $(this), 
                data: {
                    type: "SimpleDiv",
                    container: "header"
                }
            });
        }); 
        
        mxBuilder.layout.body.find(".an-item").each(function(){
            mxBuilder.components.addComponent({ 
                element: $(this), 
                data: {
                    type: "SimpleDiv",
                    container: "body"
                }
            });
        }); 
        
        mxBuilder.layout.footer.find(".an-item").each(function(){
            mxBuilder.components.addComponent({ 
                element: $(this), 
                data: {
                    type: "SimpleDiv",
                    container: "footer"
                }
            });
        }); 
        
    });
    
}(jQuery));