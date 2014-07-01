{% extends 'example:page/layout.tpl' %}

{% block beforecontent %}
    {% widget "example:widget/pagelets/jumbotron/jumbotron.tpl" id="jumbotron" mode="async" %}
{% endblock %}

{% block content %}
     <!-- Example row of columns -->
    <div class="row">
      <div class="col-md-4">
          {% widget "example:widget/pagelets/heading/heading.tpl" id="heding1" mode="async" %}
      </div>
      <div class="col-md-4">
        {% widget "example:widget/pagelets/heading/heading.tpl" id="heding2" mode="async" %}
     </div>
      <div class="col-md-4">
        {% widget "example:widget/pagelets/heading/heading.tpl" id="heding3" mode="async" %}
      </div>
    </div>
{% endblock %}