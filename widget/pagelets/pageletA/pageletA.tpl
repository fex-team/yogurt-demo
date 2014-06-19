{% style %}

#demo {
    color: red;
}

{% endstyle %}
<div id="demo">
    bla bla lba bla

    {{ model.content }}
</div>

{% script %}
console.log('inline script');
{% endscript %}