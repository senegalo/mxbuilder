(function($){
    $(function(){
        
        var template = mxBuilder.layout.templates.find(".photos-properties").remove();
        
        mxBuilder.menuManager.menus.photoProperties = {
            init: function init(assetID){
                mxBuilder.menuManager.hideTabButtons();
                mxBuilder.menuManager.tabFooterWrapper.css({height: "66px"}).show();
                
                var theAsset = mxBuilder.assets.get(assetID);
                var theTemplate = template.clone()
                .find("#photo-name")
                .val(theAsset.name)
                .end()
                .find("#photo-title")
                .val(theAsset.title)
                .end()
                .find("#photo-caption")
                .val(theAsset.caption)
                .end();
                
                mxBuilder.menuManager.contentTab.append(theTemplate);
                
                mxBuilder.menuManager.addFooterSaveButton().on({
                    click: function click(){
                        var data = {
                            name: theTemplate.find("#photo-name").val(),
                            title: theTemplate.find("#photo-title").val(),
                            caption: theTemplate.find("#photo-caption").val()
                        }
                        mxBuilder.api.assets.updatePhotoProperties({
                            assetID:assetID,
                            name: data.name,
                            caption: data.caption,
                            title: data.title,
                            success: function success(){
                                var theAsset = mxBuilder.assets.get(assetID);
                                theAsset.name = data.name;
                                theAsset.title = data.title;
                                theAsset.caption = data.caption;
                                mxBuilder.menuManager.showTab("photos");
                            }
                        });
                    }
                });
                mxBuilder.menuManager.addFooterCancelButton().on({
                    click: function click(){
                        mxBuilder.menuManager.showTab("photos");
                    }
                });
                
            }
        }
    });
}(jQuery))