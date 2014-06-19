(function() {
    var Util = (function() {
        var d = document;
        var head = d.getElementsByTagName('head')[0];

        // 获取浏览器信息
        var browser = (function() {
            var ua = navigator.userAgent.toLowerCase();
            var match = /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||
                /(msie) ([\w.]+)/.exec(ua) || !/compatible/.test(ua) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) ||
                [];
            return match[1];
        })();

        // 加载 js
        var loadJs = function(url, cb) {
            var script = d.createElement('script');
            var loaded = false;
            var wrap = function() {
                if (loaded) {
                    return;
                }

                loaded = true;
                cb && cb();
            };

            script.setAttribute('src', url);
            script.setAttribute('type', 'text/javascript');
            script.onload = wrap;
            script.onreadystatechange = wrap;
            head.appendChild(script);
        };

        // 加载 css
        var loadCss = function(url, cb) {
            var link = d.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = url;

            if (browser === 'msie') {
                link.onreadystatechange = function() {
                    /loaded|complete/.test(link.readyState) && cb();
                }
            } else if (browser == 'opera') {
                link.onload = cb;
            } else {
                //FF, Safari, Chrome
                (function() {
                    try {
                        link.sheet.cssRule;
                    } catch (e) {
                        setTimeout(arguments.callee, 20);
                        return;
                    };
                    cb();
                })();
            }

            head.appendChild(link);
        };

        // 插入内嵌 style
        var appendStyle = function(code) {
            var dom = document.createElement('style');
            dom.innerHTML = code;
            head.appendChild(dom);
        };

        // 执行 js 脚本。
        var globalEval = function(code) {
            var script;

            code = code.replace(/^\s+/, '').replace(/\s+$/, '');

            if (code) {
                // If the code includes a valid, prologue position
                // strict mode pragma, execute code by injecting a
                // script tag into the document.
                if (code.indexOf('use strict') === 1) {
                    script = document.createElement('script');
                    script.text = code;
                    head.appendChild(script).parentNode.removeChild(script);
                } else {
                    // Otherwise, avoid the DOM node creation, insertion
                    // and removal by using an indirect global eval
                    eval(code);
                }
            }
        };

        var ajax = function(url, cb, data) {
            var xhr = new (window.XMLHttpRequest || ActiveXObject)("Microsoft.XMLHTTP");

            xhr.onreadystatechange = function() {
                if (this.readyState == 4) {
                    cb(this.responseText);
                }
            };
            xhr.open(data?'POST':'GET', url + '&t=' + ~~(Math.random() * 1e6), true);

            if (data) {
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            }
            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            xhr.send(data);
        }

        return {
            loadCss: loadCss,
            loadJs: loadJs,
            appendStyle: appendStyle,
            globalEval: globalEval,
            ajax: ajax
        };
    })();


    var BigPipe = function() {

        //
        // data
        //  - container       optional
        //  - id              pagelet Id
        //  - html            pagelet content
        //  - js              []
        //  - css             []
        //  - styles          []
        //  - scripts         []
        //  - onReady         function
        // onDomInserted called when dom inserted.
        function PageLet(data, onDomInserted) {
            var remaining = 0;

            var loadCss = function() {
                //load css
                if (data.css && data.css.length) {
                    remaining = data.css.length;
                    for (var i = remaining; i--;)
                        Util.loadCss(data.css[i], function() {
                            --remaining || insertDom();
                        });
                } else {
                    insertDom();
                }
            }

            var insertDom = function() {
                var i, len, dom, node, text, scriptText;

                if(data.styles && data.styles.length) {
                    for(i = 0, len = data.styles.length; i < len; i++) {
                        Util.appendStyle(data.styles[i]);
                    }
                }

                dom = data.contianer || document.getElementById(data.id);
                dom.innerHTML = data.html;
                if(data.scripts && data.scripts.length) {
                    for(i = 0, len = data.scripts.length; i < len; i++) {
                        Util.globalEval(data.scripts[i]);
                    }
                }

                onDomInserted();
            }

            var loadJs = function() {
                var len = data.js && data.js.length;
                var remaining = len;
                var cb = data.onReady;
                var i;

                if (!len) {
                    cb && cb();
                    return;
                }

                for (i = 0, len = data.js.length; i < len; i++) {
                    Util.loadJs(data.js[i], cb && function() {
                        --remaining || cb();
                    });
                }
            }

            return {
                loadCss: loadCss,
                loadJs: loadJs
            };
        }

        var d = document,
            count = 0,
            pagelets = []; /* registered pagelets */

        var onPageletArrive = function(p) {
            var pagelet = PageLet(p, function() {
                var item;

                if (!--count) {

                    while ((item = pagelets.shift())) {
                        item.loadJs();
                    }
                }
            });
            pagelets.push(pagelet);
            count++;
            pagelet.loadCss();
        };

        return {
            onPageletArrive: onPageletArrive,
            load: function(pageletIDs, param) {

                if (!(pageletIDs instanceof Array)) {
                    pageletIDs = [pageletIDs];
                }

                var args = [],
                    currentPageUrl = location.href,
                    i, id;

                for(i = pageletIDs.length - 1; i >= 0; i--) {
                    id = pageletIDs[i];
                    args.push('pagelets[]=' + id);
                }

                param = param ? '&' + param : '';

                var search = location.search;
                search = search ? (search + '&') : '?';
                var url = search + args.join('&') + param;

                // 异步请求pagelets
                Util.ajax(url, function(res) {
                    // 如果数据返回回来前，发生切页，则不再处理，否则当前页面有可能被干掉
                    if(currentPageUrl !== location.href) {
                        return;
                    }

                    Util.globalEval(res);
                });
            }
        };
    }();

    window.BigPipe = BigPipe;
})();