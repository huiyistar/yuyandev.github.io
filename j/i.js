/*jshint esversion: 6 */
/**
 * 路由功能
 */

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) 
                descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function (Constructor, protoProps, staticProps) {
        if (protoProps) 
            defineProperties(Constructor.prototype, protoProps);
        if (staticProps) 
            defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Router = function () {
    function Router() {
        _classCallCheck(this, Router);

        this.routes = {};
        this.currentUrl = '';
    }

    _createClass(Router, [
        {
            key: 'route',
            value: function route(path, callback) {
                this.routes[path] = callback || function () {};
            }
        }, {
            key: 'updateView',
            value: function updateView() {
                this.currentUrl = location
                    .hash
                    .slice(1) || '/';
                this.routes[
                    this
                        .currentUrl
                        .split("?")[0]
                ] && this.routes[
                    this
                        .currentUrl
                        .split("?")[0]
                ]();
            }
        }, {
            key: 'init',
            value: function init() {
                window.addEventListener('load', this.updateView.bind(this), false);
                window.addEventListener('hashchange', this.updateView.bind(this), false);
            }
        }
    ]);

    return Router;
}();

/**
 * Query查询功能函数
 * @param {*} variable
 */
function getQueryVariable(variable) {
    var query = window
        .location
        .search
        .substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

function hashGetQueryVariable(variable) {
    if (window.location.hash.indexOf("?") != -1) {
        var query = window
            .location
            .hash
            .substring(window.location.hash.indexOf("?") + 1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        // return (false);
        return 'langundefined';
    } else {
        // return (false);
        return 'langundefined';
    }

}

/**
 * spm打点系统
 *
 * 三位组成，第一位是历史页面编号，第二位是本级页面编号，第三位是用户信息(cookie系统未完成时默认0)
 * 示例首页为/?spm=0.1.0
 */

function initHashSpmId() {
    location.hash = location.hash + '?spm=0.1.0';
}
function hashGetSpmId(number) {
    var query = window
        .location
        .hash
        .substring(window.location.hash.indexOf("?") + 1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == 'spm') {
            var spmList = pair[1].split(".");
            return spmList[number];
        }
    }
    return false;
}

function getSpmId() {
    var query = window.location.search;

}

/**
 * 主路由
 */
var router = new Router();
router.init();
router.route('/', function () {
    if (location.hash.length == 0) {
        location.hash = "/";
    }

    // initHashSpmId()
    var langs = hashGetQueryVariable('lang');
    var hashSpmId1 = hashGetSpmId(0);
    var hashSpmId2 = hashGetSpmId(1);
    var hashSpmId3 = hashGetSpmId(2);
    if (langs == 'langundefined') {
        fetch('i18n/en-US.json')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var navHtml = `
                <ul>
                    <li>
                        <a href="#/?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/index.svg">${data.Home}</a>
                    </li>
                    <li>
                        <a href="#/photo?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/photo.svg">${data.Photo}</a>
                    </li>
                    <li>
                        <a href="#/device?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/box.svg">${data.Device}</a>
                    </li>
                    <li>
                        <a href="#/links?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/links.svg">${data.Links}</a>
                    </li>
                    <li>
                        <a href="https://www.yuyanlab.com"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/blog.svg">${data.Blog}</a>
                    </li>
                    <li>
                        <a href="#/radio?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/radio.svg">${data.HamRadio}</a>
                    </li>
                    <li>
                        <div class="dropdown">
                        <a>
                        <img class="dropbtn" style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/lang.svg">${data.Language}</a>
                            <div class="dropdown-content">
                                <a href="#/?lang=zh-CN">简体中文</a>
                                <a href="#/?lang=en-US">English</a>
                                <a href="#/?lang=ja-JP">日本語</a>
                            </div>
                        </div>
                    </li>
                </ul>
    `;
                document
                    .getElementById('h')
                    .innerHTML = navHtml;

                var homeHtml = `
                    <ul class="item c">
                        <br/>
                        <li>
                            <div class="device-item"><img style="width: 13em; height: 13em; border-radius: 99em;fill: rgb(0, 0, 0); " src="i/favicon.jpg"><p class="item-about">毓彦</p></div>                    
                        </li>
                        <br/>
                        <li class="hr"></li>
                        <li class="hr"></li>
                        <li>
                            <p class="item-mini">${data.Introduction}</p>
                            <p class="item-mini">(<ゝω·)☆~Kira</p>
                        </li>
                        <li class="hr"></li>
                        <li>
                            <p style="color: #C0C0C0;"class="item-link">${data.Copyrightinfo}卜卜口</p>
                        </li>
                    </ul>
                    `;

                document
                    .getElementById('M')
                    .innerHTML = homeHtml;
            });
    } else {
        fetch(`i18n/${langs}.json`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var navHtml = `
                <ul>
                    <li>
                        <a href="#/?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/index.svg">${data.Home}</a>
                    </li>
                    <li>
                        <a href="#/photo?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/photo.svg">${data.Photo}</a>
                    </li>
                    <li>
                        <a href="#/device?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/box.svg">${data.Device}</a>
                    </li>
                    <li>
                        <a href="#/links?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/links.svg">${data.Links}</a>
                    </li>
                    <li>
                        <a href="https://www.yuyanlab.com"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/blog.svg">${data.Blog}</a>
                    </li>
                    <li>
                        <a href="#/radio?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/radio.svg">${data.HamRadio}</a>
                    </li>
                    <li>
                        <div class="dropdown">
                        <a>
                        <img class="dropbtn" style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/lang.svg">${data.Language}</a>
                            <div class="dropdown-content">
                                <a href="#/?lang=zh-CN">简体中文</a>
                                <a href="#/?lang=en-US">English</a>
                                <a href="#/?lang=ja-JP">日本語</a>
                            </div>
                        </div>
                    </li>
                </ul>
    `;
                document
                    .getElementById('h')
                    .innerHTML = navHtml;

                var homeHtml = `
                    <ul class="item c">
                        <br/>
                        <li>
                            <div class="device-item"><img style="width: 13em; height: 13em; border-radius: 99em;fill: rgb(0, 0, 0); " src="i/favicon.jpg"><p class="item-about">毓彦</p></div>                    
                        </li>
                        <br/>
                        <li class="hr"></li>
                        <li class="hr"></li>
                        <li>
                            <p class="item-mini">${data.Introduction}</p>
                            <p class="item-mini">(<ゝω·)☆~Kira</p>
                        </li>
                        <li class="hr"></li>
                        <li>
                            <p style="color: #C0C0C0;"class="item-link">${data.Copyrightinfo}卜卜口</p>
                        </li>
                    </ul>
                    `;

                document
                    .getElementById('M')
                    .innerHTML = homeHtml;

            });
    }
});

