(function($){
    $(function(){
        
        
        var collapsablePanelTemplate = mxBuilder.layout.templates.find(".flexly-collapsable-panel").remove();
        
        mxBuilder.layout.utils = {
            getCollapsablePanel: function(){
                var thePanel = collapsablePanelTemplate.clone();
                var theContent = thePanel.find(".flexly-collapsable-content");
                var classes = ["flexly-icon-plus-small-grey", "flexly-icon-minus-small-grey"];
                thePanel.find(".flexly-collapsable-header").on({
                    click: function click(){
                        var newArrow = theContent.is(":visible") ? 0 : 1;
                        var theHead = $(this);
                        theContent.slideToggle(300,function(){
                            theHead.find(".flexly-icon").removeClass(classes[(newArrow+1)%2]).addClass(classes[newArrow]);
                            thePanel.trigger(newArrow === 0 ? "panelClose" : "panelOpen");
                            mxBuilder.menuManager.revalidateScrollbar();
                        });
                    }
                });
                return thePanel;
            },
            readSelectionStyles: function(styles){
                var settings = {};
                var firstRun = true;
                mxBuilder.selection.each(function(){
                    for(var c in styles){
                        var element = this['get'+c.uppercaseFirst()+'Element']();
                        
                        for(var s in styles[c]){
                            var style = element.css(styles[c][s]);
                            if(firstRun){
                                settings[styles[c][s]] = style;
                            } else if(settings[styles[c][s]] !== style){
                                settings[styles[c][s]] = false;
                            }
                        }
                    }
                    firstRun = false;
                });
                return settings;
            }
        }
    });
    
}(jQuery));