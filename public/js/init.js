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
                mxBuilder.pages.restorePages(JSON.parse(data.content));
                mxBuilder.dialogs.progressDialog.hide(); 
            },
            error: function(data){
                mxBuilder.dialogs.progressDialog.msg("Couldn't load your website, maybe you haven't built one yet !");
                setTimeout(function(){
                    mxBuilder.dialogs.progressDialog.hide(); 
                },2000);
            }
        });
    });
}(jQuery));
