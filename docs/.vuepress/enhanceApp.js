import { library } from '@fortawesome/fontawesome-svg-core'
// import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faGithub, faNpm } from '@fortawesome/fontawesome-free-brands'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default ({
    Vue, // the version of Vue being used in the VuePress app
    options, // the options for the root Vue instance
    router, // the router instance for the app
    siteData // site metadata
}) => {
    library.add(faGithub, faNpm)
    Vue.component('font-awesome-icon', FontAwesomeIcon)
}
