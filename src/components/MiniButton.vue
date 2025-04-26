<script>
import Loader from './Loader.vue';

export default {
    name: 'MiniButton',
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
        class="transition-all px-2 py-1 rounded bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-800 disabled:bg-yellow-200 text-white mr-2"
    >
        <slot v-if="!loading" />
        <Loader v-else/>
    </button>
</template>