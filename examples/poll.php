<?php

$callback = $_GET['jsonp'];

$message = 'Hello, world!';

echo $callback . '(' . json_encode($message) . ');';