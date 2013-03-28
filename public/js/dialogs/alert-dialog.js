(function($) {
    $(function() {
        var theDialog = mxBuilder.dialogs.flexlyDialog.create({
            zIndex: 10000008,
            resizable: false,
            autoOpen: false,
            modal: true,
            title: "Alert",
            buttons: [{
                    label: "OK",
                    isDefaultAction: true,
                    klass: "flexly-icon-check-big-black",
                    click: function() {
                        $(this).dialog("close");
                    }
                }]
        });
        mxBuilder.dialogs.alertDialog = {
            show: function show(msg) {
                theDialog.find(".flexly-dialog-content").html(msg);
                theDialog.dialog("open");
            }
        };
    });
}(jQuery));