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
import AlertPop from '../components/AlertPop.vue';

export default {
    name: 'PostEdit',
    components: { MainH1, Loader, SendButton, Subtitle, MainLabel, MainButton, AlertPop },
    data() {
        return {
            creatingPost: false,
            showValidationError: false, 

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
        async sendEditedPost() {
            
            if (!this.oldPost.title?.trim() || !this.oldPost.content?.trim()) {
                this.showValidationError = true;
                return; 
            }

            this.creatingPost = true;
            this.showValidationError = false;

            try {
                await editPost({
                    content: this.oldPost.content,
                    title: this.oldPost.title,
                    id: this.oldPost.id,
                }, this.$route.params.id);
                
                this.$router.push(`/post/${this.oldPost.id}`);
            } catch (error) {
                console.error("Error al editar el post:", error);
                this.showValidationError = true;
            } finally {
                this.creatingPost = false;
            }
        },
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
                        <span class="block mb-2">Email</span>
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
                        ></textarea>
                    </div>
                    
                    <AlertPop v-if="showValidationError">
                        Hay un error en la edición del Post: Todos los campos son requeridos.
                    </AlertPop>
                    
                    <SendButton :disabled="creatingPost">
                        <template v-if="!creatingPost">Enviar</template>
                        <Loader v-else />
                    </SendButton>
                </form>
            </section>
        </div>
    </section>
</template>