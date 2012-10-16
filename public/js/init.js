(function($){
    $(function(){
        
        mxBuilder.dialogs.progressDialog.show("Loading website please wait...")
        mxBuilder.api.website.get({
            success: function(data){
                mxBuilder.pages.restorePages(JSON.parse(data.content));
                mxBuilder.dialogs.progressDialog.hide();
            }
        });
    });
}(jQuery));
