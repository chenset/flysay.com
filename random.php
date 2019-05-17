<?php
if ($files = glob('images/*.*')) {
    header('Location: ' . (stristr($_SERVER['HTTP_REFERER'], 'flysay.com') ? '//img.flysay.com/' : '') . $files[array_rand($files)], true, 302);
}
