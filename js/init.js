(function($){
    $(function(){
        
        mxBuilder.pages.addPage({
            title: "Home Page",
            address: "home"
        });
        
        var websiteComponents = JSON.parse(localStorage.ws1);
        for(var i in websiteComponents){
            mxBuilder.components.addComponent(websiteComponents[i]);
        }
        
    });
    
}(jQuery));
