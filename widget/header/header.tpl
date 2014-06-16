<div id="header">

    {% for item in navs -%}{{ item }}
        <li><a href="{{ item.url }}">{{ item.label }}</a></li>
    {%- endfor %}
</div>

{% script %}
var header = require('./header.js');

{% endscript %}