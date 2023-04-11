<script lang="ts" setup></script>

<template>
  <div>
    <h1>How to put your music files in a m3u playlist: </h1>
    <br>
    <b>Step 1: </b> Open the VLC media player (download clicking
    <a class="text-link" href="https://www.videolan.org">here</a> 
    if needed).
    <br>
    <b>Step 2:</b> Go to the <b>media</b> menu and click 
    <b>Open file</b> (or press Ctrl+O). Illustration below:
    <img src="~/assets/img/tutorial_1.png"/>
    <b>Step 3:</b> Select all desirable files and click open.
    <img src="~/assets/img/tutorial_2.png"/>
    <b>Step 4:</b> Go again to the <b>file</b> menu and click
    Save playlist to file.
    <img src="~/assets/img/tutorial_3.png"/>
    <b>Step 5:</b> Save in the same directory you will use for
    Play My Time music player.
    <img src="~/assets/img/tutorial_4.png"/>
    <b>Step 6:</b> Back to the playlists page and listen your musics!
    <br>
    <b>Step 7 (optional):</b> Group your playslists creating new ambiences, and
    therefore separate the musics you wanna listen by place or situation.
  </div>
</template>

<style scoped>
img {
  @apply mt-2 mb-6
}
.dark img:nth-of-type(1), .dark img:nth-of-type(3) {
  @apply invert
}
</style>
