<script lang="ts">
	import { onMount } from 'svelte';
	import axios from 'axios';
	let mapElement: HTMLDivElement;
	let mapp: any;
	let group: any;
	let markerGroup: any;
	let lon: number,lat: number;
	import Swal from "sweetalert2";
	onMount(async () => {
		const { map, tileLayer, circleMarker, layerGroup} = await import('leaflet');
		const Map = map(mapElement, {
			maxBounds: [
				[50.081702, 15.619725],
				[49.989567, 15.893319]
			],
            minZoom: 14,
            maxBoundsViscosity: 100
		}).setView([ 50.03861, 15.77916], 15);
		mapp = Map;
		tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(Map);

		async function markers(){
			markerGroup = layerGroup().addTo(Map);
			const res = await axios.get("/api/parking");
		res.data.forEach((spot: any, index: number) => {
			let markerIsReservable;
			let markerIsReserved;
			if(Math.random() * 3 > 2.5) markerIsReservable = true;
			if(markerIsReservable && Math.random() > 0.5) markerIsReserved = true;
			circleMarker([spot.latitude,spot.longitude], {
				color: spot.occupied ? "#c85050" : Date.now() - spot.lastStatusChange > 15724800000 ? "#8c8c8c" : markerIsReservable ? markerIsReserved ? "#ffe44d" : "#5084c8" : "#50c852",
				className: spot.occupied ? "occupied hidden" : Date.now() - spot.lastStatusChange > 15724800000 ? "idk" : markerIsReservable ? markerIsReserved ? "reserved" : "reservable" : "vacant"
			}).bindPopup(`<h2><b>${spot.externalId ? spot.externalId : "Bez-ID"}: ${spot.occupied ? "OBSADENÉ" : Date.now() - spot.lastStatusChange > 15724800000 ? "DLHO NEZMENENÝ STAV - NEZNÁMA SITUÁCIA" : "VOĽNÉ"}</b></h2><br><hr><br><p><b>Naposledy zmenené:</b> ${new Date(spot.lastStatusChange).toLocaleString()}</p><br><sub>${spot.provider} | N ${spot.latitude.toFixed(6)} | W ${spot.longitude.toFixed(6)}</sub>
			<br><br><div class="flex flew-row"><a target="_blank" href="https://www.google.com/maps/search/?api=1&query=${spot.latitude}%2C${spot.longitude}" style="border-radius: 6px; background-color: ${spot.occupied ? "#C42021" : Date.now() - spot.lastStatusChange > 15724800000 ? "#8c8c8c" : "#49c420"}; padding:5px;color:white;">Naviguj ma</a>\
			${markerIsReservable ? `<button target="_blank" ${markerIsReserved ? "disabled" : ""} style="${markerIsReserved ? "filter:brightness(0.75);" : ""}margin-left: 4px; border-radius: 6px; background-color: #c8b050; padding:5px;color:white;">Rezervovať - 1€/Hod.</button>` : 
			'<button target="_blank" disabled style="margin-left: 4px; border-radius: 6px; background-color: #c8b050; padding:5px;color:white; filter:brightness(0.75);">Nedá sa rezervovať</button>'}`).addTo(markerGroup);
		});
		function buyPopup(id: any){
			console.log("test");
			Swal.fire({
				title: `Rezervovať lístok - ${id}`,
				text: "Týmto si rezervujete lístok v meste Pardubice. Zadajte, na koľko hodín si chcete miesto rezervovať.",
				input: "number",
				showCancelButton: true,
			}).then(result => {
				if(result.isConfirmed){
					Swal.fire({
						title:"Lístok bol rezervovaný",
						icon: "success"
					});
				};
				if(result.isDenied){
					Swal.fire({
						title: "Storno operácie",
						icon: "error"
					})
				}
			})
		};
		document.addEventListener("keydown", (event) => {
			if(event.ctrlKey) buyPopup("test-id");
		})
		}
		markers()
		if(!navigator.geolocation) document.querySelector("#getGeo")?.remove();
	});
	let started: boolean;
	function getLocation() {
  			try{
				if(started){
					mapp.setView([lat,lon], 17);
				}else{
					const interval = setInterval(()=>{
					navigator.geolocation.getCurrentPosition(data=>{renderLocation(data)}, ()=>{clearInterval(interval)});
				},5000);
				}
			}catch(e){
				console.log(e);
			}
		};
		async function renderLocation(data: any){
			started = true;
			lon=data.coords.longitude;lat=data.coords.latitude;
			const { marker, layerGroup } = await import('leaflet');
			if(group) group.remove();
			group = layerGroup().addLayer(marker([data.coords.latitude, data.coords.longitude])).addTo(mapp);
		}
</script>

<button id="getGeo" on:click={() => {getLocation()}} class="fixed left-40 top-4 fill-white z-20 w-12 h-12 bg-blue p-3 rounded-md">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M256 0c17.7 0 32 14.3 32 32V66.7C368.4 80.1 431.9 143.6 445.3 224H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H445.3C431.9 368.4 368.4 431.9 288 445.3V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V445.3C143.6 431.9 80.1 368.4 66.7 288H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H66.7C80.1 143.6 143.6 80.1 224 66.7V32c0-17.7 14.3-32 32-32zM128 256c0 70.7 57.3 128 128 128s128-57.3 128-128s-57.3-128-128-128s-128 57.3-128 128zm128 80c-44.2 0-80-35.8-80-80s35.8-80 80-80s80 35.8 80 80s-35.8 80-80 80z"/></svg>
</button>

<div bind:this={mapElement} class="h-screen z-10" />

<style>
    @import 'leaflet/dist/leaflet.css';
</style>
