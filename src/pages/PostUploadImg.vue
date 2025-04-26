<script>
import Loader from '../components/Loader.vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainLabel from '../components/MainLabel.vue';
import { subscribeToAuth } from '../services/auth';
import { savePost, subscribeToAllPosts, updateImg } from '../services/post';
import { createComment, getPostById, subscribeToComments } from '../services/post-content';

export default {
    name: 'PostUploadImg',
    components: { MainH1, Loader, MainButton, MainLabel },
    data() {
        return {
            newComment: {
                comment: '',
            },
            creatingPost: false,

            img: null,
            imgPreview: null,
            uploadingImg: false,

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
        async handleFileUpload() {
            this.uploadingImg = true;
            try {
                await updateImg(this.img, this.$route.params.id);
            } catch (error) {
                console.error('[PostUploadImg] Error al subir foto:', error)
            }
            this.uploadingImg = false;
        }
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
    <h1 class="text-4xl">Subir una foto</h1>

    <form 
        action="#"
        @submit.prevent="handleFileUpload"
    >
    <div class="mb-3">
        <MainLabel 
            for="img"
            class="block mb-2"
        >Imagen a subir</MainLabel>
        <input
            type="file"
            id="img"
            :read-only="uploadingPhoto"
            @change="handleFileSelection"
        >
    </div>

    <MainButton>Enviar</MainButton>
    </form>
</template>