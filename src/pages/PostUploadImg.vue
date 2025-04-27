<script>
import AlertPop from '../components/AlertPop.vue';
import Loader from '../components/Loader.vue';
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainLabel from '../components/MainLabel.vue';
import { subscribeToAuth } from '../services/auth';
import { savePost, subscribeToAllPosts, updateImg } from '../services/post';
import { createComment, getPostById, subscribeToComments } from '../services/post-content';

export default {
    name: 'PostUploadImg',
    components: { MainH1, Loader, MainButton, MainLabel, AlertPop },
    data() {
        return {
            newComment: {
                comment: '',
            },
            creatingPost: false,

            img: null,
            imgPreview: null,
            uploadingImg: false,
            showValidationError: false,

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
        
        formatDate(date) {
            return Intl.DateTimeFormat('es', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
            }).format(date).replace(',', '');
        },
        
        handleFileSelection(event) {
            this.img = event.target.files[0];
            this.showValidationError = false;
    
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                this.imgPreview = reader.result;
            });
            reader.readAsDataURL(this.img);
        },
        
        async handleFileUpload() {
            
            if (!this.img) {
                this.showValidationError = true;
                return; 
            }

            this.uploadingImg = true;
            this.showValidationError = false;
            
            try {
                await updateImg(this.img, this.$route.params.id);
                
                this.$router.push(`/post/${this.post.id}`);
            } catch (error) {
                console.error('[PostUploadImg] Error al subir foto:', error);
                this.showValidationError = true;
            } finally {
                this.uploadingImg = false;
            }
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
    <router-link :to="`/post/${post.id}`"><MainButton>Volver</MainButton></router-link>
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
                accept="image/*"
                :disabled="uploadingImg"
                @change="handleFileSelection"
                class="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-orange-50 file:text-orange-700
                    hover:file:bg-orange-100"
            >
        </div>

        <AlertPop v-if="showValidationError">
            Error: Debes seleccionar una imagen válida para subir
        </AlertPop>

        <MainButton :disabled="uploadingImg">
            <span v-if="!uploadingImg">Subir imagen</span>
            <Loader v-else />
        </MainButton>
    </form>
</template>