(function($){
    mxBuilder.save = function(){
        localStorage.setItem("stored-website", JSON.stringify(mxBuilder.pages.saveAll()));
    }
    $(function(){
        mxBuilder.layout.menu.find("#save").on({
            click: function(){
                mxBuilder.dialogs.progressDialog.show("Saving...");
                mxBuilder.api.website.save({
                    websiteData: JSON.stringify(mxBuilder.pages.saveAll()),
                    success: function(data){
                        mxBuilder.dialogs.progressDialog.msg("Saved Successfully...");
                        setTimeout(function(){
                            mxBuilder.dialogs.progressDialog.hide();
                        },2000);
                    }
                });
            }
        });
    })
}(jQuery));