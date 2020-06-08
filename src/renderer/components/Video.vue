<template lang="pug">
  .videos
    video.video#vid(autoplay :controls='false' ref='vid' @ended="onEnd")
      source(:src='"file://" + vidPath + "/" + $route.params.id + ".mp4"' type='video/mp4')
</template>
<script>
const { ipcRenderer, remote } = require('electron');
export default {
  mounted() {
    window.addEventListener("beforeunload", () => {
      this.closeVid();
    }, false);
  },
  computed: {
    vidPath() {
      return remote.getGlobal('videoPath')
    }
  },
  methods: {
    closeVid() {
      var vid = document.getElementById("vid");
      if(vid.currentTime != vid.duration) {
        ipcRenderer.send('watchedhalf-video', {time: vid.currentTime, video_id: this.$route.params.id})
      }
    },
    onEnd() {
      ipcRenderer.send('watchedfull-video', this.$route.params.id);
      window.close()
    }
  }
}
</script>
<style lang="sass" scoped>
.videos
  flex: 1
  height: 100vh
  width: 100vw
  overflow: hidden
  .video
    width: 100vw
    height: 100vh
  video
    &::-webkit-media-controls
      display: none

</style>