<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>Fly Say</title>
    <meta charset="UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
    <link rel="canonical" href="https://flysay.com"/>
    <link rel="icon" href="//flysay.com/favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="//flysay.com/favicon.ico" type="image/x-icon">
    <link rel="bookmark" href="//flysay.com/favicon.ico" type="image/x-icon">
    <style>
        * {
            padding: 0;
            margin: 0;
            -webkit-box-sizing: border-box;
        }

        body {
            font-family: Helvetica, Arial, sans-serif, "Microsoft YaHei", 'Helvetica Neue';
            color: #333;
            font-size: 14px;
        }

        *:focus {
            outline: none;
        }

        ::selection {
            background: #efefef;
        }

        a {
            color: #000;
            text-decoration: none;
        }

        h1, h2, h3, h4, h5, h6 {
            font-weight: 400;
            margin: 15px 0;
        }

        input {
            -webkit-appearance: none;
            border-radius: 0;
        }

        a:hover, a:focus {
            color: #444;
        }

        li {
            list-style: none;
        }

        .main-wrap {
            width: 100%;
            padding: 0 30px;
            position: absolute;
            top: 50%;
            margin-top: -90px;
            text-align: center;
            z-index: 2;
        }

        .main-header {
            display: inline-block;
            text-align: left;
            margin-left: auto;
            margin-right: auto;
            background: #FFF;
            padding: 5px 20px 10px;
            opacity: 0.9;
        }

        .site-menu {
            border-top: 1px solid #f1f1f1;
        }

        .site-menu li {
            float: left;
            line-height: 14px;
            font-size: 14px;
            padding: 10px 40px 10px 0;
        }

        @keyframes fadein {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    </style>
</head>
<body>
<div class="main-wrap">
    <header class="main-header">
        <div class="container">
            <h2 class="main-logo-wrap">
                <a id="main-logo" href="/">
                    <span style="color:#ff5252">F</span><span style="color:#cc9966">l</span><span
                            style="color:#41B883">y</span> <span style="color:#01AAED">S</span><span
                            style="color:#cc9966">a</span><span style="color:#41B883">y</span>
                </a>
            </h2>
            <nav class="site-menu">
                <ul>
                    <li><a href="https://blog.flysay.com/">BLOG</a></li>
                    <li><a href="https://str.flysay.com/">字幕文件重命名</a></li>
                    <li><a href="https://har2jmx.flysay.com/">HAR2JMX</a></li>
                    <li><a href="https://sensor.flysay.com/">SENSOR</a></li>
                    <li><a href="https://asuka.flysay.com/">ASUKA</a></li>
                    <li><a href="https://github.com/chenset">GITHUB</a></li>
                </ul>
            </nav>
        </div>
    </header>
</div>

<script src="exif.js"></script>

<div style="height:100%;width:100%;position: absolute;z-index: 1;overflow: hidden;display:none;animation: fadein 2s;"
     id="img-wrap">
    <img id="img-el"
        <?php if ($files = glob('images/*.*')) { ?>
            data-image="<?php echo $files[array_rand($files)]; ?>"
        <?php } ?>
         style="height: auto;max-width: 100%;min-width:1400px;display: block;margin:  0 auto;position: relative;"/>
</div>
<footer id="exif-wrap"
        style="position: fixed;bottom: 0;left:0;z-index: 2;background: #FFF; opacity: 0.8;padding:2px 6px;font-size: 10px;display: none">
    <span id="exif-date"></span>
    <a style="margin-left: 6px" target="_blank" id="exif-google-map">Map</a>
</footer>
<script>
    let imgStorage = [
            'https://h.flysay.com/',
            'https://pages.flysay.com/',
            'https://img.flysay.com/',
            '/',
        ],
        img = document.getElementById("img-el");

    function imgPosition() {
        if (img.clientWidth > window.innerWidth) {
            img.style.left = (-(img.clientWidth - window.innerWidth) / 2) + "px";
        } else {
            img.style.left = "0";
        }
        img.style.top = (-(img.clientHeight - window.innerHeight) / 2) + "px";
    }

    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        setTimeout(function () {
            imgPosition();
        }, 100);
    });

    function loadImg() {
        img.src = imgStorage.shift() + img.getAttribute('data-image');
    }

    setTimeout(function () {
        loadImg();
        img.addEventListener('error', function (event) {
            if (imgStorage.length) {
                loadImg();
            }
        });
        img.addEventListener('load', function () {
            document.getElementById('img-wrap').style.display = 'block';
            imgPosition();
            EXIF.getData(img, function () {
                let info = EXIF.getAllTags(this);
                if (info.hasOwnProperty('GPSLatitude') && info.GPSLatitude.length) {
                    document.getElementById('exif-wrap').style.display = 'block';
                    let latitude = (info.GPSLatitude[0] + info.GPSLatitude[1] / 60 + info.GPSLatitude[2] / 3600).toFixed(7),
                        longitude = (info.GPSLongitude[0] + info.GPSLongitude[1] / 60 + info.GPSLongitude[2] / 3600).toFixed(7);
                    document.getElementById('exif-date').innerText = info.DateTime;
                    document.getElementById('exif-google-map').href = "https://maps.google.com/?q=" + latitude + "," + longitude + "&ll=" + latitude + "," + longitude + "&z=18";
                }
            });
        });
    }, 200);
</script>
</body>
</html>