router.route('/photo', function () {
    var langs = hashGetQueryVariable('lang');
    var hashSpmId1 = hashGetSpmId(0);
    var hashSpmId2 = hashGetSpmId(1);
    var hashSpmId3 = hashGetSpmId(2);
    if (langs == 'langundefined') {
        fetch('i18n/en-US.json')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var navHtml = `
                <ul>
                    <li>
                        <a href="#/?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/index.svg">${data.Home}</a>
                    </li>
                    <li>
                        <a href="#/photo?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/photo.svg">${data.Photo}</a>
                    </li>
                    <li>
                        <a href="#/device?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/box.svg">${data.Device}</a>
                    </li>
                    <li>
                        <a href="#/links?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/links.svg">${data.Links}</a>
                    </li>
                    <li>
                        <a href="https://www.yuyanlab.com"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/blog.svg">${data.Blog}</a>
                    </li>
                    <li>
                        <a href="#/radio?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/radio.svg">${data.HamRadio}</a>
                    </li>
                    <li>
                        <div class="dropdown">
                        <a>
                        <img class="dropbtn" style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/lang.svg">${data.Language}</a>
                            <div class="dropdown-content">
                                <a href="#/photo?lang=zh-CN">简体中文</a>
                                <a href="#/photo?lang=en-US">English</a>
                                <a href="#/photo?lang=ja-JP">日本語</a>
                            </div>
                        </div>
                    </li>
                </ul>
    `;
                document
                    .getElementById('h')
                    .innerHTML = navHtml;

                var photoHtml = `
                <ul class="item c">
                    <li>${data.photoinfo}</li>
                </ul>
                `;
                document
                    .getElementById('M')
                    .innerHTML = photoHtml;
                
            });
            setTimeout('window.location.href="https://instagram.com/yuyandev"',5000);
    } else {
        fetch(`i18n/${langs}.json`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var navHtml = `
                <ul>
                    <li>
                        <a href="#/?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/index.svg">${data.Home}</a>
                    </li>
                    <li>
                        <a href="#/photo?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/photo.svg">${data.Photo}</a>
                    </li>
                    <li>
                        <a href="#/device?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/box.svg">${data.Device}</a>
                    </li>
                    <li>
                        <a href="#/links?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/links.svg">${data.Links}</a>
                    </li>
                    <li>
                        <a href="https://www.yuyanlab.com"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/blog.svg">${data.Blog}</a>
                    </li>
                    <li>
                        <a href="#/radio?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/radio.svg">${data.HamRadio}</a>
                    </li>
                    <li>
                        <div class="dropdown">
                        <a>
                        <img class="dropbtn" style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/lang.svg">${data.Language}</a>
                            <div class="dropdown-content">
                                <a href="#/photo?lang=zh-CN">简体中文</a>
                                <a href="#/photo?lang=en-US">English</a>
                                <a href="#/photo?lang=ja-JP">日本語</a>
                            </div>
                        </div>
                    </li>
                </ul>
    `;
                document
                    .getElementById('h')
                    .innerHTML = navHtml;

                var photoHtml = `
                    <ul class="item c">
                        <li>${data.photoinfo}</li>
                    </ul>
                    `;
                document
                    .getElementById('M')
                    .innerHTML = photoHtml;
            });
    setTimeout('window.location.href="https://instagram.com/yuyandev"',5000);
    }
});

