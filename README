Vixen JS JSONP Library <https://jdrich@github.com/jdrich/vixen_js.git>

## About

The Vixen JS JSONP Library is an open source (MIT licensed) library for use in
applications which require poll and signal type functionality within JavaScript
applications. The library is simple, short, and concise, and aims to stay that
way.

## Uses

Polling

// The URL we want to poll
var polled_location = 'poll_location.php';

// The JSONP callback
var poll_callback = function (data) {
    console.log(data);
}

// How often to poll the resource
var interval = 500;

Vixen.init(polled_location, poll_callback, interval);

Clearing

Vixen.destroy(polled_location);

Signalling

// The URL we want to signal
var signalled_location = 'signal_location.php';

// The message we want to send
var message = JSON.stringify('example');

Vixen.signal(signalled_location, message);
    
## Purpose

Vixen is a small library that duplicates JSONP functionality in a minimal way.
Its purpose is to facilitate the implementation of JSONP APIs. The purpose of
Vixen is not to replace Ajax calls, and it should not be abused for that purpose.
        
## Author

Jonathan Rich <jdrich@gmail.com>
        
## Feedback

Submit bugs to https://github.com/jdrich/vixen_js/issues.

## License

Please see the file called LICENSE.
