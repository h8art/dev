<template lang='pug'>
#app
  //- .side
  //-   router-link.side-item(to='/dashboard' tag='div')
  //-     i.material-icons dashboard
  //-     span Дашборд
  //-   router-link.side-item(to='/video' tag='div')
  //-     i.material-icons ondemand_video
  //-     span Видео
  //-   router-link.side-item(to='/notification' tag='div')
  //-     i.material-icons assessment
  //-     span Статистика
  //- .header
  //-   .close.circle(@click='close')
  //-   .minimize.circle(@click='min')
  //-   .maximize.circle(@click='max')
  router-view
</template>

<script>
  const remote = require('electron').remote;
  export default {
    name: 'health',
    methods: {
      close() {
        var window = remote.getCurrentWindow();
        window.close();
      },
      min() {
        var window = remote.getCurrentWindow();
        window.minimize(); 
      },
      max() {
        var window = remote.getCurrentWindow();
        if (!window.isMaximized()) {
            window.maximize();          
        } else {
            window.unmaximize();
        }
      }
    }
  }
</script>

<style lang='sass'>
body
  margin: 0
#app
  display: flex
  height: 100vh
  background: #EFF6F7
  font-family: Rubik, Roboto, Arial
  .side
    background: #4399A9
    display: flex
    height: 100%
    width: 70px
    color: #fff
    border-bottom-right-radius: 25px
    border-top-right-radius: 25px
    flex-direction: column
    align-items: center
    justify-content: center
    &-item
      display: flex
      flex-direction: column
      align-items: center
      width: 55px
      font-size: 10px
      font-weight: 500
      padding: 25px 0px
      border-radius: 25px
      margin: 5px 0
      &:hover
        cursor: pointer
      span
        margin-top: 5px
    .router-link-active
      color: #4399A9
      background: #fff
  .header
    position: fixed
    width: 70px
    top: 14px
    lef: 0px
    display: flex
    flex-direction: column
    align-items: center
    -webkit-app-region: drag
    .circle
      height: 12px
      width: 12px
      border-radius: 50%
      margin: 4px
    .close
      background-color: #EE665A
    .minimize
      background-color: #F3B065
    .maximize
      background-color: #A9D9BF
</style>
