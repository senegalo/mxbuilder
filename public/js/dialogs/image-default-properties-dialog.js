(function($){
    $(function(){
        
        var saveCallback;
        
        var theDialog = mxBuilder.layout.templates.find(".image-default-properties-dialog").appendTo(mxBuilder.layout.selectionSafe).dialog({
            zIndex: 10000008,
            resizable: false,
            autoOpen: false,
            title: "Image Default Properties",
            buttons: {
                Save: function(){
                    if(saveCallback){
                        saveCallback(mxBuilder.dialogs.imageDefaultPropertiesDialog.getData());
                    }
                    $(this).dialog("close");
                }, 
                Close: function(){
                    $(this).dialog("close");
                }
            }
        });
        
        mxBuilder.dialogs.imageDefaultPropertiesDialog = {
            show: function show(args){
                this.setData(args);
                saveCallback = args.saveCallback?args.saveCallback:null;
                theDialog.dialog("open");
            },
            setData: function setData(data){
                theDialog.find("#image-default-title").val(data.title?data.title:"");
                theDialog.find("#image-default-caption").val(data.caption?data.caption:"");
            },
            getData: function getData(){
                return {
                    title: theDialog.find("#image-default-title").val(),
                    caption: theDialog.find("#image-default-caption").val()
                };
                
            }
        }
        
    });
}(jQuery))