(function($){
    mxBuilder.utils = {
        __GUIDS: {},
        _colorObj:  {
            r: 0,
            g: 0,
            b: 0,
            a: 1,
            toString: function toString(){
                return "rgba("+this.r+", "+this.g+", "+this.b+" , "+this.a+")";
            },
            toHex: function toHex(){
                return "#" + ((1 << 24) + (parseInt(this.r,10) << 16) + (parseInt(this.g,10) << 8) + parseInt(this.b)).toString(16).slice(1);
            },
            getInverse: function getInverse(){
                var out = {};
                $.extend(out,this,{
                    r: 255-this.r,
                    g: 255-this.g,
                    b: 255-this.b
                });
                return out;
            },
            equal: function equal(rgba){
                var out = {};
                var success = true;
                for(var p in this){
                    if(p == "toString" || p == "toHex"  || p == "equal"){
                        out[p] = this[p];
                        continue;
                    }
                    if(this[p] != rgba[p]){
                        out[p] = false;
                        out.dirty = true;
                        success = false;
                    } else {
                        out[p] = this[p];
                    }
                }
                return out;
            }
        },
        GUID: function(){
            var randString = mxBuilder.getRandString(12);
            while(typeof this.__GUIDS[randString] != "undefined"){
                randString = mxBuilder.getRandString(12);
            }
            this.__GUIDS[randString] = true;
            return randString;
        },
        assignGUID: function(instance,optional_guid){
            instance = $(instance);
            var currentGUID = this.getElementGUID(instance);
            if(currentGUID){
                return currentGUID;
            }
            var guid = optional_guid?optional_guid:this.GUID();
            instance.data("GUID",guid);
            return guid;
        },
        getElementGUID: function(instance){
            instance = $(instance);
            return instance.data("GUID");
        },
        suppressNonDigitKeyEvent: function(event){
            if((event.keyCode != 46 && event.keyCode != 39 && event.keyCode != 37 && event.keyCode != 8) && (event.keyCode < 48 || event.keyCode > 57)){
                event.preventDefault();
                return false;
            }
        },
        getColorObj: function(color){
            var rgba = color.match(/(([\d\.]+)|(rgb[a]?))/g);
            if(rgba[0] != "rgba"){
                rgba.push(1);
            }
            var out = {};
            
            $.extend(out,this._colorObj,{
                r: rgba[1],
                g: rgba[2],
                b: rgba[3],
                a: rgba[4]
            });
            return out;
        },
        strToAddress: function(str){
            return str.replace(/((\s+|[^a-zA-Z0-9]+)(?=$)|[^a-zA-Z0-9\s])/g,"").replace(/\s+/g,"_").toLowerCase();
        },
        getElementBackgroundObj: function (element){
            return {
                "background-position": element.css("backgroundPosition"),
                "background-color": element.css("backgroundColor"),
                "background-image": element.css("backgroundImage"),
                "background-repeat": element.css("backgroundRepeat"),
                "background-attachment": element.css("backgroundAttachment")
            }
        },
        createColorObj: function(){
            var out = {};
            $.extend(out,this._colorObj);
            return out;
        }
    }
}(jQuery));