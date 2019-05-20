let imagePaths, imgStorage = [
    'https://h.flysay.com/',
    'https://pages.flysay.com/',
    'https://img.flysay.com/',
    '/',
], img = document.getElementById("img-el");

function start(e) {
    showLoading(e);
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            try {
                imagePaths = JSON.parse(this.responseText);
                loadImg();
            } catch (err) {
            }
        }
    };
    xhr.open("GET", "https://api.github.com/repositories/186582306/contents/images", true);
    xhr.setRequestHeader("Authorization", "token" + " 12a1f8bf43883b5db6ca562" + "2c046f516" + "0d5dc7e6"); // + for hack
    xhr.send();
}

function randomImagePath() {
    return imagePaths[Math.floor(Math.random() * imagePaths.length)].path;
}

window.addEventListener('resize', function () {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(function () {
        imgPosition();
    }, 100);
});

img.addEventListener('click', showLoading, true);
img.addEventListener('click', loadImg);
img.addEventListener('error', function () {
    if (imgStorage.length) {
        imgStorage.shift();
        loadImg();
    }
});
img.addEventListener('load', function () {
    hidenLoading();
    document.getElementById('img-wrap').style.display = 'block';
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

function hidenLoading() {
    document.getElementById('layer').style.display = 'none';
    document.getElementById('loading').style.display = 'none';
}

function loadImg() {
    if (imgStorage.length) {
        img.src = imgStorage[0] + randomImagePath();
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
