(function($){
    mxBuilder.activeStack = {
        __stack: [],
        __refs: {},
        push: function add(instance){
            instance = $(instance).get(0);
            if(this.__stack.length == 0){
                $(instance).on({
                    "deselected.activestackcontrol": function(){
                        var that = $(this);
                        mxBuilder.activeStack.popTo(that);
                        that.off(".activestackcontrol");
                    }
                })
            }
            this.__stack.push(instance);
            this.__refs[mxBuilder.utils.assignGUID(instance)] = instance;
        },
        pop: function pop(){
            var out = $(this.__stack.pop());
            delete this.__refs[mxBuilder.utils.getElementGUID(out)];
            out.trigger("poppedFromActiveStack");
            
            return $(out);
        },
        popTo: function popTo(instance){
            instance = $(instance).get(0);
            var out = $();
            
            //searching for the element if it exsists
            if(!this.hasElement(instance)){
                $.error("Can't find element");
            } else {
                do {
                    var current = this.pop();
                    out = out.add(current);
                } while(current.get(0) !== instance);
            }
            return out;
        },
        hasElement: function hasElement(instance){
            return this.__refs[mxBuilder.utils.getElementGUID(instance)] ? true : false;
        },
        isTopActiveElement: function isTopActiveElement(instance){
            instance = $(instance).get(0);
            return this.__stack[this.__stack.legth-1] === instance ? true : false;
        }
    };
    
//    $(function(){
//        mxBuilder.layout.container.on({
//            click: function(){
//                console.log("popped...");
//            }
//        });
//    });
    
}(jQuery));