<!doctype html>
{% html lang="en" framework="example:static/js/mod.js" %}
    {% head %}
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">
        <link rel="icon" href="/static/favicon.ico">
        <title>{{ title }}</title>

        {% require "example:static/css/bootstrap.css" %}
        {% require "example:static/css/bootstrap-theme.css" %}
        {% require "example:static/css/style.css" %}
        {% require "example:static/js/bigpipe.js" %}
        {% require "example:static/js/jquery-1.10.2.js" %}
        {% require "example:static/js/bootstrap.js" %}

        <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->

    {% endhead %}

    {% body %}
        <div id="wrapper">
            {% widget "example:widget/header/header.tpl" %}

            {% block beforecontent %}
            {% endblock %}
            
            <div class="container">
                {% block content %}
                {% endblock %}
            </div>

            {% block aftercontent %}
            {% endblock %}

            {% widget "example:widget/footer/footer.tpl" %}
        </div>

    {% endbody %}

    {% require "example:page/layout.tpl" %}
{% endhtml %}
