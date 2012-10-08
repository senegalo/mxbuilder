(function($){
    mxBuilder.save = function(){
        localStorage.ws1 = JSON.stringify(mxBuilder.components.saveAll());
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