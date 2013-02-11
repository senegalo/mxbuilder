(function($){
    $(function(){
        mxBuilder.layout.settingsPanels.image = {
            //update the template variable
            _template: mxBuilder.layout.templates.find(".photos-settings").remove(),
            getPanel: function(id){
                var settingsTab = mxBuilder.menuManager.menus.componentSettings;
                var image = this;
                var thePanel = mxBuilder.layout.utils.getCollapsablePanel(true);
                
                //change settings panel title
                thePanel.find(".flexly-collapsable-title").text("Image Settings");
                
                var theInstance = this._template.clone();
                
                //fill in all the controls 
                var controls = {
                    name: theInstance.find("#photo-name"),
                    title: theInstance.find("#photo-title"),
                    caption: theInstance.find("#photo-caption"),
                    imageID: id
                };
                
                
                //Configure the controls here
                var imgObj = mxBuilder.assets.get(id);
                
                var originalSettings = {
                    name: imgObj.name,
                    title: imgObj.title,
                    caption: imgObj.caption
                };
                
                this.setValues(controls,originalSettings);
                
                thePanel.on({
                    save: function(){
                        image.applyToSelection(controls);
                        mxBuilder.menuManager.showTab("photos");
                    },
                    cancel: function(){
                        mxBuilder.menuManager.showTab("photos");
                    }
                });                
                
                thePanel.find(".flexly-collapsable-content").append(theInstance);
                return thePanel;
            },
            setValues: function(controls, values){    
                //implement the setValue function
                controls.name.val(values.name);
                controls.title.val(values.title);
                controls.caption.val(values.caption);
            },
            applyToSelection: function applyToSelection(controls,values){
                var image = this;
                if(typeof values === "undefined"){
                    //if no values passed how to do we get the values ?
                    values = {
                        name: controls.name.val(),
                        title: controls.title.val(),
                        caption: controls.caption.val()
                    }
                }
                
                mxBuilder.dialogs.progressDialog.show("Updating image...")
                mxBuilder.api.assets.updatePhotoProperties({
                    assetID: controls.imageID,
                    name: values.name,
                    caption: values.caption,
                    title: values.title,
                    success: function success(){
                        var theAsset = mxBuilder.assets.get(controls.imageID);
                        theAsset.name = values.name;
                        theAsset.title = values.title;
                        theAsset.caption = values.caption;
                        
                        image.updateComponents(controls.imageID);
                        
                        mxBuilder.dialogs.progressDialog.hide();
                        mxBuilder.menuManager.showTab("photos");
                    }
                });
                
            },
            updateComponents: function updatecomponents(assetID){
                //updating image galleries
                var components = mxBuilder.components.getComponentsByType("ImageGalleryComponent")
                for(var c in components){
                    components[c].updateImagesInfo();
                }
                
                //update Photos
                components = mxBuilder.components.getComponentsByAssetID(assetID);
                for(c in components){
                    components[c].updateImageInfo();
                }
            }
        }
    });
}(jQuery))