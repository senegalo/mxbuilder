(function($){
    mxBuilder.save = {
        __lastState: null,
        __forceSave: false,
        saveInterval: function(){
            var savedObj = mxBuilder.pages.saveAll();
            var currentState = JSON.stringify(savedObj);
            if(this.__forceSave || (this.__lastState !== null && this.__lastState != currentState)){
                this.save(currentState);
            }
            this.__forceSave = false;
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
        },
        setLastState: function setLastState(lastState){
            this.__lastState = JSON.stringify(lastState);
        },
        forceSave: function forceSave(){
            this.__forceSave = true;
        }
    }
    
    $(function(){
        mxBuilder.save.tooltip = mxBuilder.layout.templates.find(".save-tooltip").remove().appendTo(mxBuilder.layout.selectionSafe); 
    });
//    })
}(jQuery));