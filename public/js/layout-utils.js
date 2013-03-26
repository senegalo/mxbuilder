(function($) {
    $(function() {


        var collapsablePanelTemplate = mxBuilder.layout.templates.find(".flexly-collapsable-panel").remove();

        mxBuilder.layout.utils = {
            getCollapsablePanel: function(expand, title) {
                var thePanel = collapsablePanelTemplate.clone().appendTo(document.body);
                var theContent = thePanel.find(".flexly-collapsable-content");
                var classes = ["flexly-icon-plus-small-grey", "flexly-icon-minus-small-grey"];

                if (title) {
                    thePanel.find(".flexly-collapsable-title").html(title);
                }

                var updatePanel = function updatePanel(theHead) {
                    var newArrow = theContent.is(":visible") ? 1 : 0;
                    theHead.find(".flexly-icon").removeClass(classes[(newArrow + 1) % 2]).addClass(classes[newArrow]);
                    thePanel.trigger(newArrow === 0 ? "panelClose" : "panelOpen");
                };

                if (expand) {
                    theContent.show();
                    updatePanel(thePanel.find(".flexly-collapsable-header"));
                }

                thePanel.find(".flexly-collapsable-header").on({
                    click: function click() {
                        if (!thePanel.hasClass("flexly-collapsable-disabled")) {
                            var theHead = $(this);
                            theContent.slideToggle(300, function() {
                                updatePanel(theHead);
                            });
                        }
                    }
                });
                return thePanel;
            },
            readSelectionStyles: function(types) {
                var settings = {};
                var firstRun = true;
                mxBuilder.selection.each(function() {
                    for (var t in types) {
                        var styles = this["get" + types[t].uppercaseFirst()]();
                        for (var c in styles) {
                            if (firstRun) {
                                settings[c] = styles[c];
                            } else if (settings[c] !== styles[c]) {
                                settings[c] = false;
                            }
                        }
                    }
                    firstRun = false;
                });
                return settings;
            },
            getOrderdPagesList: function() {
                var pages = mxBuilder.pages.getOrderedPages();
                var out = $();
                for (var p in pages) {
                    var text = pages[p].parent === "root" ? pages[p].title : "---" + pages[p].title;
                    out = out.add($('<option value="' + pages[p].id + '">' + text + '</option>'));
                }
                return out;
            }
        };
    });

}(jQuery));