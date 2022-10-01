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
		res.data.forEach((spot: any) => {
			circleMarker([spot.latitude,spot.longitude], {
				color: spot.occupied ? "#c85050" : "#50C878"
			}).bindPopup(`<h2><b>${spot.externalId ? spot.externalId : "Bez-ID"}: ${spot.occupied ? "OBSADENÉ" : "VOĽNÉ"}</b></h2><br><hr><br><p><b>Naposledy zmenené:</b> ${new Date(spot.lastStatusChange).toLocaleString()}</p><br><sub>${spot.provider} | N ${spot.latitude.toFixed(6)} | W ${spot.longitude.toFixed(6)}</sub>
			<br><br><a target="_blank" href="https://www.google.com/maps/search/?api=1&query=${spot.latitude}%2C${spot.longitude}" style="border-radius: 6px; background-color: #00dd55; width: 260px !important; padding:5px;color:white;">Naviguj ma</a>`).addTo(Map);
		});
	});
</script>

<div bind:this={mapElement} class="h-screen z-10" />

<style>
    @import 'leaflet/dist/leaflet.css';
</style>
