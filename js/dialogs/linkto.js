(function($){
    $(function(){
        var html = '<div>';
        html += '<button class="external-link">External Address</button><button class="mailto-link">Email</button>';
        html += '<br/>';
        html += '<button class="assets-link">Link to Assets</button><button class="page-link">Link to a page</button>';
        html += '</div>';
        var theDialog = $(html).dialog({
            title: "Link To",
            zIndex: 10000008,
            resizable: false,
            dialogClass: "link-to-dialog prevents-editor-close",
            autoOpen: false,
            open: function open(){
                mxBuilder.activeStack.push(this);
            },
            buttons: {
                Link: function Link(){
                    $(this).trigger("submit").dialog("close");
                },
                Cancel: function Cancel(){
                    $(this).dialog("close");
                }
            }
        }).on({
            poppedFromActiveStack: function poppedFromActiveStack(){
                $(this).dialog("close");
            }
        });
        mxBuilder.dialogs.linkto = {
            show: function show(source,instance){
                theDialog.dialog("open");
                if(source == "cke"){
                    theDialog.on({
                        dialogclose: function dialogclose(){
                            instance.focus();
                        },
                        submit: function submit(){
                            instance.focus();
                            var style = new CKEDITOR.style({
                                element: 'a',
                                attributes: {
                                    href: "http://www.google.com"
                                }
                            });
                            style.type = CKEDITOR.STYLE_INLINE;
                            style.apply(instance);
                        }
                    });
                }
            }
        } 
    });
}(jQuery));