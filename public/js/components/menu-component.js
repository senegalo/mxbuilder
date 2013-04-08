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
        $.extend(mxBuilder.MenuComponent.prototype, new mxBuilder.Component(), {
            listItemTemplate: mxBuilder.layout.templates.find(".menu-component-instance").find("li").remove(),
            listTemplate: mxBuilder.layout.templates.find(".menu-component-instance").find("ul").remove(),
            template: mxBuilder.layout.templates.find(".menu-component-instance").remove(),
            orientation: "h",
            moreLinkText: "More...",
            theme: "default",
            _themeLinkTag: $("#main-menu-theme"),
            init: function init(properties) {
                mxBuilder.Component.prototype.init.call(this, properties);
            },
            rebuild: function() {
                //getting the pages
                var pages = mxBuilder.pages.getOrderedPages();

                //creating the main list
                var mainList = this.listTemplate.clone();

                for (var p in pages) {
                    var currPage = pages[p];
                    if (!pages.hasOwnProperty(p) || currPage.showInMenu !== true) {
                        continue;
                    }

                    //if root element and not created.. create it !
                    if (currPage.parent === "root" && mainList.find(".page-" + currPage.id).length === 0) {
                        mainList.append(this.createElement(currPage));
                    } else if (currPage.parent !== "root") {
                        //get parent list
                        var parentList = mainList.find(".page-" + currPage.parent);

                        //is this parent element created !? 
                        if (parentList.length === 0) {
                            console.error("Can't find parent list");
                            continue;
                        }

                        //if we didn't style the parent to have children ... let's do it now !
                        var subList = parentList.find("ul.dropdown-menu");
                        if (subList.length === 0) {
                            parentList.addClass("dropdown").find("a").addClass("dropdown-toggle").append('<b class="caret"></b>');
                            subList = $('<ul class="dropdown-menu"></ul>').appendTo(parentList);
                        }

                        subList.append(this.createElement(currPage));
                    }
                }

                this.element.find(".navbar-inner").empty().append(mainList);
                
                mainList.children("li").each(function() {
                    var element = $(this);
                    element.data("true-dimensions", {
                        width: element.width(),
                        height: element.height()
                    });
                });

                this.element.find('ul.nav li.dropdown').hover(function() {
                    $(this).find('.dropdown-menu').stop(true, true).fadeIn(200);
                }, function() {
                    $(this).find('.dropdown-menu').stop(true, true).delay(200).fadeOut(200);
                });

            },
            createElement: function(obj) {
                return this.listItemTemplate.clone().addClass("page-" + obj.id)
                        .find("a").append(obj.title).end();
            },
            revalidate: function revalidate(element) {
                element = element ? element : this.element;

                var length = this.orientation === "h" || this.orientation === "hu" ? "width" : "height";
                var theUl = element.find("ul.nav");
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
                        moreListElement = this.listItemTemplate.clone()
                                .appendTo(theUl)
                                .find("a")
                                .html(this.moreLinkText + ' <b class="caret"></b>')
                                .attr("data-toggle","dropdown")
                                .addClass("dropdown-toggle")
                                .end();
                        this.listTemplate.clone()
                                .addClass("dropdown-menu")
                                .removeClass("nav")
                                .appendTo(moreListElement);
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