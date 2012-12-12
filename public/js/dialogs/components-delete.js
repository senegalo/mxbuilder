(function($){    
    var currentCallback, theDialog;
    $(function(){
        theDialog = mxBuilder.dialogs.flexlyDialog.create({
            modal: true,
            draggable: false,
            resizable: false,
            zIndex: 10000009,
            autoOpen: false,
            title: "Delete Confirmation",
            buttons: [{
                label: "Cancel",
                klass: "flexly-icon-close-big-black",
                click: function click(){
                    $(this).dialog("close");
                }
            },{
                label: "OK",
                klass: "flexly-icon-check-big-black",
                click: function click(event){
                    currentCallback.call(this,event);
                    $(this).dialog("close");
                }
            }]
        });
    });
    mxBuilder.dialogs.deleteDialog = function(obj){
        obj.msg = obj.msg ? obj.msg : "Please confirm the delete operation.";
        theDialog.find(".flexly-dialog-content").html(obj.msg);
        currentCallback = obj.callback;
        theDialog.dialog("open");
    }
    
}(jQuery))