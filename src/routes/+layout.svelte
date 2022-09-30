<script>
  import "../app.css";
  import Map from "$lib/components/Map.svelte";
  import Nav from "$lib/components/Nav.svelte";
  import Filter from "$lib/components/Filter.svelte";
</script>

<Nav/>
<Map/>
<Filter/>

<slot />