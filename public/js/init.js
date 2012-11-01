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
        
        //testing Remove on production
        $('<button style="position:fixed;top:10px;right: 50px;">Get Collision on Selected</button>').on({
            click: function(){
                mxBuilder.selection.each(function(){
                    console.log(mxBuilder.components.detectCollision([this],20));
                });
            }
        }).appendTo(document.body);
        
        //load the website
        mxBuilder.api.website.get({
            success: function(data){
                mxBuilder.pages.restorePages(JSON.parse(data.content));
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
            }
        });
    });
}(jQuery));
