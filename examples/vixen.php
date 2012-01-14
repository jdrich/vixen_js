<?php

$callback = $_GET['jsonp'];

echo $callback . '(' . json_encode(file_get_contents('comet.txt')) . ')';