/**
 * Vixen JavaScript Libary v0.9
 *
 * This libary relies on some assumed functionality about the jsonp endpoint:
 *
 * - The endpoint accepts a parameter specified by param (or 'jsonp') with the
 *   callback information for the poll.
 *
 * - The endpoint will return JavaScript that calls the defined callback.
 *
 * For signallers:
 *
 * - The endpoint does not produce meaningful output. To be unixy, signal
 *   transmissions are one-way.
 *
 * Unfortunately, because of scoping issues it is impossible for the endpoint to
 * be static - doing so would inevitably cause collisions on the JavaScript side
 * with variable names.
 *
 * Usage:
 *
 *   Polling
 *
 *   Vixen.init('some_page.php', function () {}, 500, 'callback')
 *
 *   Signalling
 *
 *   Vixen.signal('some_page.php', JSON.stringify(data), 'url_param');
 *
 * Copyright 2011, Jonathan Rich
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
var Vixen = (function() {

    /**
     * This gets prefixed to any <script> tags we create to (attempt to) ensure
     * unique DOM IDs.
     */
    var script_id_prefix = 'vixen';

    /**
     * An associative array of callback functions specified by registered
     * pollers, indexed by event ID.
     */
    var callbacks = {};

    /**
     * An associative array of pollers, indexed by location ID.
     */
    var handlers = {};

    /**
     * An associative array of signalers, indexed by location ID.
     */
    var signals = {};

    /**
     * Initializes a poller for the file handler at location with a handler of
     * callback.
     *
     * Timeout defaults to 2 seconds.
     * Param defaults to 'jsonp'
     */
    var init = function( location, callback, timeout, param ) {

        // Set defaults.
        param = param ? param : 'jsonp';
        timeout = timeout ? timeout : 2000;

        // Initialize our handler.
        var id = getScriptTagID( handlers );
        var handler = handlers[location] = {};

        callbacks[id] = callback;

        // Save our handler.
        handler.id = id;
        handler.callback = callback;
        handler.timeout = timeout;
        handler.param = param;
        handler.interval = setInterval( function() { poll(location) }, timeout );

        // Make the first request now.
        poll(location);
    };

    /**
     * Destroys the poller, if it exists, for the file handler at location.
     */
    var destroy = function ( location ) {
        if( handlers[location] ) {
            var handler = handlers[location];
            clearInterval(handler.interval);
            delete handlers[location];
            delete callbacks[handler.id];
        }
    };

    /**
     * Generates a unique ID for the script tag for either a poller or a signaler.
     *
     * @todo Make this more generalized.
     */
    var getScriptTagID = function ( collisions )  {
        var id = script_id_prefix + '_';

        id += Math.random().toString().match(/[^\.]+$/);

        for (index in collisions) {
            if (collisions[index].id == id) {
                id = getScriptTagID( collisions );

                break;
            }
        }

        return id;
    };

    /**
     * Polls the specified location based on the predefined poll handler.
     */
    var poll = function ( location ) {
        var handler = handlers[location];

        var head = document.getElementsByTagName('head')[0];
        var old_script = document.getElementById(handler.id);

        // Remove the old script tag from the DOM to keep the DOM insertions small.
        if (old_script) {
            head.removeChild(old_script);
        }

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = handler.id;
        script.src = location + '?' + handler.param + '=' + 'Vixen.callbacks.' + handler.id;
        head.appendChild(script);
    };

    var signal = function ( location, data, param ) {
        if ( typeof signals[location] == 'undefined' ) {
            signals[location] = getScriptTagID(signals);
        }

        var id = signals[location];
        var head = document.getElementsByTagName('head')[0];

        var old_script = document.getElementById(id);

        if (old_script) {
            head.removeChild(old_script);
        }

        param = param ? param : 'jsonp';

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.id = id;
        script.src = location + '?' + param + '=' + data;
        head.appendChild(script);
    }

    var _public = {};

    _public.init = init;
    _public.destroy = destroy;
    _public.callbacks = callbacks;
    _public.signal = signal;

    return _public;
}());
