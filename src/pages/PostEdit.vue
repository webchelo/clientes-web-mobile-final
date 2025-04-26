<script>
import Loader from '../components/Loader.vue';
import MainH1 from '../components/MainH1.vue';
import SendButton from '../components/SendButton.vue';
import Subtitle from '../components/Subtitle.vue';
import MainLabel from '../components/MainLabel.vue';
import MainButton from '../components/MainButton.vue'
import { subscribeToAuth } from '../services/auth';
import { savePost, subscribeToAllPosts } from '../services/post';
import { getPostById } from '../services/post-content';
import { editPost } from '../services/post';

export default {
    name: 'PostEdit',
    components: { MainH1, Loader, SendButton, Subtitle, MainLabel, MainButton },
    data() {
        return {
            //newPost: {
            //    id: '',
            //    content: '',
            //    title: '',
            //},
            creatingPost: false,

            oldPost: {
                title: null,
                content: null,
                id: null,
            },
            postsLoaded: false,
            unsubscribeFromPosts: () => {},

            authUser: {
                id: null,
                email: null,
            },
            unsubscribeFromAuth: () => {},
        }
    },
    methods: {
        sendEditedPost() {
            this.creatingPost = true;

            editPost({
                content: this.oldPost.content,
                title: this.oldPost.title,
                id: this.oldPost.id,
            }, this.$route.params.id).then(() => this.creatingPost = false);
        },
        /**
         * 
         * @param {Date} date 
         */
        formatDate(date) {   
            return Intl.DateTimeFormat('es', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
            }).format(date).replace(',', '');
        },
    },
    async mounted() {
        this.oldPost = await getPostById(this.$route.params.id);
        this.unsubscribeFromAuth = subscribeToAuth(newUserData => this.authUser = newUserData);
    },
    unmounted() {
        this.unsubscribeFromPosts();
        this.unsubscribeFromAuth();
    }
}
</script>

<template>
    <MainH1>Posts</MainH1>
    <router-link :to="`/post/${oldPost.id}`"><MainButton>Volver</MainButton></router-link>
    <section>
        <div class="flex gap-8 justify-between">
            <section class="w-3/12">
                <Subtitle>Modificar Post</Subtitle>
                <form 
                    action="#"
                    @submit.prevent="sendEditedPost"
                >
                    <div class="mb-3">
                        <span
                            class="block mb-2"
                        >Email</span>
                        <span>{{ authUser.email }}</span>
                    </div>
                    <div class="mb-3">
                        <MainLabel 
                            for="title"
                            class="block mb-2"
                        >Título</MainLabel>
                        <input
                            id="title"
                            class="w-full p-2 border border-gray-300 rounded disabled:bg-gray-100"
                            :disabled="creatingPost"
                            v-model="oldPost.title"
                            required
                        />
                    </div>
                    <div class="mb-3">
                        <MainLabel 
                            for="post"
                            class="block mb-2"
                        >Mensaje</MainLabel>
                        <textarea 
                            id="post"
                            class="w-full p-2 border border-gray-300 rounded disabled:bg-gray-100"
                            :disabled="creatingPost"
                            v-model="oldPost.content"
                            required
                        ></textarea>
                    </div>
                    <SendButton 
                        :disabled="creatingPost"
                    >
                        <template   v-if="!creatingPost">Enviar</template>
                        <Loader     v-else />
                    </SendButton>
                </form>
            </section>
        </div>
    </section>
</template>