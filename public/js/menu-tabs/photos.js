(function($) {

    $(function() {

        var template = mxBuilder.layout.templates.find(".flexly-menu-photos").clone().remove();
        var templateImage = template.find(".flexly-menu-photos-list li").remove();
        var multipleImageSelect = template.find(".flexly-multiple-files").remove();

        mxBuilder.menuManager.menus.photos = {
            _theList: null,
            _template: template,
            _templateImage: templateImage,
            _selectedElements: {},
            _selectionCount: 0,
            init: function init() {
                mxBuilder.menuManager.hideFooter();
                mxBuilder.menuManager.tabTitle.text("Photos");

                //adding the buttons
                var uploadButton = mxBuilder.menuManager.addButtonTo("flexly-icon-upload-light", "main").attr("id","photos-select-files");;
                mxBuilder.menuManager.addButtonTo("flexly-icon-search-light", "main").on({
                    click: function click() {
                        mxBuilder.menuManager.showTab("photosSearch");
                    }
                });

                mxBuilder.menuManager.addButtonTo("flexly-icon-photos-light photos-tab-icon photos-current", "aux");
//                mxBuilder.menuManager.addButtonTo("flexly-icon-clipart-light photos-tab-icon", "aux").on({
//                    click: function click() {
//                        mxBuilder.menuManager.showTab("photosClipart");
//                    }
//                });
                mxBuilder.menuManager.addButtonTo("flexly-icon-flicker-light photos-tab-icon", "aux").on({
                    click: function click() {
                        mxBuilder.menuManager.showTab("photosFlicker");
                    }
                });

                this._theList = this._template.clone().appendTo(mxBuilder.menuManager.contentTab);

                this.revalidate();
                this.initUploader(uploadButton);
            },
            addItem: function addItem(obj, prependFlag, list) {
                var photos = this;
                list = list ? list : this._theList;
                var leftColumn = list.find(".left-column ul");
                var rightColumn = list.find(".right-column ul");
                var theItem = this._templateImage.clone()
                        .find(".asset-image").draggable({
                    helper: function helper(event) {
                        return theItem.find(".asset-image").clone()
                                .css("zIndex", mxBuilder.config.newComponentHelperZIndex)
                                .data("component", "ImageComponent")
                                .data("extra", {
                            originalAssetID: obj.id
                        })
                                .appendTo(mxBuilder.layout.container);
                    },
                    start: function start(event, ui) {
                        if (photos._selectionCount > 1) {
                            var selectedImages = [];
                            photos.each(function() {
                                selectedImages.push(this.data("assetid"));
                            });
                            ui.helper.find("img").replaceWith(multipleImageSelect.clone()).end()
                                    .data("component", "ImageSliderComponent")
                                    .data("extra", selectedImages)
                                    .appendTo(mxBuilder.layout.container);
                        }
                    },
                    stop: function stop() {
                        photos.clearSelection();
                    }
                })
                        .append('<img src="' + obj.location + "/" + obj.thumb + '" style="width:114px;height:' + (114 / obj.ratio) + 'px;" title="' + obj.name + '"/>')
                        .end()
                        .find(".asset-name")
                        .text(obj.name.reduceString(17))
                        .attr("title", obj.name)
                        .end()
                        .data("assetid", obj.id);
                theItem.on({
                    mousedown: function mousedown(event) {
                        if (event.which === 3) {
                            mxBuilder.contextmenu.getMainCtx().addSubgroup({
                                label: "Set as background"
                            }).addItem({
                                label: "Header",
                                callback: function callback() {
                                    mxBuilder.layout.setBackgroundImage("header", obj);
                                }
                            }).addItem({
                                label: "Body",
                                callback: function callback() {
                                    mxBuilder.layout.setBackgroundImage("body", obj);
                                }
                            }).addItem({
                                label: "Footer",
                                callback: function callback() {
                                    mxBuilder.layout.setBackgroundImage("footer", obj);
                                }
                            })
                                    .end()
                                    .addItem({
                                label: "Image Settings...",
                                callback: function callback() {
                                    mxBuilder.menuManager.showTab("photoSettings", theItem.data("assetid"));
                                }
                            }).addItem({
                                label: "Delete Image(s)...",
                                callback: function callback() {
                                    mxBuilder.dialogs.deleteDialog({
                                        msg: "Are you sure you want to delete the selected image(s) ? <br/>If any of the images are used anywhere it will be automatically removed",
                                        callback: function callback() {
                                            var del = [];
                                            photos.each(function() {
                                                del.push(this.data("assetid"));
                                            });
                                            mxBuilder.api.assets.remove({
                                                ids: del,
                                                success: function success() {
                                                    mxBuilder.assets.removeBatch(del);
                                                    photos.each(function() {
                                                        this.css({
                                                            height: theItem.outerHeight(),
                                                            width: theItem.outerWidth(),
                                                            padding: 0
                                                        });
                                                        this.contents().remove().end().animate({
                                                            height: 0
                                                        }, 300, "linear", function() {
                                                            mxBuilder.menuManager.menus.photos.revalidate();
                                                        });
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    },
                    click: function click(event) {
                        if (!event.ctrlKey) {
                            photos.clearSelection();
                        }
                        photos.addToSelection($(this));
                    },
                    dblclick: function dblclick() {
                        mxBuilder.menuManager.showTab("photoSettings", theItem.data("assetid"));
                    }
                });

                var theSelCol = leftColumn.height() > rightColumn.height() ? rightColumn : leftColumn;
                if (prependFlag) {
                    theSelCol.prepend(theItem);
                } else {
                    theSelCol.append(theItem);
                }
            },
            revalidate: function revalidate() {
                var photos = this;
                photos._theList.find(".left-column ul, .right-column ul").empty();
                mxBuilder.assets.each(function() {
                    photos.addItem(this);
                });
                mxBuilder.menuManager.revalidateScrollbar();
            },
            initUploader: function initUploader(uploadButton) {
                var instance = this;
                
                var uploader = new plupload.Uploader(mxBuilder.uploaderSettings);

                //activating the cancel button on the notification canvas
                $("#flexly-notification-container").on({
                    click: function() {
                        uploader.stop();
                        uploader.splice(0, uploader.files.length);
                        uploader.refresh();
                        queueSize = 0;
                        mxBuilder.notifications.setIdleState();
                    }
                });

                var queueSize = 0;

                uploader.init();

                uploader.bind('FilesAdded', function(up, files) {
                    queueSize += files.length;
                    mxBuilder.notifications.uploadProgress(0, 0, files.length);

                    uploader.start();
                    up.refresh(); // Reposition Flash/Silverlight
                });

                uploader.bind('UploadProgress', function(up, file) {
                    mxBuilder.notifications.uploadProgress(up.total.percent, queueSize - up.total.queued, queueSize);
                });

                uploader.bind('Error', function(up, err) {
                    mxBuilder.dialogs.alertDialog.show("Can't upload " + (err.file ? "the file '" + err.file.name + "' " : "") + "for the following reason: <br/>" + err.message);
                    up.refresh(); // Reposition Flash/Silverlight
                });

                uploader.bind('FileUploaded', function(up, file, response) {
                    response = JSON.parse(response.response);
                    if (response.success) {
                        mxBuilder.assets.add(response, true);
                        mxBuilder.menuManager.menus.photos.revalidate();
                        mxBuilder.menuManager.revalidateScrollbar();
                    } else {
                        mxBuilder.dialogs.alertDialog.show("Upload failed for the following reason: <br/>" + response.description);
                    }
                });

                uploader.bind('UploadComplete', function(uploader, files) {
                    queueSize = 0;
                    mxBuilder.notifications.setIdleState();
                });
            },
            addToSelection: function addToSelection(element) {
                element.addClass("photo-selected");
                this._selectionCount++;
                this._selectedElements[element.data("assetid")] = element;
            },
            removeFromSelection: function removeFromSelection(element) {
                element.removeClass("photo-selected");
                this._selectionCount--;
                delete this._selectedElements[element.data("assetid")];
            },
            clearSelection: function clearSelection() {
                var photos = this;
                this.each(function() {
                    photos.removeFromSelection(this);
                });
            },
            each: function each(callback) {
                for (var e in this._selectedElements) {
                    callback.call(this._selectedElements[e]);
                }
            }
        };
    });

}(jQuery));