router.route('/device', function () {
    var langs = hashGetQueryVariable('lang');
    var hashSpmId1 = hashGetSpmId(0);
    var hashSpmId2 = hashGetSpmId(1);
    var hashSpmId3 = hashGetSpmId(2);
    if (langs == 'langundefined') {
        fetch('i18n/en-US.json')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var navHtml = `
                <ul>
                    <li>
                        <a href="#/?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/index.svg">${data.Home}</a>
                    </li>
                    <li>
                        <a href="#/photo?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/photo.svg">${data.Photo}</a>
                    </li>
                    <li>
                        <a href="#/device?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/box.svg">${data.Device}</a>
                    </li>
                    <li>
                        <a href="#/links?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/links.svg">${data.Links}</a>
                    </li>
                    <li>
                        <a href="https://www.yuyanlab.com"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/blog.svg">${data.Blog}</a>
                    </li>
                    <li>
                        <a href="#/radio?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/radio.svg">${data.HamRadio}</a>
                    </li>
                    <li>
                        <div class="dropdown">
                        <a>
                        <img class="dropbtn" style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/lang.svg">${data.Language}</a>
                            <div class="dropdown-content">
                                <a href="#/device?lang=zh-CN">简体中文</a>
                                <a href="#/device?lang=en-US">English</a>
                                <a href="#/device?lang=ja-JP">日本語</a>
                            </div>
                        </div>
                    </li>
                </ul>
                `;

                var deviceHtml = `
                    <ul class="item c">
                        <li>
                            <img style="width: 128px; height: 128px; fill: rgb(0, 0, 0);" src="i/box.svg"><p class="item-span">${data.Device}</p>
                        </li>
                        <li class="hr"><h2>${data.SCM}</h2></li>
                        <li>
                            <div class="device-item"><img style="width: 96px; height: 96px; fill: rgb(0, 0, 0);" src="i/PCB.svg"><p class="item-mini">Raspberry Pi 1B</p></div>
                        </li>
                        <li>
                            <div class="device-item"><img style="width: 96px; height: 96px; fill: rgb(0, 0, 0);" src="i/PCB.svg"><p class="item-mini">Raspberry Pi 2B</p></div>
                        </li>
                        <li>
                            <div class="device-item"><img style="width: 96px; height: 96px; fill: rgb(0, 0, 0);" src="i/PCB.svg"><p class="item-mini">Arduino UNO</p></div>
                        </li>
                        <li class="hr"><h2>${data.cloth}</h2></li>
                        <li>
                            <div class="device-item"><img style="width: 96px; height: 96px; fill: rgb(0, 0, 0);" src="i/iphone.svg"><p class="item-mini">iPhone SE</p></div>
                        </li>
                        <li>
                            <div class="device-item"><img style="width: 96px; height: 96px; fill: rgb(0, 0, 0);" src="i/erji.svg"><p class="item-mini">Beats</p></div>
                        </li>
                        <li>
                            <div class="device-item"><img style="width: 96px; height: 96px; fill: rgb(0, 0, 0);" src="i/wallet.svg"><p class="item-mini">${data.wallet}</p></div>
                        </li>
                        <li>
                            <div class="device-item"><img style="width: 96px; height: 96px; fill: rgb(0, 0, 0);" src="i/key.svg"><p class="item-mini">${data.key}</p></div>
                        </li>
                        <li class="hr"><h2>${data.productiveforces}</h2></li>
                        <li>
                            <div class="device-item"><img style="width: 96px; height: 96px; fill: rgb(0, 0, 0);" src="i/macbook.svg"><p class="item-mini">MacBook Pro</p></div>
                        </li>
                        <li>
                            <div class="device-item"><img style="width: 96px; height: 96px; fill: rgb(0, 0, 0);" src="i/monitor.svg"><p class="item-mini">Dell Monitor</p></div>
                        </li>
                        <li class="hr"><h2>${data.HamRadio}</h2></li>
                        <li>
                            <div class="device-item"><img style="width: 96px; height: 96px; fill: rgb(0, 0, 0);" src="i/hamradio.svg"><p class="item-mini">BF UV-5R</p></div>
                        </li>
                    </ul>
                    <div class="footer"></div>
                `;

                document
                    .getElementById('h')
                    .innerHTML = navHtml;
                document
                    .getElementById('M')
                    .innerHTML = deviceHtml;
            });
    } else {
        fetch(`i18n/${langs}.json`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var navHtml = `
                <ul>
                    <li>
                        <a href="#/?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/index.svg">${data.Home}</a>
                    </li>
                    <li>
                        <a href="#/photo?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/photo.svg">${data.Photo}</a>
                    </li>
                    <li>
                        <a href="#/device?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/box.svg">${data.Device}</a>
                    </li>
                    <li>
                        <a href="#/links?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/links.svg">${data.Links}</a>
                    </li>
                    <li>
                        <a href="https://www.yuyanlab.com"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/blog.svg">${data.Blog}</a>
                    </li>
                    <li>
                        <a href="#/radio?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/radio.svg">${data.HamRadio}</a>
                    </li>
                    <li>
                        <div class="dropdown">
                        <a>
                        <img class="dropbtn" style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/lang.svg">${data.Language}</a>
                            <div class="dropdown-content">
                                <a href="#/device?lang=zh-CN">简体中文</a>
                                <a href="#/device?lang=en-US">English</a>
                                <a href="#/device?lang=ja-JP">日本語</a>
                            </div>
                        </div>
                    </li>
                </ul>
    `;
                document
                    .getElementById('h')
                    .innerHTML = navHtml;
                var deviceHtml = `
                    <ul class="item c">
                        <li>
                            <img style="width: 128px; height: 128px; fill: rgb(0, 0, 0);" src="i/box.svg"><p class="item-span">${data.Device}</p>
                        </li>
                        <li class="hr"><h2>${data.SCM}</h2></li>
                        <li>
                            <div class="device-item"><img style="width: 96px; height: 96px; fill: rgb(0, 0, 0);" src="i/PCB.svg"><p class="item-mini">Raspberry Pi 1B</p></div>
                        </li>
                        <li>
                            <div class="device-item"><img style="width: 96px; height: 96px; fill: rgb(0, 0, 0);" src="i/PCB.svg"><p class="item-mini">Raspberry Pi 2B</p></div>
                        </li>
                        <li>
                            <div class="device-item"><img style="width: 96px; height: 96px; fill: rgb(0, 0, 0);" src="i/PCB.svg"><p class="item-mini">Arduino UNO</p></div>
                        </li>
                        <li class="hr"><h2>${data.cloth}</h2></li>
                        <li>
                            <div class="device-item"><img style="width: 96px; height: 96px; fill: rgb(0, 0, 0);" src="i/iphone.svg"><p class="item-mini">iPhone SE</p></div>
                        </li>
                        <li>
                            <div class="device-item"><img style="width: 96px; height: 96px; fill: rgb(0, 0, 0);" src="i/erji.svg"><p class="item-mini">Beats</p></div>
                        </li>
                        <li>
                            <div class="device-item"><img style="width: 96px; height: 96px; fill: rgb(0, 0, 0);" src="i/wallet.svg"><p class="item-mini">${data.wallet}</p></div>
                        </li>
                        <li>
                            <div class="device-item"><img style="width: 96px; height: 96px; fill: rgb(0, 0, 0);" src="i/key.svg"><p class="item-mini">${data.key}</p></div>
                        </li>
                        <li class="hr"><h2>${data.productiveforces}</h2></li>
                        <li>
                            <div class="device-item"><img style="width: 96px; height: 96px; fill: rgb(0, 0, 0);" src="i/macbook.svg"><p class="item-mini">MacBook Pro</p></div>
                        </li>
                        <li>
                            <div class="device-item"><img style="width: 96px; height: 96px; fill: rgb(0, 0, 0);" src="i/monitor.svg"><p class="item-mini">Dell Monitor</p></div>
                        </li>
                        <li class="hr"><h2>${data.HamRadio}</h2></li>
                        <li>
                            <div class="device-item"><img style="width: 96px; height: 96px; fill: rgb(0, 0, 0);" src="i/hamradio.svg"><p class="item-mini">BF UV-5R</p></div>
                        </li>
                    </ul>
                    <div class="footer"></div>
                `;
                document
                    .getElementById('M')
                    .innerHTML = deviceHtml;

            });
    }
});

