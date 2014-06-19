(function() {
    var Util = (function() {
        var d = document,
            head = d.getElementsByTagName('head')[0];

        var loadJs = function(url, cb) {
            var script = d.createElement('script');
            script.setAttribute('src', url);
            script.setAttribute('type', 'text/javascript');

            var loaded = false;
            var loadFunction = function() {
                if (loaded) return;
                loaded = true;
                cb && cb();
            };
            script.onload = loadFunction;
            script.onreadystatechange = loadFunction;
            head.appendChild(script);
        };

        var browser = (function() {
            var ua = navigator.userAgent.toLowerCase();
            var match = /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||
                /(msie) ([\w.]+)/.exec(ua) || !/compatible/.test(ua) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) ||
                [];
            return match[1];
        })();

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

        var appendStyle = function(style) {
            var dom = document.createElement('style');
            dom.innerHTML = style;
            head.appendChild(dom);
        };

        var globalEval = function(code) {
            var script,
                indirect = eval;

            code = code.replace(/^\s+/, '').replace(/\s+$/, '');

            if ( code ) {
                // If the code includes a valid, prologue position
                // strict mode pragma, execute code by injecting a
                // script tag into the document.
                if ( code.indexOf('use strict') === 1 ) {
                    script = document.createElement('script');
                    script.text = code;
                    head.appendChild( script ).parentNode.removeChild( script );
                } else {
                    // Otherwise, avoid the DOM node creation, insertion
                    // and removal by using an indirect global eval
                    indirect( code );
                }
            }
        };

        return {
            loadCss: loadCss,
            loadJs: loadJs,
            appendStyle: appendStyle,
            globalEval: globalEval
        };

    })();

    function PageLet(data, domInserted) {
        var remainingCss = 0;

        var loadCss = function() {
            //load css
            if (data.css && data.css.length) {
                remainingCss = data.css.length;
                for (var i = remainingCss; i--;)
                    Util.loadCss(data.Css[i], function() {
                        !--remainingCss && insertDom();
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

            dom = document.getElementById(data.id);
            dom.innerHTML = data.html;
            if(data.scripts && data.scripts.length) {
                for(i = 0, len = data.scripts.length; i < len; i++) {
                    Util.globalEval(data.scripts[i]);
                }
            }

            scriptText = dom.getElementsByTagName('script');

            for (i = 0, len = scriptText.length; i < len; i++) {
                node = scriptText[i];
                text = node.text || node.textContent || node.innerHTML || '';
                Util.globalEval(text);
            }

            domInserted();
        }

        var loadJs = function() {
            if (!data.js) return;
            for (var i = 0, len = data.js.length; i < len; i++)
                Util.loadJs(data.js[i]);
        }

        return {
            loadCss: loadCss,
            loadJs: loadJs
        };
    }

    var BigPipe = function() {

        var d = document,
            count = 0,
            pagelets = []; /* registered pagelets */

        var onPageletArrive = function(p) {
            var pagelet = new PageLet(p, function() {
                if (!--count) {
                    //load js
                    for (var i = 0; i < pagelets.length; i++)
                        pagelets[i].loadJs();
                }
            });
            pagelets.push(pagelet);
            count++;
            pagelet.loadCss();
        };

        return {
            onPageletArrive: onPageletArrive
        };
    }();

    window.BigPipe = BigPipe;
})();