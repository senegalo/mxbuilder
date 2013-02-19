(function($){
    $(function(){
        
        mxBuilder.dialogs.progressDialog.show("Loading website please wait...")
        
        //loading the assets first
        mxBuilder.api.assets.get({
            success: function(data){
                for(var a in data.assets){
                    mxBuilder.assets.add(data.assets[a]);
                }
                //load the website
                mxBuilder.api.website.get({
                    success: function(data){
                        var theWebsite = JSON.parse(data.content);
                        mxBuilder.pages.restorePages(theWebsite);
                        mxBuilder.dialogs.progressDialog.hide(); 
                        setInterval(function(){
                            mxBuilder.recorder.saveIfRequired();
                        },5000);
                        $(document.body).trigger("systemReady");
                    },
                    error: function(data){
                        mxBuilder.dialogs.progressDialog.msg("Couldn't load your website, maybe you haven't built one yet !");
                        mxBuilder.pages.addPage({
                            title: "Home Page",
                            htmlTitle: "Home Page",
                            parent: "root",
                            showInMenu: true,
                            homepage: true,
                            address: "home_page",
                            desc: "",
                            keywords: ""
                        })
                        setTimeout(function(){
                            mxBuilder.dialogs.progressDialog.hide(); 
                        },2000);
                        setInterval(function(){
                            mxBuilder.recorder.saveIfRequired();
                        },5000);
                    }
                });
            }
        });
        
    });
}(jQuery));
