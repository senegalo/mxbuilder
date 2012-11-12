(function($){
    
    $(function(){
        var theDialog, imageAssetTemplate, documentAssetTemplate, uploader, imageComponentTemplate;
        
        (function init(){
            
            
            imageAssetTemplate = mxBuilder.layout.templates.find(".assets-image-template").removeClass("assets-image-stemplate").remove();
            documentAssetTemplate = mxBuilder.layout.templates.find(".assets-document-template").removeClass("assets-document-template").remove();
            imageComponentTemplate = mxBuilder.layout.templates.find(".image-component-instance").clone();
            
            theDialog = mxBuilder.layout.templates.find(".assets-upload-dialog").remove().dialog({
                autoOpen: false,
                zIndex: 1000008,
                title: "Assets Manager",
                resizable: false,
                width: 410
            }).find(".assets-tabs").tabs().end();
        
            $('<div class="assets-manager menu-item" style="font-weight:bold;cursor:pointer">Assets</div>').appendTo(mxBuilder.layout.menu).on({
                click: function(){
                    theDialog.dialog("open");
                }
            });
        
            uploader = new plupload.Uploader(mxBuilder.uploaderSettings);

            $('#assets-upload-files').click(function(event) {
                uploader.start();
                event.preventDefault();
            });

            uploader.init();

            uploader.bind('FilesAdded', function(up, files) {
                $.each(files, function(i, file) {
                    $('#assets-upload-files-info').append(
                        '<div id="' + file.id + '">' +
                        file.name + ' (' + plupload.formatSize(file.size) + ') <b></b>' +
                        '</div>');
                });

                up.refresh(); // Reposition Flash/Silverlight
            });

            uploader.bind('UploadProgress', function(up, file) {
                $('#' + file.id + " b").html(file.percent + "%");
            });

            uploader.bind('Error', function(up, err) {
                
                mxBuilder.dialogs.alertDialog.show("Can't upload "+(err.file ? "the file '" + err.file.name +"' " : "")+"for the following reason: <br/>"+err.message);
                
                up.refresh(); // Reposition Flash/Silverlight
            });

            uploader.bind('FileUploaded', function(up, file, response) {
                $('#' + file.id).remove();
                response = JSON.parse(response.response);
                if(response.success){
                    mxBuilder.assets.add(response);
                } else {
                    mxBuilder.dialogs.alertDialog.show("Upload failed for the following reason: <br/>"+response.description);
                }
            });
        }());
        
        mxBuilder.assets = {
            __assets: {},
            add: function(obj){                
                //preping the template
                var template;
                if(obj.id != 0){
                    if(obj.type == "image"){
                        template = imageAssetTemplate.clone().data("id",obj.id).addClass("asset-"+obj.id+" mx-helper")
                        .find("img")
                        .attr("src",obj.location+"/"+obj.thumb)
                        .end()
                        .find(".default-properties").on({
                            click: function click(){
                                mxBuilder.dialogs.imageDefaultPropertiesDialog.show({
                                    title: obj.title,
                                    caption: obj.caption,
                                    saveCallback: function(data){
                                        mxBuilder.dialogs.progressDialog.show("Saving image default settings...");
                                        mxBuilder.api.assets.changeImageDefaults({
                                            assetID: obj.id,
                                            caption: data.caption,
                                            title:  data.title,
                                            success: function(){
                                                obj.caption = data.caption;
                                                obj.title = data.title;
                                                mxBuilder.dialogs.progressDialog.msg("Saved successfully...");
                                            },
                                            complete: function(){
                                                setTimeout(function(){
                                                    mxBuilder.dialogs.progressDialog.hide();
                                                },1500);
                                            }
                                        })
                                    }
                                });
                            }
                        })
                        .end()
                        .insertBefore(theDialog.find("#assets-images-insertion-marker")).draggable({
                            helper: function helper(event){
                                return imageComponentTemplate.clone()
                                .css("zIndex",mxBuilder.config.newComponentHelperZIndex)
                                .find("img").attr({
                                    src: obj.location+"/"+obj.thumb
                                }).end()
                                .data("component","ImageComponent")
                                .data("extra",{
                                    originalAssetID: obj.id
                                })
                                .appendTo(mxBuilder.layout.container);
                            },
                            dragstop: function dragstop(event, ui){
                                ui.helper.remove();
                            }
                        });
                    } else {
                        template = documentAssetTemplate.clone().addClass("asset-"+obj.id).insertBefore(theDialog.find("#assets-document-insertion-marker"));
                    }
                
                    template.find(".delete-asset").on({
                        click: function(){
                            var msg;
                            if(obj.type == "image"){
                                msg = "Are you sure you want to delete the selected image ?<br/> doing so will remove every instance of them in all the pages."
                            } else {
                                msg = "Are you sure you want remove the selected document ?<br/> if it is linked anywhere the links will no longer work.";
                            }
                            mxBuilder.dialogs.deleteDialog({
                                msg: msg,
                                callback: function(){
                                    mxBuilder.dialogs.progressDialog.show("Deleting asset...");
                                    mxBuilder.api.assets.remove({
                                        assetID: obj.id,
                                        success: function(data){
                                            mxBuilder.dialogs.progressDialog.msg("Deleted Successfully...");
                                            mxBuilder.assets.remove(obj.id);
                                            mxBuilder.save.save(JSON.stringify(mxBuilder.pages.saveAll()));
                                        },
                                        error: function(data){
                                            mxBuilder.dialogs.progressDialog.msg("Delete Failed !")
                                        },
                                        complete: function(){
                                            setTimeout(function(){
                                                mxBuilder.dialogs.progressDialog.hide();
                                            },1500);
                                        }
                                    });
                                }
                            });
                        }
                    })
                    .end()
                    .find(".edit-name").on({
                        click: function click(){
                            mxBuilder.dialogs.assetPropertiesDialog.show({
                                name: obj.name,
                                saveCallback: function saveCallback(newName){
                                    mxBuilder.dialogs.progressDialog.show("Changing asset name...");
                                    mxBuilder.api.assets.changeAssetName({
                                        assetID: obj.id,
                                        newName: newName,
                                        success: function success(){
                                            mxBuilder.dialogs.progressDialog.msg("Asset name changed...");
                                            obj.name = newName;
                                            template.find(".name").text(obj.name.reduceString(18));
                                        },
                                        complete: function complete(){
                                            setTimeout(function(){
                                                mxBuilder.dialogs.progressDialog.hide();
                                            },1500);
                                        }
                                    });
                                }
                            });
                        }
                    })
                    .end()
                    .find(".name").text(obj.name.reduceString(18));
                }
                //Generating and assining the instance an id
                this.__assets[obj.id] = obj;
            },
            get: function(id){
                return this.__assets[id];
            },
            remove: function(id){
                if(this.__assets[id].type == "image"){
                    //remove the image from any active component
                    var components = mxBuilder.components.getComponentsByAssetID(id);
                    for(var c in components){
                        mxBuilder.pages.detachComponentFromPage(components[c]);
                        mxBuilder.selection.removeFromSelection(components[c].element);
                        components[c].destroy();
                    }
                
                    //remove from other pages
                    mxBuilder.pages.removeImgComponentFromPages(id);
                }
                //removing the asset from the assets manager
                theDialog.find(".asset-"+id).remove();
                delete this.__assets[id];
            }
        }
    });
    
}(jQuery))