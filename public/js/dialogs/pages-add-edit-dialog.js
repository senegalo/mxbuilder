(function($){
    
    $(function(){
        var callback, pageID;
        var cachedTitle;
        
        var theDialog = mxBuilder.layout.templates.find(".pages-add-edit-dialog").appendTo(mxBuilder.layout.selectionSafe).dialog({
            zIndex: 10000008,
            resizable: false,
            autoOpen: false,
            title: "Page Settings",
            buttons: {
                Save: function(){
                    var data = mxBuilder.dialogs.pagesAddEditDialog.validateData();
                    if(data){
                        if(pageID){
                            data.id = pageID;
                        }
                        callback(data);
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
                var theAddress = theDialog.find("#page-address");
                
                //getting the last valid address from the cached title
                var validateCachedTitle = mxBuilder.pages.validateAddress(mxBuilder.utils.strToAddress(cachedTitle));
                
                //if the address is empty or equal to the last valid address from the cached title we upate it
                if(theAddress.val() == "" || validateCachedTitle == theAddress.val()){
                    var address = mxBuilder.pages.validateAddress(mxBuilder.utils.strToAddress(that.val()));
                    theAddress.val(address);
                }
                
                cachedTitle = that.val();
            }
        })
        .end()
        .find("#page-address").on({
            input: function input(){
                var that = $(this);
                that.val(mxBuilder.pages.validateAddress(that.val()));
            }
        })
        .end()
        .find("#page-as-homepage").on({
            change: function(){
                mxBuilder.dialogs.pagesAddEditDialog.setHomepage($(this).is(":checked"));
            }
        });
   
    
        mxBuilder.dialogs.pagesAddEditDialog = {
            show: function show(properties){
                cachedTitle = "";
                mxBuilder.layout.pagesSelect.children().clone()
                .appendTo(theDialog.find("#page-parent").empty().append('<option value="root">Root</option>'));
                if(properties && properties.data){
                    pageID = properties.data.id;
                    this.setData(properties.data);
                } else {
                    pageID = null;
                    this.setData({
                        title: "",
                        htmlTitle: "",
                        address: "",
                        desc: "",
                        keyword: ""
                    });
                }
                if(properties && properties.callback){
                    callback = properties.callback;
                }
                theDialog.dialog("open");
            },
            setData: function setData(data){
                cachedTitle = data.title;
                theDialog.find("#page-title").val(data.title);
                theDialog.find("#page-html-title").val(data.htmlTitle);
                theDialog.find("#page-parent").val(data.parent);
                theDialog.find("#page-address").val(data.address).data("address-cache",data.address);
                theDialog.find("#page-desc").val(data.desc);
                theDialog.find("#page-keywords").val(data.keywords);
                if(typeof data.showInMenu == "undefined" || data.showInMenu === true){
                    theDialog.find("#page-show-in-menu").attr("checked","checked");
                } else {
                    theDialog.find("#page-show-in-menu").removeAttr("checked","checked");
                }
                if(data.homepage){
                    theDialog.find("#page-as-homepage")
                    .attr("checked","checked")
                    .end()
                    .find(".page-as-homepage").hide()
                    .end()
                    .find(".page-is-homepage").show();
                    
                    this.setHomepage(true);
                } else {
                    theDialog.find(".page-as-homepage").show()
                    .end()
                    .find(".page-is-homepage").hide()
                    .end()
                    .find("#page-as-homepage").removeAttr("checked");
                    
                    this.setHomepage(false,data.address);
                }
            },
            getData: function getData(){
                var theAddress = theDialog.find("#page-address");
                theAddress = theAddress.val() == "index" && theAddress.data("address-cache") ? theAddress.data("address-cache") : theAddress.val(); 
                return {
                    title: theDialog.find("#page-title").val(),
                    htmlTitle: theDialog.find("#page-html-title").val(),
                    parent: theDialog.find("#page-parent").val(),
                    showInMenu: theDialog.find("#page-show-in-menu").is(":checked"),
                    homepage: theDialog.find("#page-as-homepage").is(":checked"),
                    address: theAddress,
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
            },
            setHomepage: function setHomepage(flag,address){
                var theAddress = theDialog.find("#page-address");
                if(flag){
                    theAddress.attr("disabled","disabled").data("address-cache",theAddress.val()).val("index");
                } else {
                    var cachedData = theAddress.data("address-cache");
                    theAddress.removeAttr("disabled").val(address?address:cachedData);
                }
            },
            close: function close(){
                theDialog.dialog("close");
            }
        } 
    });
    
}(jQuery));