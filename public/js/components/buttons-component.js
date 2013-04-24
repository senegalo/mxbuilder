(function($) {
    $(function() {
        mxBuilder.ButtonsComponent = function ButtonsComponent(properties) {
            var instance = this;
            this.init(properties);
            mxBuilder.Component.apply(this, [{
                    type: "ButtonsComponent",
                    draggable: {},
                    resizable: {
                        orientation: "hv"
                    },
                    editableZIndex: true,
                    pinnable: true,
                    deletable: true,
                    hasSettings: true,
                    selectable: true,
                    element: properties.element
                }]);

            this.labelContainer = this.element.find("span");

            this.setLabel(this.label);

            properties.element.on({
                selected: function() {
                    mxBuilder.activeStack.push(properties.element);
                },
                resize: function() {
                    instance.element.find("a").css({
                        lineHeight: instance.element.height() + "px"
                    });
                }
            }).trigger("resize");
        };
        $.extend(mxBuilder.ButtonsComponent.prototype, new mxBuilder.Component(), {
            template: mxBuilder.layout.templates.find(".button-component-instance").remove(),
            labelContainer: null,
            label: "Button",
            buttonType: null,
            linkObj: null,
            save: function save() {
                var out = mxBuilder.Component.prototype.save.call(this);
                out.data.linkObj = this.linkObj;
                out.data.label = this.label;
                return out;
            },
            publish: function publish() {
                var out = mxBuilder.Component.prototype.publish.call(this);

                var button = out.find("a");
                var attrs = {};
                
                if(this.linkObj.linkOpenIn){
                    attrs.target = "_blank";
                }
                
                switch (this.linkObj.linkType) {
                    case "external":
                        attrs.href = this.linkObj.linkProtocol+this.linkObj.linkURL;
                        break;
                    case "page":
                        var page = mxBuilder.pages.getPageObj(this.linkObj.linkURL);
                        if (page.address) {
                            attrs.href = page.address + '.html';
                        }
                        break;
                }
                button.attr(attrs);

                return out;
            },
            getHeadIncludes: function getHeadIncludes() {
                return mxBuilder.Component.prototype.getHeadIncludes.call(this);
            },
            init: function init(properties) {
                mxBuilder.Component.prototype.init.call(this, properties);
            },
            getBorder: function getBorder(element) {
                return mxBuilder.Component.prototype.getBorder.call(this, this.element.find("a"));
            },
            setBorder: function setBorder(obj) {
                //mxBuilder.Component.prototype.setBorder.call(this, obj);
                this.element.find("a").css(obj);
            },
            getBackground: function getBackground(element) {
                return mxBuilder.Component.prototype.getBackground.call(this, this.element.find("a"));
            },
            setBackground: function setBackground(obj) {
                //mxBuilder.Component.prototype.setBackground.call(this, obj);
                this.element.find("a").css(obj);
            },
            getSettingsPanels: function getSettingsPanels() {
                var out = mxBuilder.Component.prototype.getSettingsPanels.call(this);

                delete out.border;
                out.background.params.hidePattern = true;
                
                out.color = {
                    panel: mxBuilder.layout.settingsPanels.color
                };

                out.linkto = {
                    panel: mxBuilder.layout.settingsPanels.links,
                    params: false
                };
                out.button = {
                    panel: mxBuilder.layout.settingsPanels.button,
                    params: true
                };

                return out;
            },
            setLabel: function setLabel(txt) {
                this.label = txt;
                this.labelContainer.text(txt);
                this.element.trigger("resize");
            },
            getSettings: function getSettings() {
                var out = mxBuilder.Component.prototype.getSettings.call(this);
                $.extend(out, {
                    label: this.label,
                    linkType: this.linkObj.linkType,
                    linkURL: this.linkObj.linkURL,
                    linkProtocol: this.linkObj.linkProtocol,
                    linkOpenIn: this.linkObj.linkOpenIn
                });
                return out;
            },
            setColor: function(color){
                this.element.find("a").css("color",color);
            }
        });

        var widgets = mxBuilder.menuManager.menus.widgets;
        widgets.addComponent("root", {
            icon: "flexly-icon-box-component",
            title: "Button Component",
            draggableSettings: {
                helper: function(event) {
                    var theContent = mxBuilder.ButtonsComponent.prototype.template.clone()
                            .find(".label")
                            .css({
                        position: "absolute",
                        top: "50%",
                        width: "100%",
                        textAlign: "center",
                        display: "inline-block",
                        marginTop: "-6px"
                    })
                            .end()
                            .addClass("mx-helper")
                            .data("component", "ButtonsComponent")
                            .appendTo(mxBuilder.layout.container);
                    return theContent;
                }
            }
        });
    });
}(jQuery));