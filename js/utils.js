(function($){
    mxBuilder.utils = {
        __GUIDS: {},
        GUID: function(){
            var randString = mxBuilder.getRandString(12);
            while(typeof this.__GUIDS[randString] != "undefined"){
                randString = mxBuilder.getRandString(12);
            }
            this.__GUIDS[randString] = true;
            return randString;
        },
        assignGUID: function(instance){
            instance = $(instance);
            var currentGUID = this.getElementGUID(instance);
            if(currentGUID){
                return currentGUID;
            }
            var guid = this.GUID();
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
            return {
                r: rgba[1],
                g: rgba[2],
                b: rgba[3],
                a: rgba[4],
                toString: function toString(){
                    return "rgba("+this.r+", "+this.g+", "+this.b+" , "+this.a+")";
                },
                toHex: function toHex(){
                    return "#" + ((1 << 24) + (parseInt(this.r,10) << 16) + (parseInt(this.g,10) << 8) + parseInt(this.b)).toString(16).slice(1);
                }
            };
        }
    }
}(jQuery));