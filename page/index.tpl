{% extends 'layout.tpl' %}

{% block content %}
    Welcome to Yogurt, this is the content of index page.

    {% script %}
    var A = require('example:widget/widgetB/widgetB.js');

    A.sayHelloWorld();
    {% endscript %}

    {% widget "example:widget/pagelets/pageletA/pageletA.tpl" mode="async" id="pageletA" %}


    {% require "example:page/index.tpl" %}
{% endblock %}