exports.sayHello = function() {
    console.log('hello!');
    require.async('./widgetA_async.js', function (o) {
        o.hello();
    });
};