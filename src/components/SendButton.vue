<script>
import Loader from './Loader.vue';

export default {
    name: 'SendButton',
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
        class="transition-all w-30 px-4 py-2 rounded bg-yellow-600 hover:bg-yellow-500 active:bg-yellow-800 disabled:bg-yellow-200 text-white disabled:black"
    >
        <slot v-if="!loading" />
        <Loader v-else/>
    </button>
</template>