(function($) {
    $(function() {

        mxBuilder.menuManager.menus.photosClipart = {
            _clipartTemplate: mxBuilder.layout.templates.find(".flexly-menu-photos-clipart-tab .clipart").remove(),
            _template: mxBuilder.layout.templates.find(".flexly-menu-photos-clipart-tab").remove(),
            _settings: {},
            _display: [],
            init: function(extra) {
                mxBuilder.menuManager.tabTitle.text("Clipart");
                mxBuilder.menuManager.tabButtons.hide();

                var theContent = this._template.clone();
                var listContainer = theContent.find("ul");
                var draggables = "";
                
                for (var i = 61440; i < 61717; i++) {
                    if (i !== 61487 && (i+1) % 16 === 0) {
                        continue;
                    }
                    draggables += '<li class="clipart mx-helper" data-id="' + i + '">&#' + i + '</li>';

                    switch (i) {
                        case 61470:
                            i = 61472;
                            break;
                        case 61618:
                            i = 61631;
                            break;
                    }
                }
                
                listContainer.append(draggables);
                listContainer.on({
                    mouseenter: function mouseenter() {
                        var element = $(this);
                        if (typeof element.data("init") === "undefined") {
                            element.draggable({
                                helper: function() {
                                    var id = element.data("id");
                                    return $('<span class="mx-helper clipart-helper">&#' + id + ';</span>')
                                            .data("component", "ClipartComponent")
                                            .data("extra", id)
                                            .appendTo(mxBuilder.layout.container);
                                }
                            }).attr("data-init", true);
                        }
                    }
                }, ".clipart");
                theContent.appendTo(mxBuilder.menuManager.contentTab);
            }
        };
    });

}(jQuery));