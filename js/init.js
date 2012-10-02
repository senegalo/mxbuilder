(function($){
    $(function(){
        
        var websiteComponents = JSON.parse(localStorage.ws2);
        for(var i in websiteComponents){
            mxBuilder.components.addComponent(websiteComponents[i]);
        }
        
    });
    
}(jQuery));