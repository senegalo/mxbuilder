(function($){
    mxBuilder.save = function(){
        localStorage.setItem("stored-website", JSON.stringify(mxBuilder.pages.saveAll()));
    }
    $(function(){
        mxBuilder.layout.menu.find("#save").on({
            click: function(){
                mxBuilder.save();
                mxBuilder.dialogs.alertDialog.show("Saved Successfully...");
            }
        });
    })
}(jQuery));