(function($){
    
    $(function(){
        var isEdit = false;
        var pageID = null;
        var theDialog = mxBuilder.layout.templates.find(".pages-add-edit-dialog").remove().dialog({
            zIndex: 10000008,
            resizable: false,
            autoOpen: false,
            buttons: {
                Add: function(){
                    if(isEdit){
                        var thePage = mxBuilder.pages.getPageObj(pageID);
                        $.extend(thePage,mxBuilder.dialogs.pagesAddEditDialog.getData());
                    } else {
                        mxBuilder.pages.addPage(mxBuilder.dialogs.pagesAddEditDialog.getData());
                    }
                    $(this).dialog("close");
                },
                Cancel: function(){
                    $(this).dialog("close");
                }
            }
        })
   
    
        mxBuilder.dialogs.pagesAddEditDialog = {
            show: function show(data){
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
                theDialog.find("#page-desc").val(data.desc);
                theDialog.find("#page-keywords").val(data.keywords);
            },
            getData: function getData(){
                return {
                    title: theDialog.find("#page-title").val(),
                    htmlTitle: theDialog.find("#page-html-title").val(),
                    desc: theDialog.find("#page-desc").val(),
                    keywords: theDialog.find("#page-keywords").val()
                }
            }
        } 
    });
    
}(jQuery));