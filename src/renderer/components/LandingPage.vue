<template lang='pug'>
.grid
  .info
    .user
      .user-ava
        img(:src='"@/assets/woman.jpg"')
      .user-title Инна Смирнова
      .user-subtitle 24 года, Москва
    .past
      .past-title История упражнений
      .past-inner
        .excercise(v-for='i in 5')
          .excercise-title 
            .status(:class='{"passed": i==2}')
            span Упражнение для глаз №{{i}}
          .excercise-date  Было {{i==2?"не":""}} выполнено {{(i+1)}} дней назад
  .main
    .graph
      img(:src='"@/assets/graph.png"')
    .title Совет дня
    .text 
      .text-content
        br
        br
        |Для жизни. В среднем во взрослом организме циркулирует примерно 5 литров крови. Плазма крови на 92–95% состоит из воды. Благодаря воде кровь может выполнять свои функции:
        br
        |
        br
        |Доставлять к клеткам органов питательные вещества;
        br
        |Приносить тканям кислород от лёгких и возвращать в них углекислый газ;
        br
        |Выбрасывать отработанные вещества из внутренних органов через почки;
        br
        |Обеспечивать гомеостаз (постоянство и равновесие внутренней среды): поддерживать температуру, водно-солевой баланс, работу гормонов и ферментов;
        br
        |Защищать организм: в крови циркулируют лейкоциты и белки плазмы, которые отвечают за иммунитет.
        br
        |Если в организме недостаточно воды, то масса крови уменьшается, повышается её вязкость. Сердцу нелегко перекачивать такую кровь. Происходит преждевременное изнашивание сердечной мышцы, что приводит к патологии вплоть до инфаркта миокарда.
        br
        |
        br
        |Именно поэтому при активных занятиях спортом и высоких нагрузках организму нужно больше воды
</template>

<script>

</script>
<style lang="sass" scoped>
.grid
  flex: 1
  height: 100vh
  display: flex
  align-items: start
  .main
    background: #fff
    padding: 50px
    height: 100vh
    display: flex
    box-sizing: border-box
    flex-direction: column
    flex: 1
    border-top-left-radius: 50px
    border-bottom-left-radius: 50px
    box-shadow: 0 0 8px 2px rgba(0,0,0,.05)
    .title
      color: #4898A3
      font-size: 23px
      margin-top: 15px
    .text
      overflow: auto
      flex: 1
      &-title
      &-content
        font-size: 14px
    .graph
      img
        width: 100%
  .info
    display: flex 
    flex-direction: column
    height: 100%
    .past
      width: 240px
      margin: 0 40px
      margin-top: 25px
      margin-bottom: 25px
      flex: 1
      display: flex
      flex-direction: column
      &-title
        margin-bottom: 15px
        font-size: 15px
        padding-left: 15px
        color: #4898A3
      &-inner
        box-shadow: 0 0 8px 2px rgba(0,0,0,.05)
        background: #fff
        border-radius: 25px
        flex: 1
        overflow: auto
        padding: 10px 0
        .excercise
          padding: 10px 15px
          border-bottom: 1px solid #D5D6D8
          &-title
            font-size: 15px
            display: flex
            align-items: center
            .status
              width: 8px
              height: 8px
              border-radius: 50%
              background: #A9D8C1
              margin-right: 8px
            .passed
              background:  #EE665A
          &-date
            font-size: 12px
            color: #B4BBBF
            margin-top: 5px
  .user
    display: flex
    align-items: center
    justify-content: center
    flex-direction: column
    width: 240px
    margin: 0 40px
    padding-bottom: 20px
    padding-top: 50px
    background: #fff
    position: relative
    margin-top: 95px
    box-shadow: 0 0 16px 7px rgba(0,0,0,.1)
    border-radius: 25px
    &-ava
      width: 100px
      height: 100px
      border-radius: 50%
      top: -65px
      overflow: hidden
      box-shadow: 0 0 16px 7px rgba(0,0,0,.1)
      position: absolute
      img
        width: 120%
    &-title
    &-subtitle
      font-size: 14px
      color: #C0C0C3
      margin-top: 8px
</style>
