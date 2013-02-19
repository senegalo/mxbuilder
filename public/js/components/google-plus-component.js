(function($){
    
    $(function(){
        mxBuilder.GooglePlusComponent = function GooglePlusComponent(properties){
            this.init(properties);
            
            var instance = this;
            
            mxBuilder.Component.apply(this,[{
                type: "GooglePlusComponent",
                draggable: {
                    iframeFix: true
                },
                editableZIndex: true,
                selectable: true,
                element: properties.element
            }]);
        
            this.element.on({
                selected: function selected(){
                    instance.revalidate();
                }
            });
            
        }
        $.extend(mxBuilder.GooglePlusComponent.prototype,new mxBuilder.Component(), {
            buttonSize: "standard",
            annotation: "bubble",
            template: mxBuilder.layout.templates.find(".google-plus-component-instance").remove(),
            init: function init(properties){
                mxBuilder.Component.prototype.init.call(this,properties);
                this.rebuild(properties.element);
            },
            getHeadIncludes: function getHeadIncludes(){
                return {
                    scripts: {
                        googlePlusApi: "https://apis.google.com/js/plusone.js"
                    },
                    css: {}
                }
            },
            getSettingsPanels: function getSettingsPanels(){
                return {
                    gplusButton: {
                        panel: mxBuilder.layout.settingsPanels.gplusButton,
                        params: true
                    }
                };
            },
            setCounterPosition: function setCounterPosition(pos){
                if(pos == "vertical"){
                    this.buttonSize = "tall";
                    this.annotation = "bubble";
                } else if (pos == "none") {
                    this.annotation = "none";
                } else if (pos == "horizontal"){
                    this.annotation = "bubble";
                    if(this.buttonSize == "tall"){
                        this.buttonSize = "standard";
                    }
                }
                this.rebuild();
            },
            setSize: function setSize(size){
                this.buttonSize = size;
                this.rebuild();
            },
            getSize: function getSize(){
                return this.buttonSize;
            },
            getCounterPosition: function getCounterPosition(){
                if(this.buttonSize == "tall" && this.annotation == "bubble"){
                    return "vertical";
                } else if (this.annotation == "none"){
                    return "none";
                } else {
                    return "horizontal";
                }
            },
            rebuild: function rebuild(element){
                
                element= element ? element : this.element;
                gapi.plusone.render(element.find(".button").empty().get(0),{
                    annotation: this.annotation,
                    size: this.buttonSize
                });
                this.revalidate();
            },
            revalidate: function revalidate(element){
                element = element ? element : this.element;
                var theHeight,theWidth;
                
                if(this.buttonSize == "tall"){
                    theWidth = 50;
                    if(this.annotation == "bubble"){
                        theHeight = 60; 
                    } else {
                        theHeight = 20;
                    }
                } else if (this.buttonSize == "standard"){
                    theHeight = 24;
                    if(this.annotation == "bubble"){
                        theWidth = 106;
                    } else {
                        theWidth = 38;
                    }
                } else if (this.buttonSize == "medium"){
                    theHeight = 20;
                    if(this.annotation == "bubble"){
                        theWidth = 90;
                    } else {
                        theWidth = 32;
                    }
                } else if(this.buttonSize == "small"){
                    theHeight = 15;
                    if(this.annotation == "bubble"){
                        theWidth = 70;
                    } else {
                        theWidth = 24;
                    }
                }
                element.css({
                    height: theHeight,
                    width: theWidth
                });
                mxBuilder.selection.revalidateSelectionContainer();
            },
            save: function save(){
                var out = mxBuilder.Component.prototype.save.call(this);
                out.data.annotation = this.annotation;
                out.data.buttonSize = this.buttonSize;
                return out;
            }
        });
        
        var widgets = mxBuilder.menuManager.menus.widgets;
        widgets.addComponent("root",{
            icon: "flexly-icon-box-component",
            title: "Google Plus Button",
            draggableSettings: {
                grid: mxBuilder.properties.gridSize,
                helper: function(event){
                    var theContent = $('<div>+1</div>')
                    .addClass("mx-helper")
                    .data("component","GooglePlusComponent")
                    .appendTo(mxBuilder.layout.container);
                    return theContent;
                }
            }
        }); 
    });
    
}(jQuery));