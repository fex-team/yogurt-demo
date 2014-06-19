<!doctype html>
{% html lang="en" framework="example:static/js/mod.js" %}
    {% head %}
        <meta charset="utf-8"/>
        <meta content="" name="description">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>{{ title }}</title>

        {% require "example:static/css/bootstrap.css" %}
        {% require "example:static/css/bootstrap-theme.css" %}
        {% require "example:static/js/bigpipe.js" %}
        {% require "example:static/js/jquery-1.10.2.js" %}
        {% require "example:static/js/bootstrap.js" %}

    {% endhead %}

    {% body %}
        <div id="wrap">
            {% block header %}
                {% widget "example:widget/header/header.tpl" %}
            {% endblock %}

            {% block content %}
                This will be override.
            {% endblock %}
        </div>
    {% endbody %}

    {% require "example:page/layout.tpl" %}
{% endhtml %}