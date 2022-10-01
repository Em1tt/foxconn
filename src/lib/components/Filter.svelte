<script lang="ts">
	import { element } from "svelte/internal";


    let toggle: boolean;
    //const button = document.querySelector("button");
    function toggleFilter(event: any){
        const button = document.querySelector("#filterWrapper");
        if(toggle){
            toggle = false;
            //Hide
            button?.classList?.remove("w-80");
            button?.classList?.remove("h-80");
            button?.classList?.add("w-0");button?.classList?.add("h-0");
        }else{
            toggle = true;
            //Show
            button?.classList?.remove("w-0");
            button?.classList?.remove("h-0");
            button?.classList?.add("w-80");button?.classList?.add("h-80");
        }
    };
    function toggleMarkers(query: any, checkbox: string){ //
        if(!(document.getElementById(checkbox) as HTMLInputElement)?.checked){
            [...document.querySelectorAll(query)].forEach((e) => e.classList.add("hidden"));
        }else{
            [...document.querySelectorAll(query)].forEach((e) => e.classList.remove("hidden"));
        }
    }
</script>

<button on:click={(event) => {toggleFilter(event)}} class="fixed left-24 top-4 fill-white z-40 w-12 h-12 bg-blue p-3 rounded-md">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"/></svg>
</button>
<div id="filterWrapper" class="fixed duration-300 top-4 left-24 rounded-md w-0 h-0 bg-blue z-30 overflow-hidden">
    <h2 class="ml-12 text-white text-lg font-bold pt-3">Filtre</h2><br>
    <form class="p-2">
        <p class="font-bold text-white mt-2">Obsadenosť</p>
        <div class="flex flex-row items-center mt-2">
            <input on:change={(e) => {toggleMarkers(".vacant", "vacant")}} type="checkbox" checked id="vacant" value="vacant" name="vacant" class="hidden peer"><label class="checkbox block w-6 h-6 border-4 border-blue rounded-md bg-blue brightness-150 peer-checked:bg-red" for="vacant"></label><label for="vacant" class="text-white ml-2">Voľné</label><br>
        </div>
        <div class="flex flex-row items-center mt-2">
        <input on:change={() => {toggleMarkers(".occupied", "occupied")}} type="checkbox" id="occupied" value="occupied" name="occupied" class="hidden peer"><label class="checkbox block w-6 h-6 border-4 border-blue rounded-md bg-blue brightness-150 peer-checked:bg-red" for="occupied"></label><label for="occupied" class="text-white ml-2">Obsadené</label><br>
        </div>
        <div class="flex flex-row items-center mt-2">
            <input on:change={(e) => {toggleMarkers(".idk", "idk")}} type="checkbox" checked id="idk" value="idk" name="idk" class="hidden peer"><label class="checkbox block w-6 h-6 border-4 border-blue rounded-md bg-blue brightness-150 peer-checked:bg-red" for="idk"></label><label for="idk" class="text-white ml-2">Neaktivné</label><br>
        </div>
    </form>
</div>