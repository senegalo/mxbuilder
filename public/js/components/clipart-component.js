(function($) {
    $(function() {
        mxBuilder.ClipartComponent = function ClipartComponent(properties) {
            this.init(properties);

            //Edit component behavious settings...
            mxBuilder.Component.apply(this, [{
                    type: "ClipartComponent",
                    draggable: {},
                    resizable: {
                        orientation: "hv",
                        aspectRatio: true
                    },
                    editableZIndex: true,
                    pinnable: true,
                    deletable: true,
                    hasSettings: true,
                    selectable: true,
                    element: properties.element
                }]);

            //Add element events...
            properties.element.on({
                selected: function() {
                    mxBuilder.activeStack.push(properties.element);
                },
                resize: function resize() {
                    mxBuilder.components.getComponent($(this)).revalidate();
                }
            });

            //Extra Initializtion actions...

        };
        $.extend(mxBuilder.ClipartComponent.prototype, new mxBuilder.Component(), {
            template: mxBuilder.layout.templates.find(".clipart-component-instance").remove(),
            clipartContainer: null,
            slope: 0,
            linkObj: null,
            fontSize: 10,
            save: function save() {
                var out = mxBuilder.Component.prototype.save.call(this);

                out.css.color = this.element.css("color");
                out.data.clipartID = this.clipartID;
                out.data.linkObj = this.linkObj;
                out.data.fontSize = this.fontSize;

                return out;
            },
            publish: function publish() {
                var out = mxBuilder.Component.prototype.publish.call(this);

                if (this.linkObj) {
                    out.css({
                        cursor: "pointer"
                    }).find(".clipart").css("cursor", "");

                    var extras = this.linkObj.linkOpenIn ? ' target = "_blank"' : "";

                    extras += ' style="width:100%;height:100%;display:block"';

                    switch (this.linkObj.linkType) {
                        case "external":
                            if (typeof this.linkObj.protocol === "undefined") {
                                this.linkObj.protocol = "http://";
                            }
                            if (typeof this.linkObj.linkOpenIn === "undefined") {
                                this.linkObj.linkOpenIn = true;
                            }
                            out.find(".clipart").wrap('<a href="' + this.linkObj.protocol + this.linkObj.linkURL + '"' + extras + '/>');
                            break;
                        case "page":
                            var page = mxBuilder.pages.getPageObj(this.linkObj.linkURL);
                            if (page.address) {
                                out.find(".clipart").wrap('<a href="./' + page.address + '.html"' + extras + '/>');
                            }
                            break;
                    }
                }

                return out;
            },
            getHeadIncludes: function getHeadIncludes() {
                var out = mxBuilder.Component.prototype.getHeadIncludes.call(this);

                out.css.clipart = "public/css-published/clipart.css";

                return out;
            },
            init: function init(properties) {
                mxBuilder.Component.prototype.init.call(this, properties);
                if (properties.data.extra) {
                    this.clipartID = properties.data.extra;
                }
                this.clipartContainer = this.element.find(".clipart").append("&#" + this.clipartID + ";");
                
                this.slope = 100/this.clipartContainer.css("fontSize",100).width();
                
                this.clipartContainer.css("fontSize", this.fontSize);
                
                this.revalidate();
                if (this.linkObj === null) {
                    this.linkObj = {};
                }
            },
            revalidate: function revalidate() {
                this.fontSize = Math.round(this.slope * this.element.width());
                this.clipartContainer.css("fontSize", this.fontSize);
                
                if (this.clipartContainer.width() < this.element.width()) {
                    while (this.clipartContainer.width() < this.element.width()) {
                        this.fontSize += Math.round(this.slope * (this.element.width()-this.clipartContainer.width()));
                        this.clipartContainer.css("fontSize", this.fontSize);
                    }
                    while (this.clipartContainer.width() > this.element.width()) {
                        this.clipartContainer.css("fontSize", --this.fontSize);
                    }
                } else {
                    while (this.clipartContainer.width() > this.element.width()) {
                        this.fontSize -= Math.round(this.slope * (this.clipartContainer.width()-this.element.width()));
                        this.clipartContainer.css("fontSize", this.fontSize);
                    }
                    while (this.clipartContainer.width() > this.element.width()) {
                        this.clipartContainer.css("fontSize", ++this.fontSize);
                    }
                }
                //fix height
                var height = this.clipartContainer.height();
                this.element.height(height);
            },

            drawPoints: function(points,step) {
                var font = 0;
                var out = "";
                for (var i = 0; i < points; i++, font+=step) {
                    this.clipartContainer.css("fontSize", font);
                    out += font+","+this.clipartContainer.height()+"\n";
                }
                console.log(out);
            },
            getBorder: function getBorder(element) {
                return mxBuilder.Component.prototype.getBorder.call(this, element);
            },
            setBorder: function setBorder(obj) {
                mxBuilder.Component.prototype.setBorder.call(this, obj);
            },
            getBackground: function getBackground(element) {
                return {
                    backgroundColor: this.element.css("color")
                };
            },
            setBackground: function setBackground(obj) {
                this.element.css("color", obj.backgroundColor);
            },
            getSettingsPanels: function getSettingsPanels() {
                var out = mxBuilder.Component.prototype.getSettingsPanels.call(this);

                delete out.border;
                delete out.shadow;

                out.linkto = {
                    panel: mxBuilder.layout.settingsPanels.links,
                    params: false
                };

                return out;
            },
            getSettings: function getSettings() {
                var out = mxBuilder.Component.prototype.getSettings.call(this);
                $.extend(out, {
                    color: this.element.css("color"),
                    linkType: this.linkObj.linkType,
                    linkURL: this.linkObj.linkURL,
                    linkProtocol: this.linkObj.protocol,
                    linkOpenIn: this.linkObj.linkOpenIn
                });
                return out;
            },
            setColor: function setColor(color) {
                this.element.css("color", color);
            },
            setHeight: function(height) {
                mxBuilder.Component.prototype.setHeight.call(this, height);
                this.revalidate();
            },
            setWidth: function(width) {
                mxBuilder.Component.prototype.setWidth.call(this, width);
                this.revalidate();
            }
        });
    });
}(jQuery));