{% style %}

#demo {
    color: red;
}

{% endstyle %}
<style>#demo {color: blue;}</style>
<div id="demo">
    This is pagelet A, will be rendered in 2 seconds.

    {{ model.content }}
</div>

{% widget "example:widget/pagelets/pageletD/pageletD.tpl" mode="async" id="pageletD" %}

<script type="text/javascript">console.log('inlinescript 11');</script>

{% script %}
console.log('inline script');
console.log('pagelet A', new Date());
{% endscript %}