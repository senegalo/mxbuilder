(function($){
    $(function(){
        
        var saveCallback;
        
        var theDialog = mxBuilder.layout.templates.find(".assets-properties-dialog").appendTo(mxBuilder.layout.selectionSafe).dialog({
            zIndex: 10000008,
            resizable: false,
            autoOpen: false,
            title: "Asset Properties",
            buttons: {
                Save: function(){
                    if(saveCallback){
                        saveCallback(theDialog.find("#asset-name-input").val());
                    }
                    $(this).dialog("close");
                },
                Close: function(){
                    $(this).dialog("close");
                }
            }
        });
        
        mxBuilder.dialogs.assetPropertiesDialog = {
            show: function(args){
                if(args.saveCallback){
                    saveCallback = args.saveCallback;
                } else {
                    saveCallback = null;
                }
                theDialog.find("#asset-name-input").val(args.name).end().dialog("open");
            }
        }
        
    });
}(jQuery))