router.route('/radio', function () {
    var langs = hashGetQueryVariable('lang');
    var hashSpmId1 = hashGetSpmId(0);
    var hashSpmId2 = hashGetSpmId(1);
    var hashSpmId3 = hashGetSpmId(2);
    if (langs == 'langundefined') {
        fetch('i18n/en-US.json')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var navHtml = `
                <ul>
                    <li>
                        <a href="#/?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/index.svg">${data.Home}</a>
                    </li>
                    <li>
                        <a href="#/photo?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/photo.svg">${data.Photo}</a>
                    </li>
                    <li>
                        <a href="#/device?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/box.svg">${data.Device}</a>
                    </li>
                    <li>
                        <a href="#/links?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/links.svg">${data.Links}</a>
                    </li>
                    <li>
                        <a href="https://www.yuyanlab.com"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/blog.svg">${data.Blog}</a>
                    </li>
                    <li>
                        <a href="#/radio?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/radio.svg">${data.HamRadio}</a>
                    </li>
                    <li>
                        <div class="dropdown">
                        <a>
                        <img class="dropbtn" style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/lang.svg">${data.Language}</a>
                            <div class="dropdown-content">
                                <a href="#/radio?lang=zh-CN">简体中文</a>
                                <a href="#/radio?lang=en-US">English</a>
                                <a href="#/radio?lang=ja-JP">日本語</a>
                            </div>
                        </div>
                    </li>
                </ul>
                `;
                document
                    .getElementById('h')
                    .innerHTML = navHtml;

                var radioHtml = `
                <ul class="item c">
                    <li>${data.callsign}:</li>
                </ul>
                <br/>
                <ul class="item c">
                    <li>BG6TTI (CN)</li>
                </ul>
                <ul class="item c">
                    <li>K6TTI (US-HV)</li>
                </ul>
                <br/>
                <ul class="item c">
                    <li>${data.logfunction}</li>
                <ul>
                `;

                document
                    .getElementById('M')
                    .innerHTML = radioHtml;
            });
    } else {
        fetch(`i18n/${langs}.json`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var navHtml = `
                <ul>
                    <li>
                        <a href="#/?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/index.svg">${data.Home}</a>
                    </li>
                    <li>
                        <a href="#/photo?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/photo.svg">${data.Photo}</a>
                    </li>
                    <li>
                        <a href="#/device?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/box.svg">${data.Device}</a>
                    </li>
                    <li>
                        <a href="#/links?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/links.svg">${data.Links}</a>
                    </li>
                    <li>
                        <a href="https://www.yuyanlab.com"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/blog.svg">${data.Blog}</a>
                    </li>
                    <li>
                        <a href="#/radio?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/radio.svg">${data.HamRadio}</a>
                    </li>
                    <li>
                        <div class="dropdown">
                        <a>
                        <img class="dropbtn" style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/lang.svg">${data.Language}</a>
                            <div class="dropdown-content">
                                <a href="#/radio?lang=zh-CN">简体中文</a>
                                <a href="#/radio?lang=en-US">English</a>
                                <a href="#/radio?lang=ja-JP">日本語</a>
                            </div>
                        </div>
                    </li>
                </ul>
    `;
                document
                    .getElementById('h')
                    .innerHTML = navHtml;

                var radioHtml = `
                <ul class="item c">
                    <li>${data.callsign}:</li>
                </ul>
                <br/>
                <ul class="item c">
                    <li>BG6TTI (CN)</li>
                </ul>
                <ul class="item c">
                    <li>K6TTI (US-HV)</li>
                </ul>
                <br/>
                <ul class="item c">
                    <li>${data.logfunction}</li>
                <ul>
                `;

                document
                    .getElementById('M')
                    .innerHTML = radioHtml;

            });
    }
});


