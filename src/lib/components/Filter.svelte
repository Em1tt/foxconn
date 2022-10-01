<script lang="ts">
    let toggle: boolean = false;
    //const button = document.querySelector("button");
    function toggleFilter(toggle: boolean, event: any){
        const button = document.querySelector("#filterWrapper");
        if(toggle){
            //Hide
        }else{
            //Show
            button?.classList?.remove("w-12");
            button?.classList?.remove("h-12");
            button?.classList?.add("w-80");button?.classList?.add("h-80");
        }
        toggle = !toggle;
    };
</script>

<button on:click={(event) => {toggleFilter(toggle, event)}} class="fixed left-24 top-4 fill-white z-40 w-12 h-12 bg-blue p-3 rounded-md">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2022 Fonticons, Inc. --><path d="M3.9 54.9C10.5 40.9 24.5 32 40 32H472c15.5 0 29.5 8.9 36.1 22.9s4.6 30.5-5.2 42.5L320 320.9V448c0 12.1-6.8 23.2-17.7 28.6s-23.8 4.3-33.5-3l-64-48c-8.1-6-12.8-15.5-12.8-25.6V320.9L9 97.3C-.7 85.4-2.8 68.8 3.9 54.9z"/></svg>
</button>
<div id="filterWrapper" class="duration-300 top-4 left-24 rounded-md w-0 h-0"></div>