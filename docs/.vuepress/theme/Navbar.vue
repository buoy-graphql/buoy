<template>
    <header class="navbar" v-bind:class="{isHome: isHome}">
        <SidebarButton @toggle-sidebar="$emit('toggle-sidebar')"/>

        <router-link
            :to="$localePath"
            class="home-link"
        >
            <img
                class="logo"
                v-if="$site.themeConfig.logo"
                :src="$withBase($site.themeConfig.logo)"
                :alt="$siteTitle"
            >
        </router-link>

        <div
            class="links"
            :style="{'max-width': linksWrapMaxWidth + 'px'}">
            <NavLinks class="can-hide"/>
            <AlgoliaSearchBox
                v-if="isAlgoliaSearch"
                :options="algolia"
            />
        </div>

        <div
            class="rightLinks"
            :style="{'max-width': linksWrapMaxWidth + 'px'}">
            <AlgoliaSearchBox
                v-if="isAlgoliaSearch"
                :options="algolia"
            />
            <SearchBox v-else-if="$site.themeConfig.search !== false"/>

            <div class="link-icons">
                <a href="https://github.com/alberthaff/ngx-buoy" target="new" class="iconLink">
                    <font-awesome-icon :icon="{prefix: 'fab', iconName:'github'}" size="2x"></font-awesome-icon>
                </a>
                <a href="https://npmjs.com/package/ngx-buoy" target="new" class="iconLink">
                    <font-awesome-icon :icon="{prefix: 'fab', iconName:'npm'}" size="2x"></font-awesome-icon>
                </a>
            </div>
        </div>
    </header>
</template>

<script>
    import SidebarButton from './SidebarButton.vue'
    import AlgoliaSearchBox from '@AlgoliaSearchBox'
    import SearchBox from './SearchBox.vue'
    import NavLinks from './NavLinks.vue'

    export default {
        components: { SidebarButton, NavLinks, SearchBox, AlgoliaSearchBox },

        data () {
            return {
                linksWrapMaxWidth: null
            }
        },

        mounted () {
            const MOBILE_DESKTOP_BREAKPOINT = 719 // refer to config.styl
            const NAVBAR_VERTICAL_PADDING = parseInt(css(this.$el, 'paddingLeft')) + parseInt(css(this.$el, 'paddingRight'))
            const handleLinksWrapWidth = () => {
                if (document.documentElement.clientWidth < MOBILE_DESKTOP_BREAKPOINT) {
                    this.linksWrapMaxWidth = null
                } else {
                    this.linksWrapMaxWidth = this.$el.offsetWidth - NAVBAR_VERTICAL_PADDING -
                        (this.$refs.siteName && this.$refs.siteName.offsetWidth || 0)
                }
            }
            handleLinksWrapWidth()
            window.addEventListener('resize', handleLinksWrapWidth, false)
        },

        computed: {
            isHome() {
                console.log('FRONT', this.$page.frontmatter.home); // TODO change class of navbar
                return this.$page.frontmatter.home;
            },
            algolia () {
                return this.$themeLocaleConfig.algolia || this.$site.themeConfig.algolia || {}
            },

            isAlgoliaSearch () {
                return this.algolia && this.algolia.apiKey && this.algolia.indexName
            }
        }
    }

    function css (el, property) {
        // NOTE: Known bug, will return 'auto' if style value is 'auto'
        const win = el.ownerDocument.defaultView
        // null means not to return pseudo styles
        return win.getComputedStyle(el, null)[property]
    }
</script>

<style lang="stylus">
    @import './styles/config.styl'

    $navbar-vertical-padding = 0.7rem
    $navbar-horizontal-padding = 1.5rem

    .navbar
        padding $navbar-vertical-padding $navbar-horizontal-padding
        line-height $navbarHeight - 1.4rem
        position relative
        a, span, img
            display inline-block
        .logo
            height $navbarHeight - 1.4rem
            min-width $navbarHeight - 1.4rem
            margin-right 0.8rem
            vertical-align top
        .site-name
            font-size 1.3rem
            font-weight 600
            color $textColor
            position relative
        .links
            padding-left 1.5rem
            box-sizing border-box
            white-space nowrap
            font-size 0.9rem
            position absolute
            left 200px
            top $navbar-vertical-padding
            display flex
            .nav-links
                flex 1

        .rightLinks
            padding-left 1.5rem
            box-sizing border-box
            white-space nowrap
            font-size 0.9rem
            position absolute
            right $navbar-horizontal-padding
            top $navbar-vertical-padding
            display flex
            .search-box
                flex: 0 0 auto
                vertical-align top
            .nav-links
                flex 1

        a.iconLink
            color #FFF
            padding-left 0.6rem
            margin-top 0.23rem

            &:hover
                color: $navBarAltColor
            //

    @media (max-width: $MQMobile)
        .navbar
            padding-left 4rem
            .can-hide
                display none
            .links
                padding-left 1.5rem
</style>