router.route('/links', function () {
    var langs = hashGetQueryVariable('lang');
    var hashSpmId1 = hashGetSpmId(0);
    var hashSpmId2 = hashGetSpmId(1);
    var hashSpmId3 = hashGetSpmId(2);
    if (langs == 'langundefined') {
        fetch('i18n/en-US.json')
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var navHtml = `
                <ul>
                    <li>
                        <a href="#/?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/index.svg">${data.Home}</a>
                    </li>
                    <li>
                        <a href="#/photo?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/photo.svg">${data.Photo}</a>
                    </li>
                    <li>
                        <a href="#/device?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/box.svg">${data.Device}</a>
                    </li>
                    <li>
                        <a href="#/links?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/links.svg">${data.Links}</a>
                    </li>
                    <li>
                        <a href="https://www.yuyanlab.com"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/blog.svg">${data.Blog}</a>
                    </li>
                    <li>
                        <a href="#/radio?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/radio.svg">${data.HamRadio}</a>
                    </li>
                    <li>
                        <div class="dropdown">
                        <a>
                        <img class="dropbtn" style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/lang.svg">${data.Language}</a>
                            <div class="dropdown-content">
                                <a href="#/links?lang=zh-CN">简体中文</a>
                                <a href="#/links?lang=en-US">English</a>
                                <a href="#/links?lang=ja-JP">日本語</a>
                            </div>
                        </div>
                    </li>
                </ul>
    `;
                document
                    .getElementById('h')
                    .innerHTML = navHtml;

                var linksHtml = `
                    <ul class="item c">
                        <li>
                            <img style="width: 128px; height: 128px; fill: rgb(0, 0, 0);" src="i/links.svg"><p class="item-span">${data.Links}</p>
                        </li>
                        <li class="linkhr"></li>
                        <li>
                            <a href="https://twitter.com/YuYanDev"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/twitter.svg"><p class="item-link">Twitter</p></a>
                            <a href="https://github.com/YuYanDev"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/github.svg"><p class="item-link">Github</p></a>
                            <a href="https://instagram.com/YuYanDev"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/instagram.svg"><p class="item-link">Instagram</p></a>
                        </li>
                        <li>
                            <a href="https://www.yuyanlab.com/Link/"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/links.svg"><p class="item-link">${data.linksinfo}</p></a>
                        </li>
                        <li class="linkhr"></li>
                        <li>
                            <a href="tencent://message/?uin=1572608434"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/qq.svg"><p class="item-link">1572608434</p></a>
                            <a href="https://t.me/SakaraHiroya"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/telegram.svg"><p class="item-link">SakaraHiroya</p></a>
                            <a href="mailto:sakura@alleysakura.com"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/email.svg"><p class="item-link">E-mail</p></a>
                        </li>
                    </ul>
                `;

                document
                    .getElementById('M')
                    .innerHTML = linksHtml;
            });
    } else {
        fetch(`i18n/${langs}.json`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var navHtml = `
                <ul>
                    <li>
                        <a href="#/?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/index.svg">${data.Home}</a>
                    </li>
                    <li>
                        <a href="#/photo?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/photo.svg">${data.Photo}</a>
                    </li>
                    <li>
                        <a href="#/device?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/box.svg">${data.Device}</a>
                    </li>
                    <li>
                        <a href="#/links?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/links.svg">${data.Links}</a>
                    </li>
                    <li>
                        <a href="https://www.yuyanlab.com"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/blog.svg">${data.Blog}</a>
                    </li>
                    <li>
                        <a href="#/radio?lang=${langs}"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/radio.svg">${data.HamRadio}</a>
                    </li>
                    <li>
                        <div class="dropdown">
                        <a>
                        <img class="dropbtn" style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/lang.svg">${data.Language}</a>
                            <div class="dropdown-content">
                                <a href="#/links?lang=zh-CN">简体中文</a>
                                <a href="#/links?lang=en-US">English</a>
                                <a href="#/links?lang=ja-JP">日本語</a>
                            </div>
                        </div>
                    </li>
                </ul>
    `;
                document
                    .getElementById('h')
                    .innerHTML = navHtml;

                var linksHtml = `
                    <ul class="item c">
                        <li>
                            <img style="width: 128px; height: 128px; fill: rgb(0, 0, 0);" src="i/links.svg"><p class="item-span">${data.Links}</p>
                        </li>
                        <li class="linkhr"></li>
                        <li>
                            <a href="https://twitter.com/YuYanDev"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/twitter.svg"><p class="item-link">Twitter</p></a>
                            <a href="https://github.com/YuYanDev"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/github.svg"><p class="item-link">Github</p></a>
                            <a href="https://instagram.com/YuYanDev"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/instagram.svg"><p class="item-link">Instagram</p></a>
                        </li>
                        <li>
                            <a href="https://www.yuyanlab.com/Link/"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/links.svg"><p class="item-link">${data.linksinfo}</p></a>
                        </li>
                        <li class="linkhr"></li>
                        <li>
                            <a href="tencent://message/?uin=1572608434"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/qq.svg"><p class="item-link">1572608434</p></a>
                            <a href="https://t.me/SakaraHiroya"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/telegram.svg"><p class="item-link">SakaraHiroya</p></a>
                            <a href="mailto:sakura@alleysakura.com"><img style="width: 64px; height: 64px; fill: rgb(0, 0, 0);" src="i/email.svg"><p class="item-link">E-mail</p></a>
                        </li>
                    </ul>
                `;

                document
                    .getElementById('M')
                    .innerHTML = linksHtml;

            });
    }
});