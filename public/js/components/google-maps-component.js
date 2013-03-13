(function($){
    $(function(){
        mxBuilder.GoogleMapsComponent = function GoogleMapsComponent(properties){
            this.init(properties);
            var instance = this;
            //Edit component behavious settings...
            
            this.element.on({
                mousedown: function mousedown(event){
                    if(event.which == 3){
                        if(mxBuilder.selection.getSelectionCount() == 1){
                            mxBuilder.contextmenu.allowPropagation().getMainCtx().addItem({
                                label: instance.editMode?instance.buttonOn:instance.buttonOff,
                                callback: function(){
                                    instance.setEditMode(!instance.editMode);
                                    mxBuilder.menuManager.showTab("componentSettings");
                                }
                            });
                        }
                    }
                }
            });
            
            mxBuilder.Component.apply(this,[{
                type: "GoogleMapsComponent",
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
    
            //Add element events...
            properties.element.on({
                selected: function selected(){
                    mxBuilder.activeStack.push(properties.element);
                },
                resize: function resize(){
                    google.maps.event.trigger(instance.mapObj, 'resize');
                },
                deselected: function deselected(){
                    instance.setEditMode(false);
                }
            });
                       
            //Extra Initializtion actions...
            this.overlay = this.element.find(".overlay");
            this.rebuild();
        }
        $.extend(mxBuilder.GoogleMapsComponent.prototype, new mxBuilder.Component(), {
            template: mxBuilder.layout.templates.find(".google-maps-component-instance").remove(),
            mapObj: null,
            lon: 29.940842782096848,
            lat: 31.212794260952904,
            mapType: null,
            zoom: 17,
            editMode: false,
            overlay: null,
            buttonOn: "Finished Editing",
            buttonOff: "Edit Map Position",
            rebuild: function rebuild(){
                this.ready(function(){
                    this.mapType = this.mapType ? this.mapType : google.maps.MapTypeId.ROADMAP
                    var mapOptions = {
                        zoom: this.zoom,
                        center: new google.maps.LatLng(this.lat, this.lon),
                        mapTypeId: this.mapType
                    }
                    this.mapObj = new google.maps.Map(this.element.find(".map").get(0), mapOptions);
                    var instance = this;
                    google.maps.event.addListener(this.mapObj, 'center_changed', function() {
                        var center = instance.mapObj.getCenter();
                        instance.lat = center.lat();
                        instance.lon = center.lng();
                    });
                    
                    google.maps.event.addListener(this.mapObj, 'zoom_changed', function() {
                        instance.zoom = instance.mapObj.getZoom();
                    });
                    
                    google.maps.event.addListener(this.mapObj, 'maptypeid_changed', function() {
                        instance.mapType = instance.mapObj.getMapTypeId();
                    });
                });
            },
            loadAPI: function loadAPI(){
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.id = "google-maps-api"
                script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyAYRjWpTlYtPFMDPBX9fwBwDdtEMxvFshM&sensor=false&callback=mxBuilder.GoogleMapsComponent.prototype.apiLoaded";
                document.body.appendChild(script);  
            },
            ready: function ready(func){
                if(typeof google == "undefined"){
                    var instance = this;
                    $(document).one("googleMapsReady",function(){
                        func.call(instance);
                    });
                    if($("#google-maps-api").length == 0){
                        this.loadAPI();
                    }
                } else {
                    func.call(this);
                }
            },
            apiLoaded: function apiLoaded(){
                $(document).trigger("googleMapsReady");
            },
            save: function save(){
                var out =  mxBuilder.Component.prototype.save.call(this);
                
                out.data.lon = this.lon;
                out.data.lat = this.lat;
                out.data.mapType = this.mapType;
                out.data.zoom = this.zoom;
                
                return out;
            },
            publish: function publish(){
                var out = mxBuilder.Component.prototype.publish.call(this);
                
                out.find(".map").remove();
                
                var mapType = "m";
                
                switch(this.mapType){
                    case "terrain":
                        mapType = "p";
                        break;
                    case "hybrid":
                        mapType = "h";
                        break;
                    case "satellite":
                        mapType = "k";
                        break;
                }
                
                $('<iframe/>').attr({
                    width: "100%",
                    height: "100%",
                    frameborder: "0",
                    scrolling: "no",
                    marginheight: "0",
                    marginwidth: "0",
                    src: "https://maps.google.com/?ie=UTF8&ll="+this.lat+","+this.lon+"&t="+mapType+"&z="+this.zoom+"&output=embed"
                }).appendTo(out);
                
                return out;
            },
            getHeadIncludes: function getHeadIncludes(){
                return mxBuilder.Component.prototype.getHeadIncludes.call(this);
            },
            init: function init(properties){
                mxBuilder.Component.prototype.init.call(this,properties);
            },
            getBorder: function getBorder(element){
                return mxBuilder.Component.prototype.getBorder.call(this,element);
            },
            setBorder: function setBorder(obj){
                mxBuilder.Component.prototype.setBorder.call(this,obj);
            },
            getBackground: function getBackground(element){
                return mxBuilder.Component.prototype.getBackground.call(this,element);
            },
            setBackground: function setBackground(obj){
                mxBuilder.Component.prototype.setBackground.call(this,obj);
            },
            getSettingsPanels: function getSettingsPanels(){
                var out = mxBuilder.Component.prototype.getSettingsPanels.call(this);
                out.googleMaps = {
                    panel: mxBuilder.layout.settingsPanels.googleMaps,
                    params: true
                };
                return out;
            },
            setEditMode: function setEditMode(flag){
                if(flag){
                    this.overlay.hide();
                    this.editMode = true;
                    this.element.draggable("disable");
                    mxBuilder.selection.enableMultiComponentSelect(false);
                } else {
                    this.overlay.show();
                    this.editMode = false;
                    this.element.draggable("enable");
                    mxBuilder.selection.enableMultiComponentSelect(true);
                }
            },
            getSettings: function getSettings(){
                var out = mxBuilder.Component.prototype.getSettings.call(this);
                $.extend(out,{
                    editMode: this.editMode
                });
                return out;
            },
            destroy: function destroy(){
                mxBuilder.Component.prototype.destroy.call(this);
                if(this.mapObj){
                    google.maps.event.clearInstanceListeners(this.mapObj);
                }
            }
        });
        
        
        //Change widget name and icon
        var widgets = mxBuilder.menuManager.menus.widgets;
        widgets.addComponent("root",{
            icon: "flexly-icon-box-component",
            title: "Google Maps",
            draggableSettings: {
                helper: function(event){
                    var theContent = $('<div><img src="public/images/gmap.png"/></div>')
                    .addClass("mx-helper")
                    .data("component","GoogleMapsComponent")
                    .appendTo(mxBuilder.layout.container);
                    return theContent;
                }
            }
        });
    });
}(jQuery))