<script lang="ts">
	import { onMount } from 'svelte';
	import axios from 'axios';
	let mapElement: HTMLDivElement;
	onMount(async () => {
		const { map, tileLayer, circleMarker} = await import('leaflet');
		const Map = map(mapElement, {
			maxBounds: [
				[50.081702, 15.619725],
				[49.989567, 15.893319]
			],
            minZoom: 14,
            maxBoundsViscosity: 100
		}).setView([ 50.03861, 15.77916], 15);
		tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(Map);

		const res = await axios.get("/api/parking");
		res.data.filter((i: any) => !i.occupied)forEach((spot: any) => {
			console.log(spot)
			circleMarker([spot.latitude,spot.longitude]).addTo(Map);
		})
	});
</script>

<div bind:this={mapElement} class="h-screen z-10" />

<style>
    @import 'leaflet/dist/leaflet.css';
</style>
