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
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-6xl mx-auto">
            <!-- Header -->
            <div class="text-center mb-8">
                <MainH1 class="text-3xl font-extrabold text-gray-900">Comunidad de Posts</MainH1>
                <p class="mt-2 text-lg text-gray-600">Comparte tus ideas y descubre lo que otros están publicando</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Sección de creación de posts -->
                <div class="lg:col-span-1">
                    <section class="bg-white p-6 rounded-xl shadow-md">
                        <Subtitle class="text-xl font-semibold text-gray-800 mb-4">Crear un nuevo Post</Subtitle>
                        
                        <form @submit.prevent="sendPost" class="space-y-4">
                            <div>
                                <MainLabel class="block text-sm font-medium text-gray-700 mb-1">Autor</MainLabel>
                                <p class="text-gray-900 font-medium">{{ authUser.email }}</p>
                            </div>
                            
                            <div>
                                <MainLabel for="title" class="block text-sm font-medium text-gray-700 mb-1">Título</MainLabel>
                                <input
                                    id="title"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                                    :disabled="creatingPost"
                                    v-model="newPost.title"
                                    placeholder="Título interesante..."
                                    required
                                />
                            </div>
                            
                            <div>
                                <MainLabel for="post" class="block text-sm font-medium text-gray-700 mb-1">Contenido</MainLabel>
                                <textarea 
                                    id="post"
                                    rows="4"
                                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100"
                                    :disabled="creatingPost"
                                    v-model="newPost.content"
                                    placeholder="Escribe tu contenido aquí..."
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <MainLabel class="block text-sm font-medium text-gray-700 mb-1">Imagen (Opcional)</MainLabel>
                                <label class="flex flex-col items-center px-4 py-3 bg-white rounded-md border border-dashed border-gray-300 cursor-pointer hover:border-orange-400 transition-colors">
                                    <span class="text-sm text-gray-600 mb-1">Haz clic para seleccionar una imagen</span>
                                    <input
                                        type="file"
                                        id="img"
                                        accept="image/*"
                                        @change="handleFileSelection"
                                        :disabled="creatingPost"
                                        class="hidden"
                                    >
                                    <span v-if="!imgPreview" class="text-xs text-gray-500">Formatos: JPG, PNG, GIF</span>
                                </label>
                                
                                <div v-if="imgPreview" class="mt-3">
                                    <div class="relative">
                                        <img :src="imgPreview" alt="Vista previa" class="w-full h-auto max-h-60 object-contain rounded-md border border-gray-200">
                                        <button 
                                            @click="img = null; imgPreview = null" 
                                            class="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition-colors"
                                            type="button"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <AlertPop v-if="wrongPostCreation" class="mt-2">
                                Error: Debes completar el título y el contenido del post.
                            </AlertPop>

                            <div class="pt-2">
                                <SendButton 
                                    type="submit"
                                    class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                                    :disabled="creatingPost"
                                >
                                    <span v-if="!creatingPost">Publicar Post</span>
                                    <Loader v-else />
                                </SendButton>
                            </div>
                        </form>
                    </section>
                </div>

                <!-- Sección de lista de posts -->
                <div class="lg:col-span-2">
                    <section class="bg-white p-6 rounded-xl shadow-md">
                        <Subtitle class="text-xl font-semibold text-gray-800 mb-4">Posts Recientes</Subtitle>
                        
                        <div v-if="!postsLoaded" class="flex justify-center py-12">
                            <Loader />
                        </div>
                        
                        <ul v-else class="space-y-4">
                            <li 
                                v-for="post in sortedPosts" 
                                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                                <router-link :to="`/post/${post.id}`" class="block">
                                    <div class="flex flex-col sm:flex-row sm:justify-between gap-4">
                                        <div class="flex-1">
                                            <div class="flex items-start gap-3">
                                                <div class="flex-shrink-0">
                                                    <div class="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                                        {{ post.displayName ? post.displayName.charAt(0) : post.email.charAt(0).toUpperCase() }}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h2 class="text-lg font-bold text-gray-900 hover:text-orange-600 transition-colors">{{ post.title }}</h2>
                                                    <p class="text-sm text-gray-600">
                                                        Por 
                                                        <router-link 
                                                            :to="`/usuario/${post.user_id}`" 
                                                            class="font-medium text-orange-600 hover:text-orange-700"
                                                        >
                                                            {{ post.displayName ? post.displayName : post.email.split('@')[0] }}
                                                        </router-link>
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <p class="mt-3 text-gray-700 line-clamp-3">{{ post.content }}</p>
                                            
                                            <div v-if="post.img" class="mt-3">
                                                <img 
                                                    :src="post.img" 
                                                    alt="Imagen del post" 
                                                    class="max-h-60 w-auto rounded-lg border border-gray-200"
                                                >
                                            </div>
                                        </div>
                                        
                                        <div class="flex flex-col items-end">
                                            <span class="text-xs text-gray-500 whitespace-nowrap">
                                                {{ formatDate(post.created_at) }}
                                            </span>
                                            <div v-if="authUser.email === post.email" class="mt-2">
                                                <router-link :to="`/edit/${post.id}`">
                                                    <MiniButton class="text-xs py-1 px-2">
                                                        Editar
                                                    </MiniButton>
                                                </router-link>
                                            </div>
                                        </div>
                                    </div>
                                </router-link>
                            </li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>