<template>
    <main class="home" aria-labelledby="main-title">
        <Navbar />

        <div class="home-hero">
            <div class="hero-background">
                <div class="background"></div>
            </div>
            <div class="container">
                <div class="row">
                    <div class="col-md-5" style="text-align: center">
                        <img class="superheroLogo" src="/img/icon.svg" width="100%" />
                    </div>
                    <div class="col-md-7 hero-text d-none d-md-block">
                        <h1 class="">Buoy</h1>
                        <p>A GraphQL client for Angular</p>

                        <a href="/master/getting-started/installation" class="hero-button">Get started</a>
                    </div>
                    <div class="col-md-7 hero-text d-md-none" style="text-align: center">
                        <p>A GraphQL client for Angular</p>
                        <a href="/master/getting-started/installation" class="hero-button">Get started</a>
                    </div>
                </div>
            </div>
        </div>

        <section class="feature" style="margin-top: -190px">
            <div class="container pb-5">
                <div class="row">
                    <div class="col-lg-6">
                        <h3>Built on Apollo</h3>
                        <p>Buoy adds a bunch of features and automation on top of what Apollo already provides.</p>
                    </div>
                    <div class="col-lg-6">
                        <img src="/img/home/apollo.svg" width="100%">
                    </div>
                </div>
            </div>
        </section>

        <section class="feature red slope-top-rtl slope-bottom-rtl">
            <div class="container">
                <div class="row">
                    <div class="col-lg-6">
                        <img src="/img/home/subscribe.png" width="100%">
                    </div>
                    <div class="col-lg-6">
                        <h3>Easy to use</h3>
                        <p>
                            With Buoy it’s super easy to query your GraphQL-server.
                        </p>
                        <p>
                            The WatchQuery handles pagination, route changes and caching out of the box.<br>
                            And by adding the @subscribe directive, Buoy will dynamically subscribe to model changes via GraphQL subscriptions.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section class="feature" style="margin-top: -130px; margin-bottom: 30px">
            <div class="container pb-5">
                <div class="row">
                    <div class="col-lg-6">
                        <h3>Subscriptions</h3>
                        <p>
                            Buoy is fully compatible with Lighthouse subscriptions.
                        </p>
                        <p>
                            Since the subscriptions are driver-based, other standards can easily be implemented.
                        </p>
                    </div>
                    <div class="col-lg-6">
                        <img src="/img/home/todo.png" width="100%">
                    </div>
                </div>
            </div>
        </section>

        <section class="feature red slope-top-rtl">
            <div class="container">
                <div class="row">
                    <div class="col-lg-6">
                        <img src="/img/home/todo.png" width="100%">
                    </div>
                    <div class="col-lg-6">
                        <h3>Middleware</h3>
                        <p>
                            In some cases it can be necessary to handle stuff globally, eg. authentication errors.
                        </p>
                        <p>
                            With Buoy middleware, you can manipulate the HTTP requests pre- &amp; post-flight.<br>
                            You can also manipulate all GraphQL operations and their variables before execution.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section class="mb-3">
            <div class="container mt-5">
                <h3 style="text-align: center">Users of Buoy</h3>
                <div class="row pt-5">
                    <div class="col-lg-4"></div>
                    <div class="col-md-2 col-sm-4 col-6 p-3" v-for="user of $site.themeConfig.users">
                        <div style="width: 100%; height: 100%; position:relative; background-color: red">
                            <img :src="user.image" :title="user.caption" width="100%" style="top: 50%; position: absolute; transform: translateY(-50%);" />
                        </div>
                    </div>
                </div>

                <!--<div style="text-align: center" class="pt-3">
                    <a href="#" class="heroBtn">See all --&gt;</a>
                </div>-->
            </div>
        </section>

        <div class="container pt-5">

            <div
                class="footer"
                v-if="data.footer"
            >
                {{ data.footer }}
            </div>
        </div>
    </main>
</template>

<script>
import NavLink from '@theme/components/NavLink.vue'
import Navbar from '@theme/components/Navbar.vue'
export default {
    components: {NavLink, Navbar },
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

<style lang="scss">
.home-hero {
    position: relative;
    width: 100%;

    .container {
        padding-top: 68px;
        padding-bottom: 230px;
    }
    .hero-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        overflow: hidden;

        .background {
            background-color: #1976d2;
            background: linear-gradient(145deg, #0d47a1, #42a5f5);
            height: 100%;
            transform: rotate(-6deg);
            width: 150%;
            margin-left: -25%;
            margin-top: -200px;
        }
    }
}
.hero-button {
    background-color: #FFF;
    text-transform: uppercase;
    font-size: 18px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, .26);
    //border-radius 50%
    border-radius: 20px;
    padding: 0 24px 0 24px;
    line-height: 40px;
    height: 40px;
    display: inline-block;
    color: #1976d2;
    font-weight: bold;

    &:hover {
        color: #6e6e6e;
        opacity: .9;
    }
}
.hero-text {
    color: #FFF;
    font-size: 2rem;
    h1 {
        font-size: 8vw;
        margin-bottom: 0;
    }
}

.home {
    h3 {
        font-size: 1.6rem;
        text-transform: uppercase;
        font-weight: 500;
    }
}

@media screen and (min-width: 1600px) {
    .hero-text {
        font-size: 2rem;
        h1 {
            font-size: 8rem;
        }
    }
}


.feature {
    position: relative !important;
    padding-top: 75px;
    padding-bottom: 75px;

    &.red {
        background-color: #dc1431;
        color: #FFF;
    }

    &.slope-top-rtl {
        &::before {
            z-index: 1;
            position: absolute;
            content: " ";
            display: block;
            left: 0;
            top: -100px;
            width: 100%;
            border-style: solid;
            border-width: 0 100vw 100px 0;
            border-color: transparent transparent #dc1431 transparent;
        }
    }

    &.slope-bottom-rtl {
        margin-bottom: 200px;
        &::after {

            z-index: 1;
            position: absolute;
            content: " ";
            display: block;
            left: 0;
            bottom: -100px;
            width: 100%;
            border-style: solid;
            border-width: 0 0 100px 100vw;
            border-color: transparent transparent transparent #dc1431;
        }
    }
}

.footer {
    border-top: 2px solid #000;
    padding-top: 10px;
    margin-top: 30px;
    margin-bottom: 30px;
    text-align: center;
}


</style>
