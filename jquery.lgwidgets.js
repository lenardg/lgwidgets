/**
 * Created by LenardG on 28.08.2015.
 */
;(function($,window,document) {
    /* PROGRESS BAR */
    $.fn.progressbar = function(options) {
        var opts = $.extend({}, $.fn.progressbar.defaults);
        if ( typeof options === "object" ) {
            opts = $.extend(opts,options);
        }

        if(!this.hasClass("jquery-progress-bar")) {
            this.addClass("jquery-progress-bar");
            this.addClass("progress-bar");

            var innerContent = "";
            if ( !!opts.ticks ) {
                for(var i = 0; i < opts.tickStops.length; ++i ) {
                    innerContent += "<div class='progress-bar-tick' style='width: " + opts.tickStops[i].toString() + "%;'></div>";
                }
            }
            innerContent += "<div class='progress-bar-inner' style='width: " + opts.startingValue.toString() + "%;'></div>";

            this.append($(innerContent));
        }

        if ( typeof(options) === "number" ) {
            var valu = options;
            this.find(".progress-bar-inner").animate({ width: valu.toString() + "%"}, 650, "easeOutCubic");
        }

        return this;
    };

    $.fn.progressbar.defaults = {
        ticks: true,
        tickStops: [0,33,66,99],
        startingValue: 0
    };

    /* TRACKBAR */
    var tracking = {
        mouseTrack: false,
        startX: -1,
        tracked: null,
    };

    function Trackbar(element,options) {
        this.settings = $.extend({}, $.trackbar.defaults, options);
        this.element = element;

        this.currentValue = this.settings.startingValue;

        this.init();
    }

    $.extend(Trackbar.prototype, {
        init: function() {
            var $element = $(this.element);
           if(!$element.hasClass("jquery-trackbar")) {
               $element.addClass("jquery-trackbar");
               $element.addClass("trackbar");
               $element.append($("<div class='trackbar-track'></div>" +
                   "<div class='trackbar-knob'>|||</div>"));

               this.setTo(this.settings.startingValue);

               var that = this;

               $element.find(".trackbar-knob").mousedown(function(e) {
                  return that.onMouseDown(e);
               });
           }
        },
        onMouseDown: function(e) {
           tracking.mouseTrack = true;
           tracking.startX = e.pageX;
           tracking.tracked = this;
        },
        onChange: function() {
            if( !!this.settings.onChange ) {
                this.settings.onChange.apply(this,[this.currentValue]);
            }
        },
        setTo: function(val) {
            this.currentValue = val;
            $(this.element).find(".trackbar-track").css({width: val.toString() + "%"});
            $(this.element).find(".trackbar-knob").css({left: (val-3).toString() + "%"});
        }
    });

    $.fn.trackbar = function(options) {
        this.each(function() {
            if(!$.data(this, "lgwidgets-trackbar")) {
                $.data(this, "lgwidgets-trackbar", new Trackbar(this,options));
            }
        });
    }

    function onMouseUp(e) {
        if ( !!tracking.mouseTrack ) {
            tracking.mouseTrack = false;
            tracking.tracked.onChange();
            tracking.tracked = null;
            e.preventDefault();
            return false;
        }
    }

    function onMouseMove(e) {
        if ( !!tracking.mouseTrack ) {

            var opts = tracking.tracked.settings;
            var width = $(tracking.tracked.element).width();
            var pos = $(tracking.tracked.element).offset();

            var stepPos = [];
            for(var i = 0; i < opts.steps.length; ++i ) {
                stepPos.push(pos.left + width * (opts.steps[i]/100.0));
            }

            var closest = -1;
            var closestValue = 100000000;
            for(var i = 0; i < stepPos.length; ++i ) {
                var distance = Math.abs(e.pageX - stepPos[i]);
                if(distance < closestValue) {
                    closestValue = distance;
                    closest = i;
                }
            }

            if ( closest >= 0 ) {
                tracking.tracked.setTo(opts.steps[closest])
            }

            e.preventDefault();
            return false;
        }
    }

    $(window).mouseup(onMouseUp);
    $(window).mousemove(onMouseMove);

    $.trackbar = Trackbar;
    $.trackbar.defaults = {
        steps: [25,50,75,100],
        startingValue: 25,
        onChange: undefined
    };

})(jQuery,window,document);
