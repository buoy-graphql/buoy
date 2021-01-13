<template>
    <div class="home" style="padding-top: 100px;">
        <!--<div class="superhero">
            <div class="background"></div>
            <div class="heroContent">
                <div class="hero">
                    <img class="superheroLogo" src="/img/icon.svg" />

                    <div class="intro">
                        <h1>Buoy</h1>
                        <p>A GraphQL client for Angular!</p>

                        <a href="/master/getting-started/installation" class="heroButton">Get started</a>
                    </div>
                </div>
            </div>
        </div>-->

        <div class="superhero blue headerBg">
            <div class="section">
                <div class="row">
                    <div class="col-sm-5">
                        <img class="superheroLogo" src="/img/icon.svg" width="100%" />
                    </div>
                    <div class="col-sm-7 intro">
                        <h1>Buoy</h1>
                        <p>A GraphQL client for Angular!</p>

                        <a href="/master/getting-started/installation" class="heroButton">Get started</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="superhero">
            <div class="section">
                <div class="row pb-5">
                    <div class="col-md-3">Laravel</div>
                    <div class="col-md-3">Lighthouse</div>
                    <div class="col-md-3">Angular</div>
                    <div class="col-md-3">Buoy</div>
                </div>
            </div>
        </div>

        <div class="superhero red slope-top-rtl slope-bottom-rtl">
            <div class="section">
                <div class="row">
                    <div class="col-md-7">
                        <img src="https://i.imgur.com/glANTTw.png" width="100%" />
                    </div>
                    <div class="col-md-5">
                        <h3>Easy querying</h3>
                        <p class="lead">
                            With Buoy it’s super easy to query
                            your GraphQL-server.<br>
                            <br>
                            The WatchQuery handles pagination,
                            queryParameters, subscriptions and
                            caching out of the box.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="superhero">
            <div class="section pt-5 pb-5">
                <div class="row">
                    <div class="col-md-5">
                        <h3>Easy to use in templates</h3>
                        <p class="lead">
                            The WatchQuery is easy to use
                            in your Angular templates.<br>
                            <br>
                            Lorem ipsum
                        </p>
                    </div>
                    <div class="col-md-7">
                        <img src="https://i.imgur.com/glANTTw.png" width="100%" />
                    </div>
                </div>
            </div>
        </div>

        <div class="superhero red slope-top-rtl">
            <div class="section">
                <div class="row pt-5">
                    <div class="col-md-7">
                        <img src="https://i.imgur.com/glANTTw.png" width="100%" />
                    </div>
                    <div class="col-md-5">
                        <h3>Mutations with promises</h3>
                        <p class="lead">
                            If you need to run a mutation, you simply
                            <br>
                            TODO
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div class="superhero">
            <div class="section">
                <h3 style="text-align: center">Users of Buoy</h3>

                <div class="row pt-5">
                    <div class="col-md-2 p-3"><img src="../public/img/users/haff.svg" width="100%" /></div>
                    <div class="col-md-2 p-3"><img src="../public/img/users/haff.svg" width="100%" /></div>
                    <div class="col-md-2 p-3"><img src="../public/img/users/haff.svg" width="100%" /></div>
                    <div class="col-md-2 p-3"><img src="../public/img/users/haff.svg" width="100%" /></div>
                    <div class="col-md-2 p-3"><img src="../public/img/users/haff.svg" width="100%" /></div>
                    <div class="col-md-2 p-3"><img src="../public/img/users/haff.svg" width="100%" /></div>
                    <div class="col-md-2 p-3"><img src="../public/img/users/haff.svg" width="100%" /></div>
                    <div class="col-md-2 p-3"><img src="../public/img/users/haff.svg" width="100%" /></div>
                    <div class="col-md-2 p-3"><img src="../public/img/users/haff.svg" width="100%" /></div>
                    <div class="col-md-2 p-3"><img src="../public/img/users/haff.svg" width="100%" /></div>
                    <div class="col-md-2 p-3"><img src="../public/img/users/haff.svg" width="100%" /></div>
                    <div class="col-md-2 p-3"><img src="../public/img/users/haff.svg" width="100%" /></div>
                </div>

                <div style="text-align: center" class="pt-3">
                    <a href="#" class="heroBtn">See all --&gt;</a>
                </div>
            </div>
        </div>


        <div class="section">
            <div
                class="footer"
                v-if="data.footer"
            >
                {{ data.footer }}
            </div>
        </div>
    </div>
