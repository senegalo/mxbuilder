(function($){    
    var currentCallback, theDialog;
    $(function(){
        theDialog = $("<div>Are you sure you want to delete the selected component(s) ?</div>").dialog({
            modal: true,
            draggable: false,
            resizable: false,
            zIndex: 10000009,
            autoOpen: false,
            title: "Delete Confirmation",
            buttons: {
                Cancel: function(){
                    $(this).dialog("close");
                },
                Ok: function(event){
                    currentCallback.call(this,event);
                    $(this).dialog("close");
                }
            }
        });
    });
    mxBuilder.dialogs.deleteComponents = function deleteComponents(callback){
        currentCallback = callback;
        theDialog.dialog("open");
    }
    
}(jQuery))