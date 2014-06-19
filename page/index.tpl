{% extends 'layout.tpl' %}

{% block content %}
    Welcome to Yogurt, this is the content of index page.

    {% script %}
    var A = require('example:widget/widgetB/widgetB.js');

    A.sayHelloWorld();
    {% endscript %}

    {% widget "example:widget/pagelets/pageletA/pageletA.tpl" mode="async" id="pageletA" %}
    {% widget "example:widget/pagelets/pageletB/pageletB.tpl" mode="quickling" id="pageletB" %}
    {% widget "example:widget/pagelets/pageletC/pageletC.tpl" mode="async" id="pageletC" %}


    {% require "example:page/index.tpl" %}
{% endblock %}