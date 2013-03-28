(function($) {

    //helper functions
    var helpers = {};

    $.fn.customSlider = function(method) {
        var methods = {
            init: function(args) {
                //Init Settings
                var settings = {
                    max: 100,
                    min: 0,
                    suffix: "",
                    invert: false,
                    slide: function() {

                    }
                };
                $.extend(settings, args);
                return this.each(function() {
                    var element = $(this).addClass("slider");

                    if (typeof settings.value === "undefined") {
                        settings.value = typeof settings.min !== "undefined" ? settings.min : 0;
                    }

                    element.data("slider-settings", settings);

                    //Creating the value box
                    var handle = $('<a class="slider-handle" href="#"></a>').appendTo(element);
                    $(document).on({
                        mouseup: function() {
                            handle.data("init-sliding", false);
                        },
                        mousemove: function(event) {
                            var element = handle;
                            if (element.data("init-sliding")) {
                                var slider = element.parents(".slider:first");
                                var valueBox = slider.find(".slider-valuebox");
                                var settings = slider.data("slider-settings");
                                var handlePosition;
                                var sliderOffset = slider.offset();
                                var minHandleOffset = sliderOffset.left;
                                var maxHandleOffset = minHandleOffset + slider.width() - element.outerWidth();

                                if (event.clientX < minHandleOffset) {
                                    handlePosition = 0;
                                    element.css("left", "0px");
                                } else if (event.clientX > maxHandleOffset) {
                                    handlePosition = maxHandleOffset - minHandleOffset;

                                    //relative position from the begining of the slider
                                    element.css("left", (maxHandleOffset - minHandleOffset) + "px");
                                } else {
                                    handlePosition = event.clientX - minHandleOffset;
                                    element.css("left", handlePosition + "px");
                                }

                                var percentage = (handlePosition) / (maxHandleOffset - minHandleOffset);

                                if (settings.invert) {
                                    percentage = 1 - percentage;
                                }

                                var value = Math.round((settings.max - settings.min) * percentage + settings.min);

                                if (value != settings.value) {
                                    settings.value = value;
                                    valueBox.find(".value").val(value);
                                    slider.data("slider-settings", settings).trigger("slide", {
                                        value: settings.value
                                    });
                                    settings.slide.call(slider, event, {
                                        value: settings.value
                                    });
                                }
                                event.preventDefault();
                            }
                        }
                    });

                    handle.on({
                        mousedown: function() {
                            $(this).data("init-sliding", true);
                        },
                        dragstart: function(event) {
                            return false;
                        },
                        drop: function(event) {
                            return false;
                        }
                    });

                    $('<div class="slider-valuebox"><input type="text" class="value" value="' + settings.value + '"/><span class="suffix">' + settings.suffix + '</span></div>')
                            .appendTo(element).find("input").on({
                        input: function() {
                            var theInput = $(this);
                            var element = theInput.parents(".slider");
                            var settings = element.data("slider-settings");
                            try {
                                var value = parseInt(theInput.val(), 10);
                                if (value >= settings.min && value <= settings.max) {
                                    settings.value = value;
                                    methods.value.call(element, [settings.value]);
                                    element.data("slider-settings", settings).trigger("slide", {
                                        value: settings.value
                                    });
                                    settings.slide.call(element, event, {
                                        value: settings.value
                                    });
                                }
                            } catch (e) {
                            }
                        }
                    });
                    methods.value.call(element, [settings.value]);
                });
            },
            value: function(value) {
                if (value && value.length === 1) {
                    return this.each(function() {
                        var element = $(this);
                        var theHandle = element.find('a.slider-handle');
                        var valueBox = element.find(".slider-valuebox");
                        var percentage;
                        var settings = element.data("slider-settings");

                        if (value[0] > settings.max) {
                            value[0] = settings.max;
                        }
                        if (value[0] < settings.min) {
                            value[0] = settings.min;
                        }

                        percentage = value[0] / settings.max;
                        if (settings.invert) {
                            percentage = 1 - percentage;
                        }

                        var handlePosLeft = Math.round(percentage * (element.width() - theHandle.outerWidth()));

                        theHandle.css("left", handlePosLeft);
                        valueBox.find(".value").val(value[0]);

                        settings.value = value[0];
                        element.data("slider-settings", settings);
                    });
                } else {
                    return this.data("slider-settings").value;
                }
            }
        };

        if (methods[method]) {
            return methods[method].call(this, (Array.prototype.slice.call(arguments, 1)));
        } else if (typeof method === 'object' || !method) {
            return methods.init.call(this, arguments[0]);
        } else {
            $.error('Method ' + method + ' does not exist');
        }
    };
})(jQuery);
