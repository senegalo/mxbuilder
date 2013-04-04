(function($) {
    mxBuilder.recorder = {
        _lastState: null,
        _forceSave: false,
        _saving: false,
        _queue: [],
        _saveInterval: null,
        saveIfRequired: function() {
            var savedObj = mxBuilder.pages.saveAll();
            var currentState = JSON.stringify(savedObj);
            if (this._forceSave || (this._lastState !== null && this._lastState !== currentState)) {
                this.save(currentState);
            }
            this._forceSave = false;
            this._lastState = currentState;
        },
        save: function save(str) {
            if (!this._saving) {
                this._saving = true;
                this.tooltip.text("Saving...").show();
                var that = this;
                mxBuilder.api.website.save({
                    websiteData: str,
                    success: function(data) {
                        if (data.success) {
                            mxBuilder.recorder.tooltip.text("Saved Successfully...");
                            setTimeout(function() {
                                mxBuilder.recorder.tooltip.hide();
                            }, 2000);
                        } else {
                            mxBuilder.recorder.tooltip.text("Error: Please refresh the page...");
                            mxBuilder.recorder.clearInterval();
                        }
                    },
                    complete: function() {
                        that._saving = false;
                        if (that._queue.length > 0) {
                            that.save(that._queue.splice(0, 1)[0]);
                        }
                    },
                    error: function() {
                        mxBuilder.recorder.tooltip.text("Error: Please refresh the page...");
                        mxBuilder.recorder.clearInterval();
                    }
                });
            } else {
                this._queue.push(str);
            }
        },
        setLastState: function setLastState(lastState) {
            this._lastState = JSON.stringify(lastState);
        },
        forceSave: function forceSave() {
            this._forceSave = true;
        },
        initSaveInterval: function(time) {
            this._saveInterval = setInterval(function() {
                mxBuilder.recorder.saveIfRequired();
            }, time);
        },
        clearInterval: function() {
            clearInterval(this._saveInterval);
        }
    };

    $(function() {
        mxBuilder.recorder.tooltip = mxBuilder.layout.templates.find(".save-tooltip").remove().appendTo(mxBuilder.layout.selectionSafe);
    });
}(jQuery));