</template>

<script>
    import NavLink from './NavLink.vue'

    export default {
        components: { NavLink },

        computed: {
            data () {
                return this.$page.frontmatter
            },

            actionLink () {
                return {
                    link: this.data.actionLink,
                    text: this.data.actionText
                }
            }
        }
    }
</script>

<style lang="stylus">
    @import './styles/config.styl'

    .navbar.isHome
        // Remove background from navbar
        background transparent !important
        box-shadow none !important
        position absolute !important

    .superhero2
        position absolute

        top 0
        left 0
        width 100%

        .background
            background-color #1976d2;
            background linear-gradient(145deg,#0d47a1,#42a5f5);

            position absolute
            top 0
            left 0

            height calc(500px + 10vw)
            overflow hidden
            transform-origin 0
            width 100%
            z-index 10

            -webkit-transform: skewY(-6deg);

        .heroContent
            position absolute
            top $navbarHeight
            left 0
            width 100%
            z-index: 20
            text-align center

            .hero
                width 800px
                display inline-block

                .superheroLogo
                    height 390px
                    float left
                    max-height none
                    width 40%

                .intro
                    width 60%
                    text-align left
                    float left
                    color #FFF
                    padding-top 40px

                    h1
                        font-size 120px

                    p
                        font-size 30px

    .heroButton
        background-color #FFF
        text-transform uppercase
        font-size 18px
        box-shadow: 0 2px 5px 0 rgba(0,0,0,.26);
        //border-radius 50%
        border-radius 20px
        padding 0 24px 0 24px
        line-height 40px
        height 40px
        display inline-block
        color $mainColor
        font-weight bold

    .home
        // padding "calc(500px + 10vw + %s) 2rem 0" % $navbarHeight
        // max-width 960px
        padding 0
        margin 0px auto
        .hero.home
            text-align center
            img
                max-height 280px
                display block
                margin 3rem auto 1.5rem
            h1
                font-size 3rem
            h1, .description, .action
                margin 1.8rem auto
            .description
                max-width 35rem
                font-size 1.6rem
                line-height 1.3
                color lighten($textColor, 40%)
            .action-button
                display inline-block
                font-size 1.2rem
                color #fff
                background-color $accentColor
                padding 0.8rem 1.6rem
                border-radius 4px
                transition background-color .1s ease
                box-sizing border-box
                border-bottom 1px solid darken($accentColor, 10%)
                &:hover
                    background-color lighten($accentColor, 10%)
        .features
            border-top 1px solid $borderColor
            padding 1.2rem 0
            margin-top 2.5rem
            display flex
            flex-wrap wrap
            align-items flex-start
            align-content stretch
            justify-content space-between
        .feature
            flex-grow 1
            flex-basis 30%
            max-width 30%
            h2
                font-size 1.4rem
                font-weight 500
                border-bottom none
                padding-bottom 0
                color lighten($textColor, 10%)
            p
                color lighten($textColor, 25%)
        .footer
            padding 2.5rem
            border-top 1px solid $borderColor
            text-align center
            color lighten($textColor, 25%)

    @media (max-width: $MQMobile)
        .home
            .features
                flex-direction column
            .feature
                max-width 100%
                padding 0 2.5rem

    @media (max-width: $MQMobileNarrow)
        .home
            padding-left 1.5rem
            padding-right 1.5rem
            .hero
                img
                    max-height 210px
                    margin 2rem auto 1.2rem
                h1
                    font-size 2rem
                h1, .description, .action
                    margin 1.2rem auto
                .description
                    font-size 1.2rem
                .action-button
                    font-size 1rem
                    padding 0.6rem 1.2rem
            .feature
                h2
                    font-size 1.25rem
</style>
