<template lang="pug">
  .notification
    .logo
      img(:src='"@/assets/hydro_logo.png"')
    .text
      |Начать производственную гимнастику?
    .btns
      .btn.secondary(@click='exit') Отменить
      .btn.primary(@click='onClick') Начать
</template>
<script>
const { ipcRenderer } = require('electron');

export default {
  methods: {
    exit() {
      ipcRenderer.send('declined-video', this.$route.query.video_id);
      window.close()
    },
    onClick() {
      ipcRenderer.send('open-video', this.$route.query.video_id);
      window.close()
    }
  }
}
</script>
<style lang="sass" scoped>
.notification
  padding: 16px
  width: 100%
  display: flex
  flex-direction: column
  justify-content: space-between
  .logo
    width: 150px
    img 
      width: 100%
  .text
    text-align: center
    width: 100%
    font-size: 22px
    font-weight: 500
    margin-top: 32px
  .btns
    display: flex
    align-items: center
    justify-content: center
    padding: 0 64px
    margin-top: 32px
    .btn
      height: 36px
      min-width: 64px
      padding: 0 16px
      border-radius: 5px
      font-size: 0.875rem
      align-items: center
      border-radius: 4px
      display: inline-flex
      flex: 0 0 auto
      font-weight: 500
      letter-spacing: 0.0892857143em
      justify-content: center
      outline: 0
      position: relative
      text-decoration: none
      text-indent: 0.0892857143em
      text-transform: uppercase
      transition-duration: 0.28s
      transition-property: box-shadow, transform, opacity
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)
      -webkit-user-select: none
      -moz-user-select: none
      -ms-user-select: none
      user-select: none
      vertical-align: middle
      white-space: nowrap
      margin: 0 16px
      box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)
      transition: opacity .3s
      &:hover
        cursor: pointer
        opacity: .8
    .secondary
      box-shadow: none
    .primary
      background-color: #C9693B
      color: #fff
</style>