(function($) {
    $(function() {

        var photos = mxBuilder.menuManager.menus.photos;
        mxBuilder.menuManager.menus.photosSearch = {
            _theList: null,
            _template: photos._template.clone(),
            init: function init() {
                var searchBox = $('<input type="text" id="photo-search-box"/>');
                var photosSearch = mxBuilder.menuManager.menus.photosSearch;

                mxBuilder.menuManager.addButtonTo("flexly-icon-back-light", "main").on({
                    click: function click() {
                        mxBuilder.menuManager.showTab("photos");
                    }
                });

                mxBuilder.menuManager.tabButtonsAux.append(searchBox);

                this._theList = this._template.clone().appendTo(mxBuilder.menuManager.contentTab);

                mxBuilder.assets.each(function() {
                    photos.addItem(this, false, photosSearch._theList);
                });

                searchBox.on({
                    input: function input() {
                        var searchQuery = $(this).val();
                        photosSearch._theList.find(".left-column ul, .right-column ul").empty();
                        mxBuilder.assets.each(function() {
                            if (searchQuery === "" || this.name.match(new RegExp(".*" + searchQuery + ".*", "i"))) {
                                photos.addItem(this, false, photosSearch._theList);
                            }
                        });
                        mxBuilder.menuManager.revalidateScrollbar();
                    }
                }).focus();
            }
        };
    });
}(jQuery));