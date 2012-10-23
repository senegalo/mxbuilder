(function($){
    mxBuilder.save = {
        __lastState: null,
        saveInterval: function(){
            var currentState = JSON.stringify(mxBuilder.pages.saveAll());
            if(this.__lastState !== null && this.__lastState != currentState){
                this.save(currentState);
            }
            this.__lastState = currentState;
        },
        save: function save(str){
            this.tooltip.text("Saving...").show();
            mxBuilder.api.website.save({
                websiteData: str,
                success: function(data){
                    mxBuilder.save.tooltip.text("Saved Successfully...");
                    setTimeout(function(){
                        mxBuilder.save.tooltip.hide();
                    },2000);
                }
            });
        }
    }
    
    setInterval(function(){
        mxBuilder.save.saveInterval();
    },5000);
    
    $(function(){
        mxBuilder.save.tooltip = mxBuilder.layout.templates.find(".save-tooltip").remove().appendTo(mxBuilder.layout.selectionSafe); 
    });
    
//    $(function(){
//        mxBuilder.layout.menu.find("#save").on({
//            click: function(){
//                mxBuilder.dialogs.progressDialog.show("Saving...");
//                mxBuilder.api.website.save({
//                    websiteData: JSON.stringify(mxBuilder.pages.saveAll()),
//                    success: function(data){
//                        mxBuilder.dialogs.progressDialog.msg("Saved Successfully...");
//                        setTimeout(function(){
//                            mxBuilder.dialogs.progressDialog.hide();
//                        },2000);
//                    }
//                });
//            }
//        });
//    })
}(jQuery));