var widgetA = require('../widgetA/widgetA.js');

exports.sayWorld = function() {
    console.log('world');
}

exports.sayHelloWorld = function() {
    widgetA.sayHello();
    exports.sayWorld();
}