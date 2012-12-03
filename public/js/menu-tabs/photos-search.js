(function($){
    $(function(){
        
        var photos = mxBuilder.menuManager.menus.photos;
        mxBuilder.menuManager.menus.photosSearch = {
            __theList: null,
            __template: photos.__template.clone(),
            init: function init(){
                var searchBox = $('<input type="text" id="photo-search-box"/>');
                var photosSearch = mxBuilder.menuManager.menus.photosSearch;
                mxBuilder.menuManager.addButtonTo("flexly-icon-search-light","main");
                mxBuilder.menuManager.tabButtonsAux.append(searchBox);
            
                this.__theList = this.__template.clone().appendTo(mxBuilder.menuManager.contentTab);
            
                mxBuilder.assets.each(function(){
                    photos.addItem(this,false,photosSearch.__theList);
                });
                
                searchBox.on({
                    input: function input(){
                        var searchQuery = $(this).val();
                        photosSearch.__theList.find(".left-column ul, .right-column ul").empty();
                        mxBuilder.assets.each(function(){
                            if(searchQuery == ""  || this.name.match(new RegExp(".*"+searchQuery+".*","i"))){
                                photos.addItem(this,false,photosSearch.__theList);
                            }
                        });
                        mxBuilder.menuManager.revalidateScrollbar();
                    }
                });
                
            }
        }
    });
}(jQuery))