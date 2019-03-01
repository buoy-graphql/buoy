<template>
    <div class="users">
        <div class="hero">
            <h1>Who is using Buoy?</h1>

            <p>Buoy handles the GraphQL queries and mutations for the following:</p>
        </div>

        <div class="users">
            <div
                class="user"
                v-for="user in users">
                <a :href="user.infoLink" :title="user.caption"
                   target="_blank"
                   :style="{backgroundImage: `url(${user.image})`}">
                </a>
            </div>
        </div>

        <div class="hero" style="padding-top: 30px;">
            <p>
                <strong>Is your project using Buoy, but not on the list?</strong><br>
                Edit this page with a <a href="">Pull Request</a> to add your logo.
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        title: 'AA',
        props: ['start'],

        // We have to copy the value because we can't use v-model with
        // nothing to bind to.
        // (VuePress doesn't have support for reactive page variables at the moment.)
        data() {
            return {
                value: this.start
            }
        },

        computed: {
            users () {

                console.log('USERS', this.$site);
                return this.$site.themeConfig.users
            }
        }
    }
</script>
