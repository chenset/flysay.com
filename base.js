'use strict';

let imagePaths, imgStorage = [
    'https://coding-pages.flysay.com/',
    'https://pages.flysay.com/',
    'https://img.flysay.com/',
    '/',
], img = document.getElementById("img-el");

function start(e) {
    showLoading(e);
    ajax({
        url: 'https://gitee.com/api/v5/repos/chenset/flysay.com/contents/images',
        success: function (res) {
            imagePaths = JSON.parse(res.responseText);
            loadImg();
        },
        error: function () {
            ajax({
                url: 'https://api.github.com/repositories/186582306/contents/images',
                success: function (res) {
                    imagePaths = JSON.parse(res.responseText);
                    loadImg();
                }
            });
        }
    });
}

function ajax(option) {
    let url = option.url || '',
        method = option.method || 'GET',
        data = option.data,
        headers = option.headers || {},
        success = option.success,
        timeout = option.timeout || 10000,
        error = option.error;

    let xhr = new XMLHttpRequest();
    xhr.timeout = timeout;
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200 || this.status === 304) {
                success && success(this);
            } else {
                error && error(this);
            }
        }
    };
    xhr.open(method, url, true);
    for (let k in headers) {
        xhr.setRequestHeader(k, headers[k]);
    }
    if (data) {
        xhr.send(data);
    } else {
        xhr.send();
    }
}

function pickImagePath(prev) {
    if (typeof (window.pickImagePathIndex) === 'undefined') {
        window.pickImagePathIndex = imagePaths.length - 1;
    }
    if (!!prev) {
        window.pickImagePathIndex--;
        if (window.pickImagePathIndex < 0) {
            window.pickImagePathIndex = imagePaths.length - 1
        }
    } else {
        window.pickImagePathIndex++;
        if (window.pickImagePathIndex >= imagePaths.length) {
            window.pickImagePathIndex = 0;
        }
    }
    return imagePaths[window.pickImagePathIndex].path;
}

window.addEventListener('resize', function () {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(function () {
        imgPosition();
    }, 100);
});
document.getElementById('prev-img').addEventListener('click', function (e) {
    showLoading(e);
    loadImg(true)
});
img.addEventListener('click', showLoading, true);
img.addEventListener('click', function () {
    loadImg()
});
img.addEventListener('error', function () {
    if (imgStorage.length) {
        imgStorage.shift();
        loadImg();
    }
});
img.addEventListener('load', function () {
    document.getElementById('img-wrap').style.display = 'block';
    document.getElementById('exif-wrap').style.display = 'none';
    hideLoading();
    imgPosition();
    loadScriptOnce('exif.js', function () {
        img.exifdata = null;
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
});

function showLoading(e) {
    let loading = document.getElementById('loading');
    document.getElementById('layer').style.display = 'block';
    loading.style.display = 'block';
    let rect = document.documentElement.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top;
    loading.style.top = y - loading.offsetHeight / 2 + "px";
    loading.style.left = x - loading.offsetWidth / 2 + "px";
}

function hideLoading() {
    document.getElementById('layer').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
}

function loadImg(prev) {
    if (imgStorage.length) {
        img.src = imgStorage[0] + pickImagePath(prev);
        document.getElementById('prev-img').style.display = 'block';
    }
}

function imgPosition() {
    if (img.clientWidth > window.innerWidth) {
        img.style.left = (-(img.clientWidth - window.innerWidth) / 2) + "px";
    } else {
        img.style.left = "0";
    }
    img.style.top = (-(img.clientHeight - window.innerHeight) / 2) + "px";
}
