<template>
    <div class="demo">
        <iframe src="https://stackblitz.com/github/alberthaff/ngx-buoy-demo?embed=1&file=src/app/home/home.component.ts" class="demoFrame"></iframe>
    </div>
</template>

<style lang="stylus">
    @import '../theme/styles/config.styl'

    .demo
        width 100%
        height 100%
        top 0
        left 0
        position fixed

    .demoFrame
        padding-top $navbarHeight
        height "calc(100% - %s)" % $navbarHeight
        width 100%
        display block
        position absolute
        top 0
        left 0
        border none
</style>
