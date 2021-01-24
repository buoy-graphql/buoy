<template>
    <header class="navbar" :class="navbarClass">
        <div class="d-flex">
            <SidebarButton @toggle-sidebar="$emit('toggle-sidebar')"/>

            <router-link
                :to="$localePath"
                class="home-link"
            >
                <img
                    class="logo"
                    src="https://i.imgur.com/J60bKnP.png"
                />
                <img
                    class="logo"
                    v-if="$site.themeConfig.logo"
                    :src="$withBase($site.themeConfig.logo)"
                    :alt="$siteTitle"
                >
            </router-link>

            <NavLinks class="can-hide" />

            <div class="flex-fill"></div>

            <AlgoliaSearchBox
                v-if="isAlgoliaSearch"
                :options="algolia"
            />
            <SearchBox v-else-if="$site.themeConfig.search !== false && $page.frontmatter.search !== false" />

            <div class="link-icons can-hide">
                <a :href="'https://github.com/' + $site.themeConfig.repo" target="new" class="icon-link">
                    <font-awesome-icon :icon="{prefix: 'fab', iconName:'github'}"></font-awesome-icon>
                </a>
                <a :href="'https://npmjs.com/package/' + $site.themeConfig.npmPackage" target="new" class="icon-link">
                    <font-awesome-icon :icon="{prefix: 'fab', iconName:'npm'}"></font-awesome-icon>
                </a>
            </div>
        </div>




        <div
            class="ml-auto"
            :style="linksWrapMaxWidth ? {
        'max-width': linksWrapMaxWidth + 'px'
      } : {}"
        >

        </div>
    </header>
</template>

<script>
import AlgoliaSearchBox from '@AlgoliaSearchBox'
import SearchBox from '@SearchBox'
import SidebarButton from '@theme/components/SidebarButton.vue'
import NavLinks from '@theme/components/NavLinks.vue'
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
                this.linksWrapMaxWidth = this.$el.offsetWidth - NAVBAR_VERTICAL_PADDING
                    - (this.$refs.siteName && this.$refs.siteName.offsetWidth || 0)
            }
        }
        handleLinksWrapWidth()
        window.addEventListener('resize', handleLinksWrapWidth, false)
    },
    computed: {
        algolia () {
            return this.$themeLocaleConfig.algolia || this.$site.themeConfig.algolia || {}
        },
        isAlgoliaSearch () {
            return this.algolia && this.algolia.apiKey && this.algolia.indexName
        },
        navbarClass () {
            return this.$router.currentRoute.path === '/' ? 'on-home' : '';
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
$navbar-vertical-padding = 0.7rem
$navbar-horizontal-padding = 1.5rem
.navbar
    padding $navbar-vertical-padding $navbar-horizontal-padding
    line-height $navbarHeight - 1.4rem
    a, span, img
        display inline-block
    .logo
        height $navbarHeight - 1.4rem
        min-width $navbarHeight - 1.4rem
        margin-right 0.8rem
        vertical-align top
        margin-top: 6px;
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
        right $navbar-horizontal-padding
        top $navbar-vertical-padding
        display flex
        .search-box
            flex: 0 0 auto
            vertical-align top
@media (max-width: $MQMobile)
    .navbar
        padding-left 4rem
        .can-hide
            display none
        .links
            padding-left 1.5rem
</style>


<style lang="scss">
.navbar {
    height: 64px;
    z-index: 90;
    background-color: #1976d2 !important;

    .sidebar-button {
        margin-top: 4px;
        color: #FFF;
    }

    &.on-home {
        background-color: transparent !important;
        border-bottom: 0;
        position: absolute;

        .site-name {
            color: #FFF;
        }

    }

    .logo {

    }

    .nav-links {
        .nav-item {
            margin-left: 4px;
            a.nav-link {
                color: #FFF;
                border-radius: 4px;
                padding: 8px 16px;
                text-transform: uppercase;
                border-bottom: none !important;
                font-weight: 400;

                &:hover {
                    background: hsla(0,0%,100%,.15);
                }
            }
        }
    }

    .search-box {
        padding-top: 4px;

        input {
            width: 180px;
            border: none;

            &:focus {
                width: 240px;
            }
        }
    }

    .link-icons {
        padding-top: 8px;
        .icon-link {
            color: #FFF;
            margin-left: 16px;

            &:hover {
                color: #d1e4f6;
            }

            svg {
                height: 24px;
                width: 24px;
            }
        }
    }
}
</style>

