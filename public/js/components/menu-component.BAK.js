(function($) {

    $(function() {
        mxBuilder.MenuComponent = function MenuComponent(properties) {
            var menuComponent = this;
            this.init(properties);
            mxBuilder.Component.apply(this, [{
                    type: "MenuComponent",
                    draggable: {},
                    resizable: {
                        orientation: "h"
                    },
                    editableZIndex: true,
                    hasSettings: true,
                    selectable: true,
                    element: properties.element
                }]);

            this.element.on({
                resize: function resize() {
                    menuComponent.revalidate();
                }
            });

            this.rebuild(properties.element, true);
        };

        var template = mxBuilder.layout.templates.find(".flexly-main-menu-component-instance").remove();
        var listTemplate = template.find("ul").remove();
        var listElementTemplate = listTemplate.find("li").remove();
        $.extend(mxBuilder.MenuComponent.prototype, new mxBuilder.Component(), {
            template: template,
            orientation: "h",
            moreLinkText: "More...",
            theme: "default",
            _themeLinkTag: $("#main-menu-theme"),
            init: function init(properties) {
                mxBuilder.Component.prototype.init.call(this, properties);
            },
            rebuild: function rebuild(element) {
                element = element ? element : this.element;
                element.children("ul, div.clearer").remove();
                var theList = listTemplate.clone().find("li").remove().end().appendTo(element);

                this.setOrientation(this.orientation);
                this.setTheme(this.theme);
                this.setMoreLink(this.moreLinkText);

                var pages = mxBuilder.pages.getOrderedPages();
                for (var p in pages) {
                    if (pages[p].showInMenu !== true) {
                        continue;
                    }
                    if (pages[p].parent === "root" && element.find(".main-menu-cat-" + pages[p].id).length === 0) {
                        var theListElement = this.getListElement(pages[p]);
                        theList.append(theListElement);
                    } else if (pages[p].parent !== "root" && mxBuilder.pages.getPageObj(pages[p].parent).showInMenu === true) {
                        //Check if we created the parent element
                        var theParentList = element.find(".main-menu-cat-" + pages[p].parent);
                        var parentPageObj = mxBuilder.pages.getPageObj(pages[p].parent);
                        if (theParentList.length === 0) {
                            theParentList = this.getListElement(parentPageObj).appendTo(theList);
                        }

                        //Checking if we created the list of siblings
                        var theParentSiblings = theParentList.find("ul.main-menu-cat-child");

                        if (theParentSiblings.length === 0) {
                            theParentSiblings = this.getList(parentPageObj);
                            theParentList.append(theParentSiblings);
                            theParentList.find("a").wrapInner('<div class="dir"/>');
                        }
                        //finally append the element
                        theParentSiblings.append(this.getListElement(pages[p]));

                    }
                }
                theList.customMenu();
                theList.children("li").each(function() {
                    var element = $(this);
                    element.data("true-dimensions", {
                        width: element.width(),
                        height: element.height()
                    });
                });
                this.setOrientation(this.orientation);
                this.setTheme(this.theme);
                mxBuilder.selection.revalidateSelectionContainer();
            },
            getList: function getList(obj) {
                return listTemplate.clone()
                        .addClass("main-menu-cat-child main-menu-cat-" + obj.id)
                        .removeClass("main-menu-container");
            },
            getListElement: function getListElement(obj) {
                return listElementTemplate.clone()
                        .addClass("main-menu-cat main-menu-cat-" + obj.id)
                        .find("a")
                        .attr("data-id", obj.id)
                        .text(obj.title)
                        .end();
            },
            revalidate: function revalidate(element) {
                element = element ? element : this.element;

                var length = this.orientation === "h" || this.orientation === "hu" ? "width" : "height";
                var theUl = element.children("ul");
                var moreListElement = theUl.find(".main-menu-more");
                var moreListElementChilds = moreListElement.find(">ul").children("li");
                var elementLength = element[length]();
                var extraSpace = null;

                //Checklist
                var sumListElementLength = 0;
                theUl.children("li").each(function() {
                    var element = $(this);
                    if (extraSpace === null) {
                        extraSpace = element["outer" + length.uppercaseFirst()](true) - element[length]();
                    }
                    sumListElementLength += element[length]() + extraSpace;
                });

                var isMoreListElementCreated = moreListElement.length > 0 && moreListElementChilds.length > 0;
                var isEnoughLength = isMoreListElementCreated ? (moreListElementChilds.first().data("true-dimensions")[length] + extraSpace) + sumListElementLength + 10 : 0;

                if (moreListElementChilds.length === 1) {
                    isEnoughLength -= moreListElement[length]() - extraSpace;
                }
                isEnoughLength = isEnoughLength < elementLength;

                //Remove from the more element and push it to the main menu if we have enough space
                if (isMoreListElementCreated && isEnoughLength) {
                    var moreListChildren = moreListElement.children("ul");
                    moreListChildren.children("li:first-child").insertBefore(moreListElement);
                    if (moreListChildren.children("li").length === 0) {
                        moreListElement.remove();
                    }
                }

                //Push it back in the more element if we do not have enough space
                if (sumListElementLength > elementLength) {

                    //Do we have a more list element !??
                    if (moreListElement.length === 0) {
                        moreListElement = listElementTemplate.clone()
                                .addClass("main-menu-cat main-menu-more")
                                .appendTo(theUl)
                                .find("a")
                                .html('<div class="dir">' + this.moreLinkText + '</div>')
                                .end();
                        listTemplate.clone().appendTo(moreListElement)
                                .addClass("main-menu-cat-child")
                                .removeClass("main-menu-container");
                        sumListElementLength += moreListElement[length]() + extraSpace;
                    }
                    var x = 0;
                    var thePushedDown = {
                        length: 1
                    };
                    while (sumListElementLength > elementLength && thePushedDown.length > 0) {
                        x++;
                        thePushedDown = moreListElement.prev();
                        sumListElementLength -= extraSpace + thePushedDown[length]();
                        thePushedDown.prependTo(moreListElement.children("ul"));
                    }
                }
                if (length === "width") {
                    element.height(theUl.outerHeight(true));
                } else {
                    element.width(theUl.outerWidth(true));
                }
                mxBuilder.selection.revalidateSelectionContainer();
            },
            getSettingsPanels: function getSettingsPanel() {
                return {
                    position: {
                        panel: mxBuilder.layout.settingsPanels.position,
                        params: false
                    },
                    mainMenu: {
                        panel: mxBuilder.layout.settingsPanels.mainMenu,
                        params: true
                    }
                };
            },
            setMoreLink: function setMoreLinkText(text) {
                if (text.trim() === "") {
                    text = "More...";
                }
                this.moreLinkText = text;
                this.element.find(".main-menu-cat.main-menu-more>a").text(text);
                this.revalidate();
            },
            setTheme: function setTheme(theme) {
                var mainMenu = this;
                this.element.children("ul").removeClass(this.theme + "-theme").addClass(theme + "-theme");
                this.theme = theme;
                mainMenu.element.css("background", mainMenu.element.find("ul.main-menu-container > li:first").css("background"));
                mainMenu.revalidate();
            },
            setOrientation: function setOrientation(o) {
                var theUl = this.element.children("ul");
                var widest = 0;
                this.element.find("ul.main-menu-container>li").each(function() {
                    var width = $(this).outerWidth(true);
                    if (width > widest) {
                        widest = width;
                    }
                });

                theUl.removeClass(this.orientation === "h" ? "dropdown-horizontal" : "dropdown-vertical");
                switch (o) {
                    case "h":
                        theUl.addClass("dropdown-horizontal");
                        this.element.height(theUl.height());
                        break;
                    case "v":
                        theUl.addClass("dropdown-vertical");
                        this.element.width(theUl.width());
                        break;
                }
                this.updateResizeHandles(o);
                this.orientation = o;
                this.revalidate();
            },
            save: function save() {
                var out = mxBuilder.Component.prototype.save.call(this);
                out.data.orientation = this.orientation;
                out.data.moreLinkText = this.moreLinkText;
                out.data.theme = this.theme;
                return out;
            },
            publish: function publish() {
                var out = mxBuilder.Component.prototype.publish.call(this);
                out.find("a").each(function() {
                    var element = $(this);
                    var page = mxBuilder.pages.getPageObj(element.data("id"));
                    var address = page.homepage ? "index.html" : page.address + ".html";
                    element.attr("href", address);
                });
                return out;
            },
            getHeadIncludes: function getHeadIncludes() {
                var out = mxBuilder.Component.prototype.getHeadIncludes.call(this);
                out.css["mainMenuOrientation" + this.orientation.uppercaseFirst()] = "public/css/menu/dropdown/dropdown" + (this.orientation === "v" ? ".vertical" : "") + ".css";
                out.css["mainMenuTheme" + this.theme.uppercaseFirst()] = "public/css/menu/dropdown/themes/" + this.theme + "/default." + this.orientation + ".css";
                return out;
            },
            updateResizeHandles: function updateResizeHandles(orientation) {
                mxBuilder.Component.prototype.updateResizeHandles.call(this, orientation);
                this.element.find(".component-resizable-handle").css("z-index", 1000);
            },
            getSettings: function getSettings() {
                var out = mxBuilder.Component.prototype.getSettings.call(this);
                $.extend(out, {
                    orientation: this.orientation,
                    moreLinkText: this.moreLinkText,
                    theme: this.theme
                });
                return out;
            },
            setWidth: function setWidth(val) {
                mxBuilder.Component.prototype.setWidth.call(this, val);
                this.revalidate();
            }
        });

        var widgets = mxBuilder.menuManager.menus.widgets;
        widgets.addComponent("root", {
            icon: "flexly-icon-box-component",
            title: "Main Menu",
            draggableSettings: {
                helper: function(event) {
                    return $('<div style="width: 400px;height:30px;background-color:#fff;border:1px solid black;"/>').addClass("mx-helper")
                            .data("component", "MenuComponent")
                            .appendTo(mxBuilder.layout.container);
                }
            }
        });

    });
}(jQuery));