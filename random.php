<?php
$files = glob('images/*.*');
header('Location: ' . $files[array_rand($files)], true, 302);