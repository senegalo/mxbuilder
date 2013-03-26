(function($) {
    $(function() {
        mxBuilder.TitleComponent = function TitleComponent(properties) {
            var instance = this;
            this.init(properties);

            //Edit component behavious settings...
            mxBuilder.Component.apply(this, [{
                    type: "TitleComponent",
                    draggable: {},
                    resizable: {
                        orientation: "h"
                    },
                    editableZIndex: true,
                    pinnable: true,
                    deletable: true,
                    hasSettings: true,
                    selectable: true,
                    element: properties.element,
                    poppedFromActiveStack: function poppedFromActiveStack() {
                        var theComponent = mxBuilder.components.getComponent($(this));
                        if (!theComponent.editMode) {
                            mxBuilder.selection.removeFromSelection(theComponent.element);
                        } else {
                            mxBuilder.activeStack.push(theComponent.element);
                        }
                    }
                }]);

            //Add element events...
            properties.element.on({
                resize: function resize() {
                    instance.revalidate();
                    return true;
                },
                resizestop: function resizestop() {
                    properties.element.css("height", "auto");
                },
                dblclick: function dblclick() {
                    var theComponent = mxBuilder.components.getComponent(properties.element);
                    if (theComponent.editMode !== true) {
                        if (theComponent.editor === null || typeof theComponent.editor === "undefined") {
                            var theContent = properties.element.draggable("disable").on({
                                "click.editor-consume": function(event) {
                                    return false;
                                }
                            }).find(".content")
                                    .attr("contenteditable", "true")
                                    .css({
                                "-webkit-nbsp-mode": "normal"
                            })
                                    .focus()
                                    .get(0);

                            var originalHeight = properties.element.height();
                            var cachedHeight = originalHeight;
                            var refreshInterval = setInterval(function() {
                                var metrics = theComponent.getMetrics();
                                if (metrics.height !== cachedHeight) {
                                    if (theComponent.editor) {
                                        (new CKEDITOR.dom.window(window)).fire("resize");
                                    }
                                    if (metrics.height >= originalHeight) {
                                        var displacment = metrics.height - cachedHeight;
                                        var components = mxBuilder.components.detectCollision([theComponent], displacment < 0 ? -1 * displacment + 40 : 20);
                                        for (var c in components) {
                                            var element = components[c].element;
                                            var position = element.position();
                                            element.css({
                                                top: position.top + displacment + "px",
                                                left: position.left
                                            });
                                        }
                                    }
                                    mxBuilder.selection.revalidateSelectionContainer();
                                    mxBuilder.layout.revalidateLayout();
                                    cachedHeight = metrics.height;
                                }
                            }, 100);

                            mxBuilder.selection.enableMultiComponentSelect(false);
                            //mxBuilder.activeStack.push(properties.element);

                            properties.element.css({
                                //minHeight: height+"px",
                                height: "auto"
                            }).data("refreshinterval", refreshInterval).data("minheight", originalHeight);

                            theComponent.editor = CKEDITOR.inline(theContent, {
                                toolbar: "header",
                                on: {
                                    instanceReady: function(evt) {
                                        $(theContent).focus();
                                    }
                                }
                            });

                            theComponent.editor.on("afterCommandExec", function(evt) {
                                theComponent.revalidateWidth();
                            });

                            theComponent.editor.on("saveSnapshot", function(evt) {
                                theComponent.revalidateWidth();
                            });

                            theComponent.editor.on("contentDom", function() {
                                theComponent.editor.document.on("keydown", function() {
                                    setTimeout(function() {
                                        theComponent.revalidateWidth();
                                    }, 1);
                                });
                                theComponent.editor.document.on("keypress", function() {
                                        theComponent.revalidateWidth();
                                });
                            });
                        }

                        properties.element.on({
                            "click.focus-editor": function click() {
                                theComponent.editor.focus();
                            }
                        });

                        theComponent.editMode = true;
                    }
                },
                deselected: function deselected() {
                    mxBuilder.activeStack.popTo(properties.element);
                },
                poppedFromActiveStack: function poppedFromActiveStack() {
                    var theComponent = mxBuilder.components.getComponent(properties.element);
                    if (theComponent.editor !== null && typeof theComponent.editor !== "undefined") {
                        clearInterval(properties.element.data("refreshinterval"));

                        theComponent.editor.destroy();
                        theComponent.editor = null;
                        mxBuilder.selection.enableMultiComponentSelect(true);

                        var cachedMinHeight = properties.element.data("minheight");
                        var contentHeight = instance.contentContainer.height();

                        var height;
                        if (cachedMinHeight > contentHeight) {
                            instance.contentContainer.height(height);
                            height = cachedMinHeight;
                        } else {
                            height = contentHeight;
                        }

                        properties.element.draggable("enable").css({
                            minHeight: "",
                            height: theComponent.contentContainer.height()
                        }).off(".focus-editor").off(".editor-consume");
                        instance.contentContainer.removeAttr("contenteditable");

                        theComponent.editMode = false;

                        if (instance.contentContainer.text().replace(/(\s\n|\n\s|\s\n\r|\n\r\s)/, "") === "") {
                            theComponent.destroy();
                        }
                    }
                }
            });

            //Extra Initializtion actions...
        };
        $.extend(mxBuilder.TitleComponent.prototype, new mxBuilder.Component(), {
            template: mxBuilder.layout.templates.find(".header-component-instance").remove(),
            fontSize: 8,
            contentContainer: null,
            revalidate: function() {
                var applyTo = this.element.find(".cke-font-size");
                if (this.contentContainer.width() < this.element.width()) {
                    while (this.contentContainer.width() < this.element.width() && this.fontSize < 200) {
                        applyTo.css("fontSize", ++this.fontSize);
                    }
                    while (this.contentContainer.width() > this.element.width()) {
                        applyTo.css("fontSize", --this.fontSize);
                    }
                } else {
                    while (this.contentContainer.width() > this.element.width() && this.fontSize > 9) {
                        applyTo.css("fontSize", --this.fontSize);
                    }
                }
                //fix height
                var height = this.contentContainer.height();
                this.element.height(height);
            },
            revalidateWidth: function() {
                this.element.width(this.contentContainer.width());
                mxBuilder.selection.revalidateSelectionContainer();
            },
            destroy: function destroy() {
                var theComponent = mxBuilder.components.getComponent($(this.element));
                if (theComponent.editor) {
                    theComponent.editor.destroy();
                }
                mxBuilder.Component.prototype.destroy.call(this);
            },
            isEditMode: function isEditMode() {
                return this.editMode ? true : false;
            },
            save: function save() {
                var out = mxBuilder.Component.prototype.save.call(this);
                out.data.text = this.contentContainer.html();
                out.data.fontSize = this.fontSize;
                return out;
            },
            publish: function publish() {
                var out = mxBuilder.Component.prototype.publish.call(this);
                out.find(".inline-links").each(function() {
                    var that = $(this), url;
                    switch (that.data("type")) {
                        case "external":
                            url = that.data("url");
                            break;
                        case "page":
                            var pageObj = mxBuilder.pages.getPageObj(that.data("url"));
                            if (pageObj) {
                                url = pageObj.homepage ? "index.html" : pageObj.address + ".html";
                            } else {
                                that.replaceWith(that.contents());
                            }
                            break;
                    }
                    that.attr({
                        href: url,
                        target: "_" + that.data("target")
                    });
                });
                return out;
            },
            getHeadIncludes: function getHeadIncludes() {
                return mxBuilder.Component.prototype.getHeadIncludes.call(this);
            },
            init: function init(properties) {
                mxBuilder.Component.prototype.init.call(this, properties);
                this.contentContainer = this.element.find(".content").css({
                    display: "inline-block",
                    whiteSpace: "nowrap"
                });
                if (properties.data.text) {
                    this.contentContainer.html(properties.data.text);
                }
                this.revalidate();
            },
            getBorder: function getBorder(element) {
                return mxBuilder.Component.prototype.getBorder.call(this, element);
            },
            setBorder: function setBorder(obj) {
                mxBuilder.Component.prototype.setBorder.call(this, obj);
            },
            getBackground: function getBackground(element) {
                return mxBuilder.Component.prototype.getBackground.call(this, element);
            },
            setBackground: function setBackground(obj) {
                mxBuilder.Component.prototype.setBackground.call(this, obj);
            },
            getSettingsPanels: function getSettingsPanels() {
                return {
                    position: {
                        panel: mxBuilder.layout.settingsPanels.position,
                        params: true
                    }
                };
            },
            getSettings: function getSettings() {
                return mxBuilder.Component.prototype.getSettings.call(this);
            },
            nudgeComponent: function nudgeComponent(directionKey, shiftKey) {
                if (!this.isEditMode()) {
                    mxBuilder.Component.prototype.nudgeComponent.call(this, directionKey, shiftKey);
                }
            },
            setWidth: function setWidth(value) {
                mxBuilder.Component.prototype.setWidth.call(this, value);
                this.element.height(this.contentContainer.height());
            }
        });


        //Change widget name and icon
        var widgets = mxBuilder.menuManager.menus.widgets;
        widgets.addComponent("Text Widgets", {
            icon: "flexly-icon-box-component",
            title: "Header Text",
            draggableSettings: {
                helper: function(event) {
                    var theContent = mxBuilder.TitleComponent.prototype.template.clone()
                            .addClass("mx-helper")
                            .data("component", "TitleComponent")
                            .appendTo(mxBuilder.layout.container);
                    return theContent;
                }
            }
        });
    });
}(jQuery));