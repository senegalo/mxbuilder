(function($){    
    $(function(){
        
        mxBuilder.menuManager.menus.photosClipart = {
            _clipartTemplate: mxBuilder.layout.templates.find(".flexly-menu-photos-clipart-tab .clipart").remove(),
            _template: mxBuilder.layout.templates.find(".flexly-menu-photos-clipart-tab").remove(),
            _settings: {},
            _display: [],
            init: function(extra){
                var photosClipart = this;
                
                mxBuilder.menuManager.tabTitle.text("Clipart");
                
                mxBuilder.menuManager.addButtonTo("flexly-icon-photos-light photos-tab-icon", "aux").on({
                    click: function click(){
                        mxBuilder.menuManager.showTab("photos");
                    }
                });
                mxBuilder.menuManager.addButtonTo("flexly-icon-clipart-light photos-tab-icon  photos-current", "aux");
                mxBuilder.menuManager.addButtonTo("flexly-icon-flicker-light photos-tab-icon", "aux").on({
                    click: function click(){
                        mxBuilder.menuManager.showTab("photosFlicker");
                    }
                });
                
                var theContent = this._template.clone();
                var listContainer = theContent.find("ul");
                var draggables = "";
                for(var i=61440; i<61717;i++){
                    if(i==61455 || i==61471 || i==61472){
                        continue;
                    }
                   draggables +='<li class="clipart mx-helper" data-id="'+i+'">&#'+i+'</li>';
                }
                listContainer.append(draggables);
                listContainer.on({
                    mouseenter: function mouseenter(){
                        var element = $(this);
                        if(typeof element.data("init") == "undefined"){
                            element.draggable({
                                helper: function(){
                                    var id = element.data("id");
                                    return $('<span class="mx-helper clipart-helper">&#'+id+';</span>')
                                    .data("component","ClipartComponent")
                                    .data("extra",id)
                                    .appendTo(mxBuilder.layout.container);
                                }
                            }).attr("data-init",true);
                        }
                    }
                },".clipart");
                theContent.appendTo(mxBuilder.menuManager.contentTab);
            }
        }
    });
    
}(jQuery));