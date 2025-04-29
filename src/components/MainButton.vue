<script>
import Loader from './Loader.vue';

export default {
    name: 'MainButton',
    components: {Loader},
    props: {
        loading: {
            type: Boolean,
            default: false,
        }
    }
}
</script>

<template>
    <button 
        type="submit" 
        class="px-8 py-4 text-lg md:text-xl hover:scale-105 transform transition rounded bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-800 disabled:bg-yellow-200 text-white"
    >
        <slot v-if="!loading" />
        <Loader v-else/>
    </button>
</template>
