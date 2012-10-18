(function($){
    $(function(){
        
        mxBuilder.dialogs.progressDialog.show("Loading website please wait...")
        //loading the assets first
        mxBuilder.api.assets.get({
            success: function(data){
                for(var a in data.assets){
                    mxBuilder.assets.add(data.assets[a]);
                }
            }
        });
        
        //load the website
        mxBuilder.api.website.get({
            success: function(data){
                if(data.success){
                    mxBuilder.pages.restorePages(JSON.parse(data.content));
                }
            },
            error: function(data){
                /**
                 * @todo To be removed in the next commit after all is restored...
                 */
                var savedWebsite = localStorage.getItem("stored-website");
                if(savedWebsite){
                    mxBuilder.pages.restorePages(JSON.parse(savedWebsite));
                }
            },
            complete: function(){
                mxBuilder.dialogs.progressDialog.hide();
            }
        });
    });
}(jQuery));
