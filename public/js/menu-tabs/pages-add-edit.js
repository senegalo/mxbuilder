(function($){
    $(function(){
        var template = mxBuilder.layout.templates.find(".pages-add-edit-tab").remove();
        mxBuilder.menuManager.menus.pagesAddEdit = {
            __theForm: null,
            __cachedTitle: null,
            __pageID: null,
            init: function init(data){
                mxBuilder.menuManager.hideTabButtons();
                mxBuilder.menuManager.tabFooterWrapper.height(66).show();
                mxBuilder.menuManager.tabTitle.text(data?"Edit Pages":"Add Page");
                
                this.__theForm = template.clone();
                
                mxBuilder.menuManager.addFooterSaveButton().on({
                    click: function(){
                        var namespace = mxBuilder.menuManager.menus.pagesAddEdit;
                        var data = namespace.validateData();
                        if(data){
                            if(namespace.__pageID){
                                data.id = namespace.__pageID;
                                mxBuilder.pages.editPage(data);
                            } else {
                                mxBuilder.pages.addPage(data);
                            }
                            mxBuilder.menuManager.showTab("pages");
                        }
                    }
                }).appendTo(mxBuilder.menuManager.tabFooter);
                
                mxBuilder.menuManager.addFooterCancelButton().on({
                    click: function(){
                        mxBuilder.menuManager.showTab("pages");
                    }
                }).appendTo(mxBuilder.menuManager.tabFooter);
                
                
                
                this.__theForm.find("#page-title").on({
                    input: function input(){
                        var that = $(this);
                        var theAddress = mxBuilder.menuManager.menus.pagesAddEdit.__theForm.find("#page-address");
                
                        //getting the last valid address from the cached title
                        var validateCachedTitle = mxBuilder.pages.validateAddress(mxBuilder.utils.strToAddress(mxBuilder.menuManager.menus.pagesAddEdit.__cachedTitle));
                
                        //if the address is empty or equal to the last valid address from the cached title we upate it
                        if(theAddress.val() == "" || validateCachedTitle == theAddress.val()){
                            var address = mxBuilder.pages.validateAddress(mxBuilder.utils.strToAddress(that.val()));
                            theAddress.val(address);
                        }
                
                        mxBuilder.menuManager.menus.pagesAddEdit.__cachedTitle = that.val();
                    }
                })
                .removeClass("page-add-edit-error")
                .end()
                .find("#page-address").on({
                    input: function input(){
                        var that = $(this);
                        that.val(mxBuilder.pages.validateAddress(that.val()));
                    }
                })
                .removeClass("page-add-edit-error")
                .end()
                .find("#page-as-homepage").on({
                    change: function(){
                        mxBuilder.menuManager.menus.pagesAddEdit.setHomepage($(this).is(":checked"));
                    }
                })
                .end()
                .find('input[type="checkbox"]').checkbox();
                
                
                if(data){
                    this.__pageID = data.id;
                    this.setData(data);
                } else {
                    this.__pageID = null;
                    this.setData({
                        title: "",
                        htmlTitle: "",
                        address: "",
                        desc: "",
                        keyword: ""
                    });
                }
                
                mxBuilder.menuManager.contentTab.append(this.__theForm);
            },
            setData: function setData(data){
                this.__cachedTitle = data.title;
                this.__theForm.find("#page-title").val(data.title);
                this.__theForm.find("#page-html-title").val(data.htmlTitle);
                this.__theForm.find("#page-address").val(data.address).data("address-cache",data.address);
                this.__theForm.find("#page-desc").val(data.desc);
                this.__theForm.find("#page-keywords").val(data.keywords);
                if(typeof data.showInMenu == "undefined" || data.showInMenu === true){
                    this.__theForm.find("#page-show-in-menu").attr("checked","checked").trigger("change");
                } else {
                    this.__theForm.find("#page-show-in-menu").removeAttr("checked","checked").trigger("change");
                }
                if(data.homepage){
                    this.__theForm.find("#page-as-homepage")
                    .attr("checked","checked").checkbox("update")
                    .end()
                    .find(".page-as-homepage").hide()
                    .end()
                    .find(".page-is-homepage").show();
                    
                    this.setHomepage(true);
                } else if (data.parent != "root"){
                    this.__theForm.find(".page-as-homepage").hide()
                    .end()
                    .find(".page-is-homepage").find("i").text("Subpages can't be set as homepage !").show();
                } else {
                    this.__theForm.find(".page-as-homepage").show()
                    .end()
                    .find(".page-is-homepage").hide()
                    .end()
                    .find("#page-as-homepage").removeAttr("checked").checkbox("update");
                    
                    this.setHomepage(false,data.address);
                }
            },
            getData: function getData(){
                var theAddress = this.__theForm.find("#page-address");
                theAddress = theAddress.val() == "index" && theAddress.data("address-cache") ? theAddress.data("address-cache") : theAddress.val(); 
                return {
                    title: this.__theForm.find("#page-title").val(),
                    htmlTitle: this.__theForm.find("#page-html-title").val(),
                    showInMenu: this.__theForm.find("#page-show-in-menu").is(":checked"),
                    homepage: this.__theForm.find("#page-as-homepage").is(":checked"),
                    address: theAddress,
                    desc: this.__theForm.find("#page-desc").val(),
                    keywords: this.__theForm.find("#page-keywords").val()
                }
            },
            validateData: function validateData(){
                var theData = this.getData();
                theData.address = theData.address.replace(/[^a-zA-Z0-9_]/g,"");
                var titleInput = this.__theForm.find("#page-title");
                var addressInput = this.__theForm.find("#page-address");
                var error = [];
                
                if(theData.title == ""){
                    error.push("Title cannot be left blank");
                    titleInput.addClass("page-add-edit-error");
                } else {
                    titleInput.removeClass("page-add-edit-error");
                }
                
                if(theData.address == ""){
                    error.push("Address field cannot be left blank");
                    addressInput.addClass("page-add-edit-error");
                } else {
                    addressInput.removeClass("page-add-edit-error");
                }
                
                if(error.length != 0){
                    mxBuilder.dialogs.alertDialog.show(error.join("<br/>"));
                    return false;
                } else {
                    return theData;
                }
            },
            setHomepage: function setHomepage(flag,address){
                var theAddress = this.__theForm.find("#page-address");
                if(flag){
                    theAddress.attr("disabled","disabled").data("address-cache",theAddress.val()).val("index");
                } else {
                    var cachedData = theAddress.data("address-cache");
                    theAddress.removeAttr("disabled").val(address?address:cachedData);
                }
            }
        }
    });
}(jQuery));