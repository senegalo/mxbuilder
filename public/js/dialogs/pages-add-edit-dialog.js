(function($){
    
    $(function(){
        var isEdit = false;
        var pageID = null;
        var theDialog = mxBuilder.layout.templates.find(".pages-add-edit-dialog").appendTo(mxBuilder.layout.selectionSafe).dialog({
            zIndex: 10000008,
            resizable: false,
            autoOpen: false,
            title: "Page Settings",
            buttons: {
                Save: function(){
                    var data = mxBuilder.dialogs.pagesAddEditDialog.validateData();
                    if(data){
                        if(isEdit){
                            var pageObj = data;
                            pageObj.id = pageID;
                            mxBuilder.pages.editPage(pageObj);
                        } else {
                            mxBuilder.pages.addPage(mxBuilder.dialogs.pagesAddEditDialog.getData());
                        }
                        $(this).dialog("close");
                    }
                },
                Cancel: function(){
                    $(this).dialog("close");
                }
            }
        });
        
        theDialog.find("#page-title").on({
            input: function input(){
                var that = $(this);
                theDialog.find("#page-address").val(that.val().replace(/[^a-zA-Z0-9\s]/g,"").replace(/\s+/g,"_"));
            }
        })
        .end()
        .find("#page-address").on({
            input: function input(){
                var that = $(this);
                that.val(that.val().replace(/[^a-zA-Z0-9_]/g,""));
            }
        });
   
    
        mxBuilder.dialogs.pagesAddEditDialog = {
            show: function show(data){
                mxBuilder.layout.pagesSelect.children().clone()
                .appendTo(theDialog.find("#page-parent").empty().append('<option value="root">Root</option>'));
                if(data){
                    isEdit = true;
                    pageID = data.id;
                    this.setData(data);
                } else {
                    this.setData({
                        title: "",
                        htmlTitle: "",
                        desc: "",
                        keyword: ""
                    });
                    
                    isEdit = false;
                }
                theDialog.dialog("open");
            },
            setData: function setData(data){
                theDialog.find("#page-title").val(data.title);
                theDialog.find("#page-html-title").val(data.htmlTitle);
                theDialog.find("#page-parent").val(data.parent);
                if(typeof data.showInMenu == "undefined" || data.showInMenu === true){
                    theDialog.find("#page-show-in-menu").attr("checked","checked");
                } else {
                    theDialog.find("#page-show-in-menu").removeAttr("checked","checked");
                }
                theDialog.find("#page-address").val(data.address);
                theDialog.find("#page-desc").val(data.desc);
                theDialog.find("#page-keywords").val(data.keywords);
            },
            getData: function getData(){
                return {
                    title: theDialog.find("#page-title").val(),
                    htmlTitle: theDialog.find("#page-html-title").val(),
                    parent: theDialog.find("#page-parent").val(),
                    showInMenu: theDialog.find("#page-show-in-menu").is(":checked"),
                    address: theDialog.find("#page-address").val(),
                    desc: theDialog.find("#page-desc").val(),
                    keywords: theDialog.find("#page-keywords").val()
                }
            },
            validateData: function validateData(){
                var theData = this.getData();
                theData.address = theData.address.replace(/[^a-zA-Z0-9_]/g,"");
                if(theData.title == ""){
                    mxBuilder.dialogs.alertDialog.show("Title cannot be left blank");
                    return false;
                } else if(theData.address == ""){
                    mxBuilder.dialogs.alertDialog.show("Address field cannot be left blank");
                    return false;
                }
                return theData;
            }
        } 
    });
    
}(jQuery));