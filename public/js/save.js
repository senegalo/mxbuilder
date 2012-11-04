(function($){
    mxBuilder.save = {
        __lastState: null,
        saveInterval: function(){
            var savedObj = mxBuilder.pages.saveAll();
            var currentState = JSON.stringify(savedObj);
            if(this.__lastState !== null && this.__lastState != currentState){
                console.log("saving "+(savedObj.pinned.length+savedObj.pages[0].components.length)+" component",savedObj);
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
    
    $(function(){
        mxBuilder.save.tooltip = mxBuilder.layout.templates.find(".save-tooltip").remove().appendTo(mxBuilder.layout.selectionSafe); 
    });
//    })
}(jQuery));