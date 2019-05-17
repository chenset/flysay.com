<?php
$files = glob('images/*.*');
header('Location: //img.flysay.com/' . $files[array_rand($files)], true, 302);