<template>
    <section class="view-base">

        <main>
            <section class="body">
                <router-view></router-view>
            </section>
        </main>
        <popup></popup>
        <snackbars></snackbars>

    </section>
</template>

<script>
    export default {
        data(){ return {
            mobileMode:window.innerWidth <= 760
        }}
    }
</script>

<style lang="scss">

</style>