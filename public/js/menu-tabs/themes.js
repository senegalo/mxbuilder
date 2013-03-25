(function($) {

    $(function() {
        mxBuilder.menuManager.menus.themes = {
            _template: mxBuilder.layout.templates.find(".themes-tab"),
            _enablePreview: true,
            init: function(extra) {
                var themes = this;
                mxBuilder.menuManager.hideTabButtons();
                mxBuilder.menuManager.tabFooterWrapper.height(66).show();
                mxBuilder.menuManager.tabTitle.text("Themes");

                var theContent = this._template.clone().appendTo(mxBuilder.menuManager.contentTab);

                var thePanel;
                //Theme Switcher panel
                thePanel = mxBuilder.layout.settingsPanels.themes.getPanel(false);
                theContent.append(thePanel);
                //Background panels
                var containers = ["header", "body", "footer"];
                for (var c in containers) {
                    var expand = extra ? extra[containers[c]] : false;
                    thePanel = mxBuilder.layout.settingsPanels.layoutBackground.getPanel(containers[c], expand);
                    //patching webkit bug: scrollTop reset on parent/zindex change
                    var thePanelContent = thePanel.find(".jquery-scrollbar-container");
                    if (thePanelContent.length > 0) {
                        var scrollCache = thePanelContent.scrollTop();
                        theContent.append(thePanel);
                        thePanelContent.scrollTop(scrollCache);
                    } else {
                        theContent.append(thePanel);
                    }
                }

                theContent.append('<div class="spacer"></div>').on({
                    panelOpen: function() {
                        mxBuilder.menuManager.revalidateScrollbar();
                    },
                    panelClose: function() {
                        mxBuilder.menuManager.revalidateScrollbar();
                    }
                });

                //the cancel / savebutton 
                $('<div class="flexly-icon flexly-icon-cancel-big-black flexly-component-settings-cancel"/>').appendTo(mxBuilder.menuManager.tabFooter).on({
                    click: function() {
                        theContent.children().trigger("cancel");
                    }
                });
                $('<div class="flexly-icon flexly-icon-save-big-black flexly-component-settings-save"/>').appendTo(mxBuilder.menuManager.tabFooter).on({
                    click: function() {
                        theContent.children().trigger("save");
                    }
                });

                $('<div class="flexly-icon flexly-icon-preview-' + (this._enablePreview ? "enabled" : "disabled") + ' flexly-component-settings-preview"/>').appendTo(mxBuilder.menuManager.tabFooter).on({
                    click: function() {
                        var element = $(this);
                        if (element.hasClass("flexly-icon-preview-disabled")) {
                            element.removeClass("flexly-icon-preview-disabled").addClass("flexly-icon-preview-enabled");
                            themes._enablePreview = true;
                            theContent.children().trigger("previewEnabled");
                        } else {
                            element.removeClass("flexly-icon-preview-enabled").addClass("flexly-icon-preview-disabled");
                            themes._enablePreview = false;
                            theContent.children().trigger("previewDisabled");
                        }
                    }
                });
            },
            isPreview: function() {
                return this._enablePreview;
            }
        }
    });

}(jQuery));