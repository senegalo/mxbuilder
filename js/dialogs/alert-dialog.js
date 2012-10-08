(function($){
    
    $(function(){
        var theDialog = mxBuilder.layout.templates.find(".alert-dialog").appendTo(mxBuilder.layout.selectionSafe).dialog({
            zIndex: 10000008,
            resizable: false,
            autoOpen: false,
            modal: true,
            title: "Alert",
            buttons: {
                Ok: function(){
                    $(this).dialog("close");
                }
            }
        })
   
    
        mxBuilder.dialogs.alertDialog = {
            show: function show(msg){
                theDialog.text(msg);
                theDialog.dialog("open");
            }
        } 
    });
    
}(jQuery));