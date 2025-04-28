<script>
import Loader from '../components/Loader.vue';
import MainH1 from '../components/MainH1.vue';
import Subtitle from '../components/Subtitle.vue';
import MainSpan from '../components/MainSpan.vue';
import SendButton from '../components/SendButton.vue';
import MainLabel from '../components/MainLabel.vue';
import MiniButton from '../components/MiniButton.vue';
import AlertPop from '../components/AlertPop.vue'
import { subscribeToAuth } from '../services/auth';
import { savePost, subscribeToAllPosts, updateImg, updatePostImg } from '../services/post';

export default {
    name: 'Posts',
    components: { MainH1, Loader, Subtitle, MainSpan, SendButton, MainLabel, MiniButton, AlertPop },
    data() {
        return {
            newPost: {
                id: '',
                content: '',
                title: '',
            },
            creatingPost: false,

            img: null,
            imgPreview: null,
            uploadingImg: false,

            posts: [],
            postsLoaded: false,
            unsubscribeFromPosts: () => {},

            authUser: {
                id: null,
                email: null,
            },
            unsubscribeFromAuth: () => {},

            wrongPostCreation: false,
        }
    },
    methods: {
        async sendPost() {
    
    if (!this.newPost.title.trim() || !this.newPost.content.trim()) {
        this.wrongPostCreation = true;
        return;
    }
    
    this.creatingPost = true;
    this.wrongPostCreation = false; 
    
    try {
        
        const postId = await savePost({
            user_id: this.authUser.id,
            email: this.authUser.email,
            displayName: this.authUser.displayName,
            content: this.newPost.content,
            title: this.newPost.title,
        });
        
        
        if (this.img) {
            this.uploadingImg = true;
            await updateImg(this.img, postId);
        }
        
        
        this.$router.push(`/post/${postId}`);
        
        
        this.resetForm();
        
    } catch (error) {
        console.error("Error al crear el post:", error);
        this.wrongPostCreation = true;
    } finally {
        this.creatingPost = false;
        this.uploadingImg = false;
    }
},
        resetForm() {
            this.newPost.title = "";
            this.newPost.content = "";
            this.img = null;
            this.imgPreview = null;
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
            const file = event.target.files[0];
            if (!file) return;
            
            this.img = file;
            
            const reader = new FileReader();
            reader.onload = (e) => {
            this.imgPreview = e.target.result;
            };
            reader.readAsDataURL(file);
        }   
    },
    computed: {
        sortedPosts() {
            return [...this.posts].sort((a, b) => b.created_at - a.created_at);
        }
    },
    mounted() {
        this.unsubscribeFromPosts = subscribeToAllPosts(newPosts => {
            this.posts = newPosts;
            this.postsLoaded = true;
        });

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

    <section>
        <div class="flex flex-col">
            <section>
                <Subtitle>Crear un Post</Subtitle>
                <form 
                    action="#"
                    @submit.prevent="sendPost"
                >
                    <div class="mb-3">
                        <MainSpan>Creador:</MainSpan>
                        <p>{{ authUser.email }}</p>
                    </div>
                    <div class="mb-3">
                        <MainLabel 
                            for="title"
                        >Título:</MainLabel>
                        <input
                            id="title"
                            class="w-30 p-2 border border-orange-300 rounded disabled:bg-gray-100"
                            :disabled="creatingPost"
                            v-model="newPost.title"
                            
                        />
                    </div>
                    <div class="mb-3">
                        <MainLabel 
                            for="post"
                        >Contenido:</MainLabel>
                        <textarea 
                            id="post"
                            class="w-full p-2 border border-orange-300 rounded disabled:bg-gray-100"
                            :disabled="creatingPost"
                            v-model="newPost.content"
                            
                        ></textarea>
                    </div>

                    <div class="mb-3">
                        <MainLabel for="img" class="block mb-2">Imagen del Post (Opcional)</MainLabel>
                                 
                        <input
                            type="file"
                            id="img"
                            accept="image/*"
                            @change="handleFileSelection"
                            :disabled="creatingPost"
                            class="mb-2"
                        >
                                   
                        <div v-if="imgPreview" class="mt-2">
                            <img :src="imgPreview" alt="Vista previa" class="max-h-40 rounded border border-gray-300">
                            <button 
                            @click="img = null; imgPreview = null" 
                            class="text-red-500 text-sm mt-1"
                            >
                            Eliminar imagen
                            </button>
                        </div>
                    </div>
                    
                    <AlertPop v-if="wrongPostCreation">Error al crear el Post: Falta alguno de los datos requeridos.</AlertPop>

                    <SendButton 
                        :disabled="creatingPost"
                    >
                        <template   v-if="!creatingPost">Crear</template>
                        <Loader     v-else />
                    </SendButton>

                </form>
            </section>
            <section>
                <h2 class="sr-only">Lista de Posts</h2>
                
                <div 
                    class="border rounded mt-4 min-h-[400px]"
                >
                <Subtitle>Explorar</Subtitle>
                    <ul 
                        v-if="postsLoaded"
                    >
                    <li v-for="post in sortedPosts" class="mb-4 border border-gray-300 p-4 rounded shadow-xl">
                        <router-link :to="`/post/${post.id}`">
                            <div class="flex justify-between">
                            <div>
                                <h2 class="text-2xl font-bold">{{ post.title }}</h2>
                                <p class="text-gray-600 mb-2">
                                Por 
                                <router-link :to="`/usuario/${post.user_id}`" class="text-blue-600">
                                    {{ post.displayName ? post.displayName : post.email.split('@')[0] }}
                                </router-link>
                                </p>
                                <p class="mb-3">{{ post.content }}</p>
                                
                                <div v-if="post.img" class="mt-2">
                                <img :src="post.img" alt="Imagen del post" class="max-h-40 rounded border border-gray-300">
                                </div>
                            </div>
                            
                            <div class="text-sm text-gray-500">
                                {{ formatDate(post.created_at) }}
                            </div>
                            </div>
                            
                            <div v-if="authUser.email === post.email" class="mt-2">
                            <router-link :to="`/edit/${post.id}`">
                                <MiniButton>Editar contenido</MiniButton>
                            </router-link>
                            </div>
                        </router-link>
                        </li>
                    </ul>
                    <Loader v-else/>
                </div>
            </section>
        </div>
    </section>
</template>