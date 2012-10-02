(function($){
    $(function(){
        var theWebsiteSelect = $("#website-pages");
        mxBuilder.pages = {
            __pages: {},
            __currentPage: null,
            addPage: function addPage(properties){
                if(typeof properties.id == "undefined"){
                    var id = mxBuilder.utils.GUID();
                    properties.id = id;
                }
                this.__pages[properties.id] = properties;
                theWebsiteSelect.append('<option value="'+properties.id+'">'+properties.title+'</option>');
                this.loadPage(properties.id);
            },
            getPageObj: function getPageObj(id){
                return this.__pages[id];
            },
            getCurrentPageID: function getCurrentPageID(){
                return this.__currentPage;
            },
            loadPage: function loadPage(id){
                if(this.__pages[id]){
                    //removing old components
                    this.__currentPage = id;
                    theWebsiteSelect.val(id);
                    $('title').html(this.__pages[id].htmlTitle);
                    
                }
            },
            attachComponentToPage: function attachComponentToPage(component){
                var pageID = component.page ? component.page : this.__currentPage;
                component.page = pageID;
                this.__pages[pageID].components[component.id] = component;
            }
        } 
        
        $("#add-pages").on({
            click: function(){
                mxBuilder.dialogs.pagesAddEditDialog.show();
            }
        })
        
    });
}(jQuery))