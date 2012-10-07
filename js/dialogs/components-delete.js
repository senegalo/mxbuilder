(function($){    
    var currentCallback, theDialog;
    $(function(){
        theDialog = $("<div></div>").dialog({
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
    mxBuilder.dialogs.deleteDialog = function(obj){
        obj.msg = obj.msg ? obj.msg : "Please confirm the delete operation.";
        theDialog.html(obj.msg);
        currentCallback = obj.callback;
        theDialog.dialog("open");
    }
    
}(jQuery))