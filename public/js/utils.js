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
        }
    }
}(jQuery));