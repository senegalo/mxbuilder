(function($) {
    mxBuilder.Component = function Component(obj) {
        if (obj) {
            var instance = this;
            this.element = obj.element;

            //storing the size and position
            this.size = {
                width: obj.element.width(),
                height: obj.element.height()
            };

            this.position = obj.element.position();


            //watching out for settings picker drop
            obj.element.droppable({
                accept: ".settings-picker",
                drop: function(event, ui) {
                    var panelObj = ui.helper.data("settings-picker");

                    //does this component support this panel !?
                    var panels = instance.getSettingsPanels();
                    var found = false;
                    for (var p in panels) {
                        if (!panels.hasOwnProperty(p)) {
                            continue;
                        }
                        if (panels[p].panel === panelObj) {
                            found = true;
                            break;
                        }
                    }

                    if (found) {
                        var settings = panelObj.getValues(true, true);
                        mxBuilder.historyManager.setRestorePoint([mxBuilder.components.getComponent(this)]);
                        instance.setSettings(settings);
                    }

                }
            });

            //applying the popped from the active stack behavior
            if (!obj.poppedFromActiveStack) {
                obj.poppedFromActiveStack = function() {
                    //mxBuilder.selection.removeFromSelection(obj.element);
                };
            }
            obj.element.on({
                poppedFromActiveStack: obj.poppedFromActiveStack
            });

            //Context Menus & hover effect
            obj.element.on({
                mousedown: function mousedown(event) {
                    var ctx = mxBuilder.contextmenu.getMainCtx();
                    if (event.which === 3) {

                        if (mxBuilder.selection.getSelectionCount() === 0) {
                            mxBuilder.selection.addToSelection(obj.element);
                        } else if (mxBuilder.selection.getSelectionCount() === 1 && !mxBuilder.selection.isSelected(obj.element)) {
                            mxBuilder.selection.clearSelection();
                            mxBuilder.selection.addToSelection(obj.element);
                        }

                        var sameType = mxBuilder.selection.isAllSelectedSameType();

                        var showSettings = true;
                        var imgComponents = [];
                        var galleryComponents = [];
                        var otherComponents = [];
                        mxBuilder.selection.each(function() {
                            if (!this.hasSettings) {
                                showSettings = false;
                            }
                            switch (this.type) {
                                case "ImageComponent":
                                    imgComponents.push(this);
                                    break;
                                case "ImageGridComponent":
                                case "ImageSliderComponent":
                                    galleryComponents.push(this);
                                    break;
                                default:
                                    otherComponents.push(this);
                                    break;
                            }
                        });

                        if (otherComponents.length === 0) {
                            if (galleryComponents.length === 1 && imgComponents.length >= 1) {
                                ctx.addItem({
                                    label: "Merge images into the gallery",
                                    callback: function() {
                                        var i, cnt;
                                        for (i = 0, cnt = imgComponents.length; i < cnt; i++) {
                                            galleryComponents[0].addToList({
                                                id: imgComponents[i].extra.originalAssetID
                                            });
                                            imgComponents[i].destroy();
                                        }
                                        galleryComponents[0].rebuild();
                                        galleryComponents[0].revalidate();
                                    }
                                });
                            } else if (galleryComponents.length > 1 && imgComponents.length >= 0) {
                                ctx.addSubgroup({
                                    label: "Merge all to"
                                }).addItem({
                                    label: "Grid Gallery",
                                    callback: function() {
                                        var theList = {};
                                        var properties = {
                                            css: {
                                                left: 10000000,
                                                top: 10000000,
                                                width: 600,
                                                height: 350
                                            },
                                            data: {}
                                        };
                                        var elementPosition;
                                        var i, cnt;
                                        for (i = 0, cnt = imgComponents.length; i < cnt; i++) {
                                            theList[imgComponents[i].extra.originalAssetID] = {
                                                id: imgComponents[i].extra.originalAssetID,
                                                caption: true,
                                                title: true,
                                                link: {}
                                            };
                                            elementPosition = imgComponents[i].element.position();
                                            if (elementPosition.left < properties.css.left && elementPosition.top < properties.css.left) {
                                                properties.css.left = elementPosition.left;
                                                properties.css.top = elementPosition.top;
                                                properties.data.container = imgComponents[i].container;
                                                properties.data.page = imgComponents[i].page;
                                            }
                                            imgComponents[i].destroy();
                                        }
                                        for (i in galleryComponents) {
                                            var e;
                                            for (e in galleryComponents[i].list) {
                                                var listItem = galleryComponents[i].list[e];
                                                theList[listItem.id] = listItem;
                                            }
                                            elementPosition = galleryComponents[i].element.position();
                                            if (elementPosition.left < properties.css.left && elementPosition.top < properties.css.left) {
                                                properties.css.left = elementPosition.left;
                                                properties.css.top = elementPosition.top;
                                                properties.data.container = galleryComponents[i].container;
                                                properties.data.page = galleryComponents[i].page;
                                            }
                                            galleryComponents[i].destroy();
                                        }
                                        var finalList = [];
                                        for (i in theList) {
                                            finalList.push(theList[i]);
                                        }
                                        properties.data.type = "ImageGridComponent";
                                        properties.data.list = finalList;
                                        properties.fixFooter = true;
                                        mxBuilder.components.addComponent(properties);
                                    }
                                }).addItem({
                                    label: "Slider Gallery",
                                    callback: function() {
                                        var theList = {};
                                        var properties = {
                                            css: {
                                                left: 10000000,
                                                top: 10000000,
                                                width: 600,
                                                height: 350
                                            },
                                            data: {}
                                        };
                                        var elementPosition;
                                        for (var i in imgComponents) {
                                            theList[imgComponents[i].extra.originalAssetID] = {
                                                id: imgComponents[i].extra.originalAssetID,
                                                caption: true,
                                                title: true,
                                                link: {}
                                            };
                                            elementPosition = imgComponents[i].element.position();
                                            if (elementPosition.left < properties.css.left && elementPosition.top < properties.css.left) {
                                                properties.css.left = elementPosition.left;
                                                properties.css.top = elementPosition.top;
                                                properties.data.container = imgComponents[i].container;
                                                properties.data.page = imgComponents[i].page;
                                            }
                                            imgComponents[i].destroy();
                                        }
                                        for (i in galleryComponents) {
                                            for (var e in galleryComponents[i].list) {
                                                var listItem = galleryComponents[i].list[e];
                                                theList[listItem.id] = listItem;
                                            }
                                            elementPosition = galleryComponents[i].element.position();
                                            if (elementPosition.left < properties.css.left && elementPosition.top < properties.css.left) {
                                                properties.css.left = elementPosition.left;
                                                properties.css.top = elementPosition.top;
                                                properties.data.container = galleryComponents[i].container;
                                                properties.data.page = galleryComponents[i].page;
                                            }
                                            galleryComponents[i].destroy();
                                        }
                                        var finalList = [];
                                        for (i in theList) {
                                            finalList.push(theList[i]);
                                        }
                                        properties.data.type = "ImageSliderComponent";
                                        properties.data.list = finalList;
                                        properties.fixFooter = true;
                                        mxBuilder.components.addComponent(properties);
                                    }
                                }).end();
                            }
                        }

                        if (showSettings && mxBuilder.menuManager.menus.componentSettings.getCommonSettingsPanels().length > 0) {
                            ctx.addItem({
                                label: "Settings...",
                                callback: function() {
                                    mxBuilder.menuManager.showTab("componentSettings");
                                }
                            });
                            ctx.addItem({
                                type: "separator"
                            });
                        }

                        if (mxBuilder.selection.getSelectionCount() < 2 || sameType) {

                            var theComponent = mxBuilder.components.getComponent(obj.element);

                            //Activating Z-Index Manipulation context
                            if (obj.editableZIndex && mxBuilder.selection.getSelectionCount() < 2) {
                                ctx.addSubgroup({
                                    label: "Z Position"
                                }).addItem({
                                    label: "Bring to front",
                                    callback: function() {
                                        mxBuilder.historyManager.setRestorePoint([theComponent]);
                                        theComponent.bringToFront();
                                    }
                                }).addItem({
                                    label: "Bring to back",
                                    callback: function() {
                                        mxBuilder.historyManager.setRestorePoint([theComponent]);
                                        theComponent.bringToBack();
                                    }
                                }).addItem({
                                    label: "Bring to top",
                                    callback: function() {
                                        mxBuilder.historyManager.setRestorePoint([theComponent]);
                                        theComponent.bringToTop();
                                    }
                                }).addItem({
                                    label: "Bring to bottom",
                                    callback: function() {
                                        mxBuilder.historyManager.setRestorePoint([theComponent]);
                                        theComponent.bringToBottom();
                                    }
                                }).end().addItem({
                                    type: "sep"
                                });
                            }
                        }
                        if (mxBuilder.selection.getSelectionCount() > 1) {

                            //Alignment Menu
                            ctx.addSubgroup({
                                label: "Alignment"
                            }).addItem({
                                label: "Align Left",
                                callback: function() {
                                    mxBuilder.historyManager.setRestorePointFromSelection();
                                    mxBuilder.components.alignment.alignLeft();
                                }
                            }).addItem({
                                label: "Align Right",
                                callback: function() {
                                    mxBuilder.historyManager.setRestorePointFromSelection();
                                    mxBuilder.components.alignment.alignRight();
                                }
                            }).addItem({
                                label: "Align Top",
                                callback: function() {
                                    mxBuilder.historyManager.setRestorePointFromSelection();
                                    mxBuilder.components.alignment.alignTop();
                                }
                            }).addItem({
                                label: "Align Bottom",
                                callback: function() {
                                    mxBuilder.historyManager.setRestorePointFromSelection();
                                    mxBuilder.components.alignment.alignBottom();
                                }
                            }).addItem({
                                label: "Center Vertically",
                                callback: function() {
                                    mxBuilder.historyManager.setRestorePointFromSelection();
                                    mxBuilder.components.alignment.centerVertically();
                                }
                            }).addItem({
                                label: "Center Horizontally",
                                callback: function() {
                                    mxBuilder.historyManager.setRestorePointFromSelection();
                                    mxBuilder.components.alignment.centerHorizontally();
                                }
                            }).end();
                        }

                        ctx.addItem({
                            label: "Copy",
                            callback: function() {
                                mxBuilder.clipboard.copySelected();
                            }
                        });

                        if (obj.pinnable !== false) {
                            var pinned = true;
                            mxBuilder.selection.getSelection().each(function() {
                                if (!mxBuilder.components.getComponent($(this)).isPinned()) {
                                    pinned = false;
                                }
                            });
                            ctx.addItem({
                                label: "Pin",
                                checked: pinned,
                                callback: function() {
                                    mxBuilder.selection.getSelection().each(function() {
                                        var theComponent = mxBuilder.components.getComponent($(this));
                                        if (pinned) {
                                            theComponent.unpin();
                                        } else {
                                            theComponent.pin();
                                        }
                                    });
                                }
                            });
                        }

                        //Adding Delete ctx menu
                        if (obj.deletable !== false) {
                            ctx.addItem({
                                type: "separator"
                            });
                            ctx.addItem({
                                label: "Delete",
                                callback: function() {
                                    mxBuilder.dialogs.deleteDialog({
                                        msg: "Are you sure you want to delete the selected component(s) ?",
                                        callback: function() {
                                            mxBuilder.selection.getSelection().trigger("destroy");
                                        }
                                    });
                                }
                            });
                        }
                        ctx.stopPropagation();
                    }
                },
                mouseenter: function mouseenter() {
                    obj.element.addClass("mx-component-over");
                },
                mouseleave: function mouseleave() {
                    obj.element.removeClass("mx-component-over");
                }
            });

            //Making it draggable
            if (typeof obj.draggable !== "undefined") {
                $.extend(obj.draggable, mxBuilder.Component.prototype.defaultDraggableSettings);
                if (mxBuilder.settingsManager.getSetting("snap", "objects")) {
                    obj.draggable.snap = mxBuilder.settingsManager.getSnapSelector();
                }
                obj.element.draggable(obj.draggable);
            }

            //Making it resizable
            if (typeof obj.resizable !== "undefined" && obj.resizable !== false) {
                var handle = $('<div class="component-resizable-handle"/>');
                var orientation = obj.resizable.orientation = obj.resizable.orientation ? obj.resizable.orientation : "hv";
                var handles = {};

                if (orientation.match(/h/i)) {
                    $.extend(handles, {
                        e: handle.clone().appendTo(obj.element).addClass("ui-resizable-handle ui-resizable-e"),
                        w: handle.clone().appendTo(obj.element).addClass("ui-resizable-handle ui-resizable-w")
                    });
                }
                if (orientation.match(/v/i)) {
                    $.extend(handles, {
                        s: handle.clone().appendTo(obj.element).addClass("ui-resizable-handle ui-resizable-s"),
                        n: handle.clone().appendTo(obj.element).addClass("ui-resizable-handle ui-resizable-n")
                    });
                }
                if (orientation.match(/(hv|vh)/i)) {
                    $.extend(handles, {
                        ne: handle.clone().appendTo(obj.element).addClass("ui-resizable-handle ui-resizable-ne"),
                        se: handle.clone().appendTo(obj.element).addClass("ui-resizable-handle ui-resizable-se"),
                        sw: handle.clone().appendTo(obj.element).addClass("ui-resizable-handle ui-resizable-sw"),
                        nw: handle.clone().appendTo(obj.element).addClass("ui-resizable-handle ui-resizable-nw")
                    });
                }

                $.extend(obj.resizable, {
                    handles: handles,
                    start: function start(event, ui) {
                        var theComponent = mxBuilder.components.getComponent($(this));
                        mxBuilder.layout.outline(theComponent.container);
                        mxBuilder.historyManager.setRestorePoint([theComponent]);
                    },
                    resize: function resize(event, ui) {
                        mxBuilder.components.getComponent($(this)).revalidateShadow();
                        mxBuilder.selection.revalidateSelectionContainer();
                    },
                    stop: function() {
                        var that = $(this);
                        var theComponent = mxBuilder.components.getComponent(that);
                        mxBuilder.layout.clearOutline(theComponent.container);
                        mxBuilder.layout.revalidateLayout();
                    }
                });
                if (mxBuilder.settingsManager.getSetting("snap", "objects")) {
                    obj.resizable.snap = mxBuilder.settingsManager.getSnapSelector();
                }
                obj.element.resizable(obj.resizable);
            }

            //Making is selectable
            if (obj.selectable) {
                obj.element.addClass("mx-selectable-component").on({
                    click: function click(event) {
                        if (event.which === 1) {
                            if (event.ctrlKey || event.shiftKey) {
                                mxBuilder.selection.toggle(obj.element);
                            } else {
                                if (!mxBuilder.selection.isSelected(obj.element)) {
                                    mxBuilder.selection.switchSelection(obj.element);
                                } else if (mxBuilder.selection.getSelectionCount() > 1) {
                                    mxBuilder.selection.clearSelection({
                                        exclude: obj.element
                                    });
                                }

                            }
                        }
                    },
                    selected: function selected() {
                        $(this).css("cursor", "move");
                    },
                    deselected: function deselected() {
                        $(this).css("cursor", "auto");
                    }
                });
            }

            //Making it deletable
            obj.element.on({
                destroy: function destroy() {
                    mxBuilder.components.getComponent(obj.element).destroy();
                }
            });

            //enforce styles
            obj.element.addClass("mx-component").css({
                position: "absolute"
            });

            //Storring the settings internally
            $.extend(this, obj);

            //mxBuilder.layout.revalidateLayout();
        }
    };
    mxBuilder.Component.prototype = {
        trashed: false,
        hasSettings: true,
        _cachedStates: [],
        _currentState: 0,
        _id: null,
        setContainer: function setContainer(container) {
            this.container = container;
            this.element.appendTo(mxBuilder.layout[container]);
        },
        getID: function getID() {
            return this._id ? this._id : mxBuilder.utils.getElementGUID(this.element);
        },
        bringToFront: function bringToFront() {
            mxBuilder.zIndexManager.moveUp(this);
            mxBuilder.selection.revalidateSelectionContainer();
        },
        bringToBack: function bringToBack() {
            mxBuilder.zIndexManager.moveDown(this);
            mxBuilder.selection.revalidateSelectionContainer();
        },
        bringToTop: function bringToTop() {
            mxBuilder.zIndexManager.moveToTop(this);
            mxBuilder.selection.revalidateSelectionContainer();
        },
        bringToBottom: function bringToBottom() {
            mxBuilder.zIndexManager.moveToBottom(this);
            mxBuilder.selection.revalidateSelectionContainer(this.element);
        },
        getMetrics: function getMetrics() {
            var size = {
                width: this.element.width(),
                height: this.element.height(),
                container: this.container
            };
            $.extend(size, this.element.position());
            size.bottom = size.height + size.top;
            size.right = size.width + size.left;
            return size;
        },
        openDeleteComponentDialog: function openDeleteComponentDialog() {
            var that = this.element;
            mxBuilder.dialogs.deleteComponents(function() {
                that.trigger("destroy");
            });
        },
        pin: function pin() {
            mxBuilder.pages.pinComponent(this);
            this.pinned = true;
        },
        unpin: function unpin() {
            if (this.isPinned()) {
                mxBuilder.pages.unpinComponent(this);
                this.pinned = false;
            }
        },
        isPinned: function isPinned() {
            return this.pinned ? true : false;
        },
        save: function save() {
            var out = {
                css: {},
                data: {}
            };
            var position = this.element.position();

            out.css.top = this.container === "footer" ? position.top - mxBuilder.layout.footer.position().top : position.top;
            out.css.left = position.left;
            out.css.height = this.element.height();
            out.css.width = this.element.width();
            out.css.zIndex = this.element.css("zIndex");
            out.css.border = this.element.css("border");
            var corners = ["TopLeft", "BottomLeft", "BottomRight", "TopRight"];
            for (var c in corners) {
                out.css['border' + corners[c] + 'Radius'] = this.element.css("border" + corners[c] + "Radius");
            }
            var background = ["image", "size", "color"];
            for (c in background) {
                out.css["background-" + background[c]] = this.element.css("background-" + background[c]);
            }
            out.data.container = this.container;
            out.data.type = this.type;
            out.data.page = this.page;
            out.data.trashed = this.trashed;
            out.data.shadow = this.shadow;
            return out;
        },
        publish: function publish() {
            return this.element.clone().find(".component-resizable-handle")
                    .remove()
                    .end()
                    .removeClass("ui-draggable ui-resizable ui-selected mx-selectable-component");
        },
        getHeadIncludes: function getHeadIncludes() {
            return {
                scripts: {},
                css: {}
            };
        },
        init: function init(properties) {
            if (typeof properties.element === "undefined") {
                if (properties.data.container === "footer") {
                    properties.css.top = mxBuilder.layout.footer.position().top + properties.css.top;
                    delete properties.css.relativeTop;
                }
                properties.element = this.template.clone().css(properties.css).appendTo(mxBuilder.layout[properties.data.container]);
            }
            if (typeof properties.data._id === "undefined") {
                mxBuilder.utils.assignGUID(properties.element);
            } else {
                mxBuilder.utils.assignGUID(properties.element, properties.data._id);
            }
            $.extend(this, properties.data);
            this.element = properties.element;
            var instance = this;
            this.element.one({
                componentInit: function() {
                    instance._id = instance.getID();
                }
            });
            var initialState = {};
            $.extend(true, initialState, properties);
            initialState.data._id = this.getID();
            delete initialState.element;
            this._cachedStates = [initialState];
            this.revalidateShadow();
        },
        trashComponent: function trashComponent() {
            this.trashed = true;
            mxBuilder.selection.removeFromSelection(this.element);
            this.element.removeClass("mx-selectable-component").hide();
        },
        archive: function archive() {
            mxBuilder.selection.removeFromSelection(this.element);
            mxBuilder.components.removeComponent(this.element);
            this.element.remove();
        },
        destroy: function destroy() {
            this.unpin();
            mxBuilder.pages.detachComponentFromPage(this);
            if (mxBuilder.pages.isCurrentPage(this.page)) {
                mxBuilder.selection.removeFromSelection(this.element);
                mxBuilder.components.removeComponent(this.element);
                this.element.remove();
            }
        },
        getBorder: function getBorder(element) {
            element = element ? element : this.element;
            var styles = ["borderWidth",
                "borderStyle",
                "borderColor",
                "borderTopLeftRadius",
                "borderTopRightRadius",
                "borderBottomLeftRadius",
                "borderBottomRightRadius"];
            var out = {};
            for (var s in styles) {
                out[styles[s]] = element.css(styles[s]);
            }
            return out;
        },
        setBorder: function setBorder(obj) {
            this.element.css(obj);
            this.revalidateShadow();
        },
        getBackground: function getBackground(element) {
            element = element ? element : this.element;
            var styles = ["backgroundColor",
                "backgroundImage",
                "backgroundSize"];
            var out = {};
            for (var s in styles) {
                out[styles[s]] = element.css(styles[s]);
            }
            return out;
        },
        setBackground: function setBackground(obj) {
            this.element.css(obj);
        },
        getSettings: function getSettings() {
            var position = this.element.position();
            return {
                x: position.left,
                y: position.top,
                z: this.element.css("z-index") - 1000,
                width: this.element.outerWidth(),
                height: this.element.outerHeight()
            };
        },
        setSettings: function(obj) {
            if (typeof obj.position !== "undefined") {
                this.setPosition(obj.position);
            }
            if (typeof obj.border !== "undefined") {
                this.setBorder(obj.border);
            }
            if (typeof obj.background !== "undefined") {
                this.setBackground(obj.background);
            }
            if (typeof obj.shadow !== "undefined") {
                if (obj.shadow.shadowIndex !== "none") {
                    this.setShadow(obj.shadow.shadowIndex);
                } else {
                    this.removeShadow();
                }
            }
            if (typeof obj.links !== "undefined") {
                this.setLinkObj(obj.links);
            }
        },
        setLinkObj: function(obj) {
            if(typeof this.linkObj === "object"){
                $.extend(this.linkObj, obj);
            } else {
                this.linkObj = obj;
            }
        },
        setPosition: function(obj) {
            for (var v in obj) {
                var val = obj[v];
                switch (v) {
                    case "x":
                        this.setLeftPosition(val);
                        break;
                    case "y":
                        this.setTopPosition(val);
                        break;
                    case "z":
                        this.setZIndexTo(val);
                        break;
                    case "width":
                        this.setWidth(val);
                        break;
                    case "height":
                        this.setHeight(val);
                        break;
                }
            }
        },
        getSettingsPanels: function getSettingsPanels() {
            var out = {};
            out.position = {
                panel: mxBuilder.layout.settingsPanels.position
            };
            out.border = {
                panel: mxBuilder.layout.settingsPanels.border
            };
            out.background = {
                panel: mxBuilder.layout.settingsPanels.background,
                params: {}
            };
            out.shadow = {
                panel: mxBuilder.layout.settingsPanels.shadow
            };

            return out;
        },
        updateResizeHandles: function updateResizeHandles(orientation) {

            this.element.resizable("destroy").find(".component-resizable-handle").remove();

            var handle = $('<div class="component-resizable-handle"/>');

            if (mxBuilder.selection.isSelected(this.element)) {
                handle.show();
            }

            this.resizable.orientation = orientation;
            var handles = {};

            if (orientation.match(/h/i)) {
                $.extend(handles, {
                    e: handle.clone().appendTo(this.element).addClass("ui-resizable-handle ui-resizable-e"),
                    w: handle.clone().appendTo(this.element).addClass("ui-resizable-handle ui-resizable-w")
                });
            }
            if (orientation.match(/v/i)) {
                $.extend(handles, {
                    s: handle.clone().appendTo(this.element).addClass("ui-resizable-handle ui-resizable-s"),
                    n: handle.clone().appendTo(this.element).addClass("ui-resizable-handle ui-resizable-n")
                });
            }
            if (orientation.match(/(hv|vh)/i)) {
                $.extend(handles, {
                    ne: handle.clone().appendTo(this.element).addClass("ui-resizable-handle ui-resizable-ne"),
                    se: handle.clone().appendTo(this.element).addClass("ui-resizable-handle ui-resizable-se"),
                    sw: handle.clone().appendTo(this.element).addClass("ui-resizable-handle ui-resizable-sw"),
                    nw: handle.clone().appendTo(this.element).addClass("ui-resizable-handle ui-resizable-nw")
                });
            }
            this.resizable.handles = handles;
            this.element.resizable(this.resizable);
        },
        nudgeComponent: function nudgeComponent(directionKey, shiftKey) {
            var step = shiftKey ? 10 : 1;
            var position = this.element.position();
            var headerThreshold = mxBuilder.layout.header.height();
            var bodyThreshold = headerThreshold + mxBuilder.layout.body.height();
            var direction;

            if (directionKey % 2 !== 0) {
                direction = "left";
                delete position.top;
            } else {
                direction = "top";
                delete position.left;
            }

            position[direction] = position[direction] + (directionKey - 38 > 0 ? 1 : -1) * step;

            var threshold = this.element.height() / 2 + position.top;

            this.element.css(position);

            if (this.container === "header" && headerThreshold < threshold) {
                this.setContainer("body");
            } else if (this.container === "body") {
                if (bodyThreshold < threshold) {
                    this.setContainer("footer");
                } else if (headerThreshold > threshold) {
                    this.setContainer("header");
                }
            }

        },
        setShadow: function setShadow(id) {
            var shadow = this.element.find(".shadow");
            if (shadow.length === 0) {
                shadow = $('<div class="shadow"/>').appendTo(this.element);
            }
            this.applyShadow(id, shadow);
            this.shadow = id;
            mxBuilder.selection.revalidateSelectionContainer();
        },
        applyShadow: function applyShadow(id, element) {
            mxBuilder.shadowManager.applyShadow({
                id: id,
                element: element
            });
        },
        revalidateShadow: function revalidateShadow() {
            if (this.shadow) {
                this.setShadow(this.shadow);
            }
        },
        removeShadow: function removeShadow() {
            delete this.shadow;
            this.element.find(".shadow").remove();
        },
        cacheState: function cacheState() {
            var cachedStatesLength = this._cachedStates.length;
            if (this._currentState !== cachedStatesLength - 1) {
                this._cachedStates.splice(this._currentState + 1, cachedStatesLength);
            }
            var state = this.save();
            state.data._id = this.getID();
            var length = this._cachedStates.push(state);
            if (length > 10) {
                this._cachedStates.splice(0, 1);
            }
            this._currentState = length - 1;
            return this._currentState;
        },
        revertTo: function(id) {
            if (this._cachedStates[id]) {
                var wasSelected = mxBuilder.selection.isSelected(this.element);
                if (wasSelected) {
                    mxBuilder.selection.removeFromSelection(this.element, true, true);
                }

                this.destroy();
                this._cachedStates[id].fixFooter = true;
                var newInstance = mxBuilder.components.addComponent(this._cachedStates[id]);

                newInstance._cachedStates = this._cachedStates;
                newInstance._currentState = id;

                if (wasSelected) {
                    mxBuilder.selection.addToSelection(newInstance.element, true);
                }
            }
        },
        getUsedAssets: function getUsedAssets() {
            return {};
        },
        setHeight: function setHeight(value) {
            var bounds = this.getHeightBounds();
            if (value > bounds.min && value < bounds.max) {
                this.element.outerHeight(value);
            }
        },
        setWidth: function setWidth(value) {
            var bounds = this.getWidthBounds();
            if (value > bounds.min && value < bounds.max) {
                this.element.outerWidth(value);
            }
        },
        setLeftPosition: function setLeftPosition(val) {
            this.element.css("left", val + "px");
        },
        setTopPosition: function setTopPosition(val) {
            this.element.css("top", val + "px");
        },
        setZIndexTo: function setZIndexTo(val) {
            var currentZIndex = parseInt(this.element.css("z-index"), 10);
            var i;
            if (currentZIndex > val) {
                for (i = currentZIndex; i >= val; i--) {
                    this.bringToBack();
                }
            } else if (currentZIndex < val) {
                for (i = currentZIndex; i <= val; i++) {
                    this.bringToFront();
                }
            }
        },
        getWidthBounds: function() {
            return {
                max: 1000000000000,
                min: 0
            };
        },
        getHeightBounds: function() {
            return {
                max: 100000000000,
                min: 0
            };
        },
        defaultDraggableSettings: {
            cursor: "move",
            start: function start() {
                var element = $(this);

                //if this is the selection container skip this part
                if (mxBuilder.selection.getSelectionContainer().get(0) !== this) {
                    if (mxBuilder.selection.getSelectionCount() === 0) {
                        mxBuilder.selection.addToSelection(element);
                    } else {
                        if (!mxBuilder.selection.isSelected(element)) {
                            mxBuilder.selection.switchSelection(element);
                        }
                    }
                }

                var restrictMovment = {
                    x: false,
                    y: false
                };

                mxBuilder.selection.each(function(that) {
                    if (this.draggable && this.draggable.axis === "x") {
                        restrictMovment.y = true;
                    }
                    if (this.draggable && this.draggable.axis === "y") {
                        restrictMovment.x = true;
                    }
                    that.data("initial-position", that.position());
                }, true);

                mxBuilder.selection.each(function(element) {
                    if (restrictMovment.x === false && restrictMovment.y === false) {
                        var restore;
                        if (!this.draggable) {
                            restore = false;
                        } else {
                            restore = this.draggable.axis ? this.draggable.axis : false;
                        }
                        element.draggable("option", "axis", restore);
                    } else if (restrictMovment.y) {
                        element.draggable("option", "axis", "x");
                    } else if (restrictMovment.x) {
                        element.draggable("option", "axis", "y");
                    }
                }, true);

                mxBuilder.selection.getSelectionContainer().data("restrict-movment", restrictMovment);
                mxBuilder.historyManager.setRestorePointFromSelection();
            },
            drag: function drag(event, ui) {
                var element = $(this);
                var currentPosition = ui.position;

                var initialPosition = element.data("initial-position");

                var theOffset = {
                    left: initialPosition.left - currentPosition.left,
                    top: initialPosition.top - currentPosition.top
                };

                var restrict = mxBuilder.selection.getSelectionContainer().data("restrict-movment");

                mxBuilder.selection.each(function(currentSelectionComponent) {
                    if (element.get(0) === currentSelectionComponent.get(0)) {
                        return;
                    }
                    var initialPosition = currentSelectionComponent.data("initial-position");
                    var newPosition = {};
                    if (!restrict.x) {
                        newPosition.left = initialPosition.left - theOffset.left;
                    }
                    if (!restrict.y) {
                        newPosition.top = initialPosition.top - theOffset.top;
                    }
                    currentSelectionComponent.css(newPosition);
                }, true);
            },
            stop: function stop() {
                mxBuilder.layout.revalidateLayoutWidth();
            },
            scroll: false
        }
    };

    $(function() {
        var dropOnContainer = function dropOnContainer(container) {
            return function(event, ui) {
                //if we are dropping while on top of the menu cancel
                if (ui.helper.data("deny-drop") === true || ui.helper.data("over-main-menu") === true) {
                    mxBuilder.layout.clearOutline(container);
                    return;
                }

                var componentType = ui.helper.data("component");
                if (componentType) {
                    var theComponent = mxBuilder.components.addComponent({
                        fixFooter: true,
                        css: {
                            left: ui.position.left,
                            top: ui.position.top
                        },
                        data: {
                            container: container,
                            type: componentType,
                            extra: ui.helper.data("extra")
                        }
                    });
                    if (container === "header" || container === "footer") {
                        theComponent.pin();
                    }

                    theComponent.setContainer(container);
                    theComponent.element.trigger('componentDropped');
                    mxBuilder.historyManager.setRestorePoint([theComponent], "delete");
                } else {
                    mxBuilder.selection.getSelection().each(function() {
                        mxBuilder.components.getComponent($(this)).setContainer(container);
                    });
                }
                mxBuilder.layout.revalidateLayout();
                mxBuilder.layout.clearOutline(container);
            };
        };

        /**
         * @todo guess all 3 layouts are similar could be a lot more shorter... double check
         */
        var layoutSections = ["header", "body", "footer"];

        for (var i in layoutSections) {
            (function(section) {
                mxBuilder.layout["layout" + section.uppercaseFirst()].droppable({
                    accept: ".mx-helper, .mx-component, .component-widget, #selection-container",
                    drop: dropOnContainer(section),
                    over: function over() {
                        mxBuilder.layout.outline(section);
                    },
                    out: function out() {
                        mxBuilder.layout.clearOutline(section);
                    }
                });
            }(layoutSections[i]));
        }

        mxBuilder.selection.enableMultiComponentSelect(true);

        $(document).on({
            keyup: function keyup(event) {
                if (mxBuilder.menuManager.isOpened() && $(event.srcElement).parents(".flexly-main-bar").length !== 0) {
                    return;
                }
                if (event.keyCode === 46) {
                    var selectionCount = mxBuilder.selection.getSelectionCount();
                    if (selectionCount === 1) {
                        var theSelectedComponent = mxBuilder.components.getComponent(mxBuilder.selection.getSelection());
                        if (theSelectedComponent.type === "TextComponent" && theSelectedComponent.isEditMode()) {
                            return;
                        }
                        if (theSelectedComponent.type === "TitleComponent" && theSelectedComponent.isEditMode()) {
                            return;
                        }
                    }
                    if (selectionCount > 0) {
                        mxBuilder.dialogs.deleteDialog({
                            msg: "Are you sure you want to delete the selected component(s) ?",
                            callback: function callback() {
                                mxBuilder.historyManager.setRestorePointFromSelection("delete");
                                mxBuilder.selection.each(function() {
                                    mxBuilder.pages.detachComponentFromPage(this);
                                    this.element.trigger("destroy");
                                });
                            }
                        });
                    }
                }
            },
            keydown: function keydown(event) {
                if (mxBuilder.menuManager.isOpened() && $(event.srcElement).parents(".flexly-main-bar").length !== 0) {
                    return;
                }
                if (event.keyCode >= 37 && event.keyCode <= 40) {
                    var firstComponent = mxBuilder.components.getComponent(mxBuilder.selection.getSelection());
                    var isTextComponent = firstComponent.type === "TextComponent" || firstComponent.type === "TitleComponent";
                    if (mxBuilder.selection.getSelectionCount() === 1 && isTextComponent && firstComponent.isEditMode()) {
                        return;
                    } else {
                        mxBuilder.selection.each(function() {
                            this.nudgeComponent(event.keyCode, event.shiftKey);
                        });
                        mxBuilder.layout.revalidateLayout();
                        mxBuilder.selection.revalidateSelectionContainer();
                        event.preventDefault();
                        return;
                    }
                }
                else if (event.ctrlKey && event.keyCode === 90) {
                    if (mxBuilder.historyManager.hasUndo()) {
                        mxBuilder.historyManager.undo();
                    }
                }
                else if (event.ctrlKey && event.keyCode === 67) {
                    mxBuilder.clipboard.copySelected();
                } else if (event.ctrlKey && event.keyCode === 86) {
                    mxBuilder.clipboard.paste();
                }
            }
        });

    });

}(jQuery));
