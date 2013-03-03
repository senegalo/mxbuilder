(function($){
    $(function(){
        var linkCallback,unlinkCallback,cancelCallback,closeCallback;
        
        var theDialog = mxBuilder.layout.templates.find(".linkto-dialog").appendTo(mxBuilder.layout.selectionSafe).dialog({
            title: "Link To",
            zIndex: 40000000,
            resizable: false,
            width: 400,
            dialogClass: "link-to-dialog prevents-editor-close",
            autoOpen: false,
            open: function open(){
                mxBuilder.activeStack.push(this);
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
        }).find('input[name="external_link"]').on({
            input: function(){
                theDialog.find('.link-type').filter('input[value="external"]').attr("checked","checked");
            }
        })
        .end()
        .find('select[name="page"]').on({
            change: function(){
                theDialog.find('.link-type').filter('input[value="page"]').attr("checked","checked");
            }
        })
        .end()
        .find(".link-type").on({
            change: function(){
                var theNewWin = theDialog.find("#linkto-new-window");
                switch($(this).val()){
                    case "external":
                        theNewWin.removeAttr("disabled").attr("checked","checked");
                        break;
                    case "page":
                        theNewWin.removeAttr("disabled").removeAttr("checked");
                        break;
                    case "lightbox":
                        theNewWin.removeAttr("checked").attr("disabled","disabled");
                        break;
                }
            }
        })
        .end();
        
        
        mxBuilder.dialogs.linkTo = {
            show: function show(obj){
                linkCallback = obj && obj.link ? obj.link : null;
                unlinkCallback = obj && obj.unlink ? obj.unlink : null;
                cancelCallback = obj && obj.cancel ? obj.cancel : null;
                closeCallback = obj && obj.close ? obj.close : null;
                
                theDialog.find('select[name="page"]').empty().append(mxBuilder.layout.utils.getOrderdPagesList());
                
                if(obj.imageBox){
                    theDialog.find(".lightbox").show()
                    .end()
                    .dialog("option","buttons",{
                        Link: function Link(){
                            $(this).trigger("link").dialog("close");
                        },
                        Unlink: function Unlink(){
                            $(this).trigger("unlink").dialog("close");
                        },
                        Cancel: function Cancel(){
                            $(this).trigger("cancel").dialog("close");
                        }
                    });
                } else {
                    theDialog.find(".lightbox").hide()
                    .end()
                    .dialog("option","buttons",{
                        Link: function Link(){
                            $(this).trigger("link").dialog("close");
                        },
                        Cancel: function Cancel(){
                            $(this).trigger("cancel").dialog("close");
                        }
                    });
                }
                
                this.setLinkObj(obj.urlObj);
                
                theDialog.dialog("open");
            },
            setLinkObj: function setLinkObj(obj){
                if(obj){
                    var theProtocolSelect = theDialog.find("#linkto-protocol");
                    theDialog.find('.link-input').val('');
                    theDialog.find('.link-type').filter('input[value="'+obj.type+'"]').attr("checked","checked");
                    theProtocolSelect.val("http://");
                    if(obj.newWindow){
                        theDialog.find("#linkto-new-window").attr("checked","checked");
                    } else {
                        theDialog.find("#linkto-new-window").removeAttr("checked");
                    }
                    switch(obj.type){
                        case "external":
                            var protocol = obj.url.match(/^(https:\/\/|http:\/\/)/ig);
                            if(protocol){
                                theProtocolSelect.val(protocol[0].toLowerCase());
                                obj.url = obj.url.replace(protocol[0],"");
                            } 
                            theDialog.find('input[name="external_link"]').val(obj.url);
                            break;
                        case "page":
                            var page = mxBuilder.pages.getPageObj(obj.pageID);
                            if(page){
                                theDialog.find('select[name="page"]').val(page.id);
                            }
                            break;
                        case "lightbox":
                            
                            break;
                    }
                } else {
                    theDialog.find('input[name="external_link"]').val('');
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
                        theUrl.url = theDialog.find("#linkto-protocol").val()+theDialog.find('input[name="external_link"]').val();
                        break;
                    case "page":
                        var thePage = mxBuilder.pages.getPageObj(theDialog.find('select[name="page"]').val());
                        theUrl.pageID = thePage.id;
                        break;
                    case "lightbox":
                        break;
                }
                var newWindow = theDialog.find("#linkto-new-window");
                if(newWindow.is(":disabled")){
                    theUrl.newWindow = false;
                } else {
                    theUrl.newWindow = newWindow.is(":checked");
                }
                return theUrl;
            }
        } 
    });
}(jQuery));