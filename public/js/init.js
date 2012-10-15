(function($){
    $(function(){
        var savedWebsite = localStorage.getItem("stored-website");
        if(savedWebsite){
            mxBuilder.pages.restorePages(JSON.parse(savedWebsite));
        } else {
            mxBuilder.pages.addPage({
                title: "Home Page",
                address: "home"
            });
        }
    });
}(jQuery));
