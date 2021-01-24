const { description } = require('../../package')

const users = require('./users.js');
const versioning = require('./lib/versioning.js'); // TODO: License??

module.exports = {
    /**
     * Ref：https://v1.vuepress.vuejs.org/config/#title
     */
    title: 'Buoy',
    /**
     * Ref：https://v1.vuepress.vuejs.org/config/#description
     */
    description: description,

    /**
     * Extra tags to be injected to the page HTML `<head>`
     *
     * ref：https://v1.vuepress.vuejs.org/config/#head
     */
    head: [
        ['meta', { name: 'theme-color', content: '#3eaf7c' }],
        ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
        ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }]
    ],

    /**
     * Theme configuration, here is the default theme configuration for VuePress.
     *
     * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
     */
    themeConfig: {
        editLinks: true,
        lastUpdated: 'Last Updated',
        repo: 'haffdata/buoy',      // GitHub repository
        npmPackage: '@buoy/client', // Main NPM package
        docsDir: 'docs/',           // docs folder inside repository
        editLinkText: 'Edit this page',
        nav: [
            {
                text: 'Features',
                link: '/features/'
            },
            {
                text: 'Docs',
                link: '/master/getting-started/introduction',
            },
            {
                text: 'Demo',
                link: '/demo/'
            },
            {
                text: 'Resources',
                link: '/resources/'
            },
        ],
        sidebar: versioning.sidebars,
        users: users
    },

    /**
     * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
     */
    plugins: [
        '@vuepress/plugin-back-to-top',
        '@vuepress/plugin-medium-zoom',
    ]
}
