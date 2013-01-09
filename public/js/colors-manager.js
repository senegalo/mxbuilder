(function($){
    
    $(function(){
        mxBuilder.colorsManager = {
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
            createColorObjFromRGBAString: function(color){
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
            createColorObjFromHEXString: function(color){
                var r = parseInt(color.slice(1,3),16);
                var g = parseInt(color.slice(3,5),16);
                var b = parseInt(color.slice(5,7),16);
                return this.createColorObjFromRGBA(r, g, b, 1);
            },
            createColorObjFromRGBA: function(r,g,b,a){
                var out = {};
                $.extend(out,this._colorObj,{
                    r: r,
                    g: g,
                    b: b,
                    a: typeof a != "undefined" && a !== null ?a:1
                });
                return out;
            }
        }
    });
    
}(jQuery));