(function($){
    
    $(function(){
        mxBuilder.TweetButtonComponent = function TweetButtonComponent(properties){
            this.init(properties);
            mxBuilder.Component.apply(this,[{
                type: "TweetButtonComponent",
                draggable: {
                    iframeFix: true
                },
                editableZIndex: true,
                selectable: true,
                element: properties.element
            }]);
        }
        $.extend(mxBuilder.TweetButtonComponent.prototype,new mxBuilder.Component(), {
            count: "horizontal",
            text: "",
            url: "none",
            template: mxBuilder.layout.templates.find(".tweet-button-component-instance").remove().find("a").addClass("twitter-share-button").end(),
            init: function init(properties){
                mxBuilder.Component.prototype.init.call(this,properties);
                this.rebuild(properties.element);
            },
            publish: function publish(){
                var position = this.element.position();
                
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = mxBuilder.config.baseURL+"/public/js-libs/twitter-init-script.js";
                
                var newConfig = {
                    "data-count": this.count,
                    "data-text": this.text
                }
                if(this.url !== "" && this.url != "none"){
                    newConfig['data-url'] = this.url;
                }
                
                var out = this.template.clone()
                .find(".overlay")
                .remove()
                .end()
                .find("a")
                .attr(newConfig)
                .end();
                
                out.css({
                    left: position.left,
                    top: position.top,
                    position: "absolute"
                });
                
                out.get(0).appendChild(script);
                
                return out;
            },
            getSettingsPanels: function getSettingsPanels(){
                return { "tweetButton": mxBuilder.layout.settingsPanels.tweetButton.getPanel(true) };
            },
            setCounterPosition: function setCounterPosition(position){
                this.count = position;
                this.rebuild();
            },
            setDefaultTweetText: function setDefaultTweetText(text){
                this.text = text;
                this.rebuild()
            },
            setUrl: function setUrl(url){
                this.url = url;
                this.rebuild();
            },
            rebuild: function rebuild(element){
                element = element ? element : this.element;
                var newConfig = {
                    "data-count": this.count,
                    "data-text": this.text
                }
                if(this.url !== "" && this.url != "none"){
                    newConfig['data-url'] = this.url;
                }
                var newButton = this.template.find("a").clone().attr(newConfig);
                element.find(".twitter-button").empty().append(newButton);
                this.revalidate(element);
            },
            revalidate: function revalidate(element){
                element = element ? element : this.element;
                window.twttr && element.find("a").each(function(){
                    window.twttr.widgets.load();
                });
                var theIframe = element.find("iframe");
                var theHeight = theIframe.height();
                var theWidth = theIframe.width();
                
                element.height(theHeight);
                element.width(theWidth);
            },
            getSettings: function getSettings(){
                return {
                    count: this.count,
                    text: this.text,
                    url: this.url
                }
            },
            save: function save(){
                var out = mxBuilder.Component.prototype.save.call(this);
                out.data.count = this.count;
                out.data.text = this.text;
                out.data.url = this.url;
                return out;
            }
        });
        
        var widgets = mxBuilder.menuManager.menus.widgets;
        widgets.addComponent("root",{
            icon: "flexly-icon-box-component",
            title: "Tweet Button",
            draggableSettings: {
                grid: mxBuilder.properties.gridSize,
                helper: function(event){
                    var theContent = mxBuilder.TweetButtonComponent.prototype.template.clone()
                    .addClass("mx-helper")
                    .data("component","TweetButtonComponent")
                    .appendTo(mxBuilder.layout.container);
                    return theContent;
                }
            }
        }); 
    });
    
}(jQuery));