{% extends 'layout.tpl' %}

{% block content %}
    Welcome to Yogurt, this is the content of index page.

    {% script %}
    var A = require('example:widget/widgetB/widgetB.js');

    A.sayHelloWorld();
    {% endscript %}

{% endblock %}

{% require "example:page/index.tpl" %}