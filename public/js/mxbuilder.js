(function($){
    
    //Adding the array indexOf function if it does not exsist
    if (!Array.prototype.indexOf) {  
        Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {  
            "use strict";  
            if (this === void 0 || this === null) {  
                throw new TypeError();  
            }  
            var t = Object(this);  
            var len = t.length >>> 0;  
            if (len === 0) {  
                return -1;  
            }  
            var n = 0;  
            if (arguments.length > 0) {  
                n = Number(arguments[1]);  
                if (n !== n) { // shortcut for verifying if it's NaN  
                    n = 0;  
                } else if (n !== 0 && n !== Infinity && n !== -Infinity) {  
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));  
                }  
            }  
            if (n >= len) {  
                return -1;  
            }  
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);  
            for (; k < len; k++) {  
                if (k in t && t[k] === searchElement) {  
                    return k;  
                }  
            }  
            return -1;  
        }; 
    }
    
    //Adding the isArray function if it does not exsist
    if(!Array.isArray) {  
        Array.isArray = function (arg) {  
            return Object.prototype.toString.call(arg) === '[object Array]';  
        };  
    }

    //Uppercase first letter of a given string
    if(!String.prototype.uppercaseFirst){
        String.prototype.uppercaseFirst = function(){
            if(this.length > 1){
                return this.charAt(0).toUpperCase() + this.slice(1);
            } else { 
                return this.toUpperCase();
            }
        };
    }
    
    
    /**
     * Reduces a string if it's longer than the given length
     */
    if(!String.prototype.reduceString){
        String.prototype.reduceString = function(length){
            if(this.length > length){
                return this.slice(0, length)+"...";
            } else {
                return this.toString();
            }
        };
    }
    
    /**
     * Removes any white spaces at the start or end of the string
     * @param txt the string to trim
     * @return string trimmed string
     */
    if(!String.prototype.trim){
        String.prototype.trim = function(){
            return this.replace(/^\s+|\s+$/g,"");
        };
    }
    
    if(typeof mxBuilder === "undefined"){
        mxBuilder = {};
    }
        
    /**
     * Basic Ajax setup
     */
    $.ajaxSetup({
        dataType: "json",
        type: "post",
        cache: false       
    });
    
    mxBuilder.dialogs = {};
    
    mxBuilder.systemEvents = {};
    
    /**
     * JQUERY UI RESIZABLE ASPECTRATIO PATCH
     */
    (function() {
        var oldSetOption = $.ui.resizable.prototype._setOption;
        $.ui.resizable.prototype._setOption = function(key, value) {
            oldSetOption.apply(this, arguments);
            if (key === "aspectRatio") {
                this._aspectRatio = !!value;
            }
        };
    })();
    
    
    /**
     * DEBUG METHODS 
     */
    
    mxBuilder.dumpSelected = function(){
        mxBuilder.selection.each(function(){console.log(this.save());});
    };
    
    mxBuilder.getSelected = function(){
        var out;
        mxBuilder.selection.each(function(){out = this; });
        return out;
    };
    
}(jQuery));