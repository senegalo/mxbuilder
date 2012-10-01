(function($){
    $(function(){
        var linkCallback,unlinkCallback;
        
        var theDialog = mxBuilder.layout.templates.find(".linkto-dialog").remove().dialog({
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
                    $(this).trigger("link").dialog("close");
                },
                "Remove Link": function (){
                    alert("Sorry Brother... Not Implemented yet... \ntry again soo... Heeeiii2.. sorry hickup .. soon");
                    $(this).trigger("unlink").dialog("close");
                },
                Cancel: function Cancel(){
                    $(this).dialog("close");
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
            }
        });
        
        
        mxBuilder.dialogs.linkTo = {
            show: function show(obj){
                linkCallback = obj && obj.link ? obj.link : null;
                unlinkCallback = obj && obj.unlink ? obj.unlink : null;
                
                if(obj.currentLinkObj){
                    this.setLinkObj(obj.currentLinkObj);
                }
                
                theDialog.dialog("open");
            },
            setLinkObj: function(obj){
                theDialog.find('input[value="'+obj.type+'"]').attr("checked","checked");
                switch(obj.type){
                    case "external":
                        theDialog.find('input[name="external_link"]').val(obj.url);
                        break;
                    case "email":
                        theDialog.find('input[name="email"]').val();
                        break;
                    case "page":
                        break;
                    case "lightbox":
                        break;
                }
            },
            getLinkObj: function(){
                var theUrl = {
                    type: theDialog.find('input[name="link_type"]').filter(":checked").val()
                };
                switch(theUrl.type){
                    case "external":
                        theUrl.url = "http://"+theDialog.find('input[name="external_link"]').val();
                        break;
                    case "email":
                        theUrl.url = "mailto:"+theDialog.find('input[name="email"]').val();
                        break;
                    case "page":
                        break;
                    case "lightbox":
                        break;
                }
                return theUrl;
            }
        } 
    });
}(jQuery));