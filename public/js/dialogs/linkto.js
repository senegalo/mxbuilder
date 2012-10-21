(function($){
    $(function(){
        var linkCallback,unlinkCallback,cancelCallback,closeCallback;
        
        var theDialog = mxBuilder.layout.templates.find(".linkto-dialog").appendTo(mxBuilder.layout.selectionSafe).dialog({
            title: "Link To",
            zIndex: 10000008,
            resizable: false,
            width: 400,
            dialogClass: "link-to-dialog prevents-editor-close",
            autoOpen: false,
            open: function open(){
                mxBuilder.activeStack.push(this);
            },
            buttons: {
                Link: function Link(){
                    $(this).trigger("unlink").trigger("link").dialog("close");
                },
                Unlink: function Unlink(){
                    $(this).trigger("unlink").dialog("close");
                },
                Cancel: function Cancel(){
                    $(this).trigger("cancel").dialog("close");
                }
            }
        }).on({
            poppedFromActiveStack: function poppedFromActiveStack(){
                $(this).dialog("close");
            }, 
            link: function(){
                if(linkCallback){
                    linkCallback(mxBuilder.dialogs.linkTo.getLinkObj());
                }
            },
            unlink: function(){
                if(unlinkCallback){
                    unlinkCallback();
                }
            }, 
            cancel: function(){
                if(cancelCallback){
                    cancelCallback();
                }
            },
            dialogclose: function(){
                if(closeCallback){
                    closeCallback();
                }
            }
        });
        
        
        mxBuilder.dialogs.linkTo = {
            show: function show(obj){
                linkCallback = obj && obj.link ? obj.link : null;
                unlinkCallback = obj && obj.unlink ? obj.unlink : null;
                cancelCallback = obj && obj.cancel ? obj.cancel : null;
                closeCallback = obj && obj.close ? obj.close : null;
                
                theDialog.find('select[name="page"]').empty().append(mxBuilder.layout.pagesSelect.children().clone());
                
                if(obj.lightbox){
                    theDialog.find(".lightbox").show();
                } else {
                    theDialog.find(".lightbox").hide();
                }
                
                this.setLinkObj(obj.urlObj);
                
                theDialog.dialog("open");
            },
            setLinkObj: function setLinkObj(obj){
                if(obj){
                    theDialog.find('.link-input').val('');
                    theDialog.find('.link-type').filter('input[value="'+obj.type+'"]').attr("checked","checked");
                    switch(obj.type){
                        case "external":
                            theDialog.find('input[name="external_link"]').val(obj.url);
                            break;
//                        case "email":
//                            theDialog.find('input[name="email"]').val(obj.url);
//                            break;
                        case "page":
                            var address = mxBuilder.pages.getPageByAddress(obj.url.replace(/\.html$/,""));
                            if(address){
                                theDialog.find('select[name="page"]').val(address.id);
                            }
                            break;
                        case "lightbox":
                            
                            break;
                    }
                } else {
                    theDialog.find('input[name="external_link"]').val('');
//                    theDialog.find('input[name="email"]').val('');
                    theDialog.find('input[name=""]').val('');
                    theDialog.find('input[name=""]').val('');
                    theDialog.find('.link-type').filter('input:checked').removeAttr("checked");
                }
            },
            getLinkObj: function getLinkObj(){
                var theUrl = {
                    type: theDialog.find('input[name="link_type"]').filter(":checked").val()
                };
                switch(theUrl.type){
                    case "external":
                        theUrl.url = theDialog.find('input[name="external_link"]').val();
                        break;
//                    case "email":
//                        theUrl.url = theDialog.find('input[name="email"]').val();
//                        break;
                    case "page":
                        var thePage = mxBuilder.pages.getPageObj(theDialog.find('select[name="page"]').val());
                        theUrl.url = thePage.address+".html";
                        break;
                    case "lightbox":
                        break;
                }
                return theUrl;
            }
        } 
    });
}(jQuery));