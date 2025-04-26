<script>
import Loader from '../components/Loader.vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MiniButton from '../components/MiniButton.vue';
import Subtitle from '../components/Subtitle.vue';
import { subscribeToAuth } from '../services/auth';
import { savePost, subscribeToAllPosts } from '../services/post';
import { createComment, getPostById, subscribeToComments } from '../services/post-content';

export default {
    name: 'Post',
    components: { MainH1, Loader, MainButton, MiniButton, Subtitle },
    data() {
        return {
            newComment: {
                comment: '',
            },
            creatingPost: false,

            post: {
                id: null,
                email: null,
                content: null,
                title: null,
                comments: null,
                img: null,
            },
            postsLoaded: false,
            unsubscribeFromComments: () => {},

            authUser: {
                id: null,
                email: null,
            },
            unsubscribeFromAuth: () => {},
        }
    },
    methods: {
        sendComment() {
            createComment(this.post.id, {
                user_id: this.authUser.id,
                email: this.authUser.email,
                comment: this.newComment.comment,
            })
            this.newComment.comment = "";
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
        handleFileSelection(event) {
            this.img = event.target.files[0];
            
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                this.imgPreview = reader.result;
            });
            reader.readAsDataURL(this.img);
        },
    },
    async mounted() {
        this.post = await getPostById(this.$route.params.id);
        this.unsubscribeFromComments = await subscribeToComments(this.post.id, (commentsData) => {
            this.post.comments = commentsData.comments;
        });
        this.unsubscribeFromAuth = subscribeToAuth(newUserData => this.authUser = newUserData);
    },
    unmounted() {       
        this.unsubscribeFromComments();
        this.unsubscribeFromAuth();
    }
}
</script>

<template>
    <MainH1 class="mb-1 mt-4">{{ post.title }}</MainH1>
    
    <p>Por {{ post.email }}</p>
    <p class="mb-2">{{ post.content }}</p>

    <router-link :to="`/posts/editar/foto/${post.id}`" v-if="authUser.email === post.email">
        <template v-if="post.img">
            <MiniButton>Modificar foto</MiniButton>
        </template>
        <template v-else>
            <MiniButton>Subir una foto</MiniButton>
        </template>
    </router-link>

    <div class="mt-4" v-if="post.img">
        <img :src="post.img" alt="" class="w-[30rem] rounded border border-4 border-yellow-600">
    </div>

    <Subtitle class="mt-4">Comentarios</Subtitle>
    <ul>
        <li
            v-for="comments in post.comments"
            class="border border-gray-300 p-4 mb-4 shadow-xl"
        >
            <p><router-link :to="`/usuario/${comments.user_id}`">{{ comments.email }}:</router-link> {{ comments.comment }}</p>
            <div>{{ formatDate(comments.created_at) }}</div>
        </li>
    </ul>
    <form 
        action="#"
        @submit.prevent="sendComment"
    >
        <textarea
            name="comment"
            id="comment"
            v-model="newComment.comment"
            class="border border-yellow-600 mt-4 block w-[30rem]"
        ></textarea>
        
        <MainButton class="mt-4">Enviar</MainButton>
    </form>
</template>