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
                        console.log("restoring "+(theWebsite.pinned.length+theWebsite.pages[0].components.length)+" component", theWebsite);
                        mxBuilder.pages.restorePages(theWebsite);
                        mxBuilder.dialogs.progressDialog.hide(); 
                        setInterval(function(){
                            mxBuilder.save.saveInterval();
                        },5000);
                    },
                    error: function(data){
                        mxBuilder.dialogs.progressDialog.msg("Couldn't load your website, maybe you haven't built one yet !");
                        setTimeout(function(){
                            mxBuilder.dialogs.progressDialog.hide(); 
                        },2000);
                        setInterval(function(){
                            mxBuilder.save.saveInterval();
                        },5000);
                    }
                });
            }
        });
    });
}(jQuery));
