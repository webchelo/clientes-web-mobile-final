<script>
import AlertPop from '../components/AlertPop.vue';
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
    components: { MainH1, Loader, MainButton, MiniButton, Subtitle, AlertPop },
    data() {
        return {
            newComment: {
                comment: '',
            },
            creatingPost: false,
            showCommentError: false,
            post: {
                id: null,
                user_id: null,
                email: null,
                content: null,
                title: null,
                comments: [],
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
            
            if (!this.newComment.comment.trim()) {
                this.showCommentError = true;
                return; 
            }

            this.showCommentError = false;
            createComment(this.post.id, {
                user_id: this.authUser.id,
                email: this.authUser.email,
                comment: this.newComment.comment,
            });
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
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <!-- Botón de volver -->
        <router-link 
          :to="'/posts'" 
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Volver a todos los posts
        </router-link>
  
        <!-- Contenido principal del post -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden">
          <!-- Header del post -->
          <div class="p-6 sm:p-8">
            <div class="flex items-start justify-between">
              <div>
                <MainH1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{{ post.title }}</MainH1>
                
                <div class="flex items-center">
                  <router-link 
                    :to="`/usuario/${post.user_id}`" 
                    class="flex items-center group"
                  >
                    <div class="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold mr-3">
                        {{ post.email?.charAt(0).toUpperCase() }}
                    </div>
                    <span class="text-gray-600 group-hover:text-yellow-600 transition-colors">
                      {{ post.displayName ? post.displayName : post.email?.split('@')[0] }}
                    </span>
                  </router-link>
                </div>
              </div>
              
              <div v-if="authUser.email === post.email" class="flex flex-col sm:flex-row gap-2">
                <router-link 
                  :to="`/posts/editar/foto/${post.id}`" 
                  class="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  {{ post.img ? 'Modificar foto' : 'Subir foto' }}
                </router-link>
                <router-link 
                  :to="`/edit/${post.id}`" 
                  class="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                >
                  Editar
                </router-link>
              </div>
            </div>
          </div>
  
          <!-- Contenido del post -->
          <div class="px-6 sm:px-8 pb-6 sm:pb-8">
            <p class="text-gray-700 whitespace-pre-line mb-6">{{ post.content }}</p>
            
            <!-- Imagen del post -->
            <div v-if="post.img" class="mt-6 rounded-lg overflow-hidden border-4 border-yellow-500 shadow-lg">
              <img 
                :src="post.img" 
                alt="Imagen del post" 
                class="w-full h-auto max-h-96 object-contain"
              >
            </div>
          </div>
  
          <!-- Sección de comentarios -->
          <div class="border-t border-gray-200 px-6 sm:px-8 py-6">
            <Subtitle class="text-xl font-semibold text-gray-800 mb-6">Comentarios</Subtitle>
            
            <!-- Lista de comentarios -->
            <ul class="space-y-4 mb-8">
              <li
                v-for="comment in post.comments"
                class="bg-gray-50 rounded-lg p-4 shadow-sm"
              >
                <div class="flex items-start">
                  <router-link 
                    :to="`/usuario/${comment.user_id}`" 
                    class="flex-shrink-0"
                  >
                    <div class="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 text-sm font-bold mr-3">
                      {{ comment.email.charAt(0).toUpperCase() }}
                    </div>
                  </router-link>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex items-baseline justify-between">
                      <router-link 
                        :to="`/usuario/${comment.user_id}`" 
                        class="text-sm font-medium text-gray-900 hover:text-yellow-600 truncate"
                      >
                        {{ comment.email }}
                      </router-link>
                      <span class="text-xs text-gray-500 ml-2 whitespace-nowrap">
                        {{ formatDate(comment.created_at) }}
                      </span>
                    </div>
                    <p class="text-gray-700 mt-1">{{ comment.comment }}</p>
                  </div>
                </div>
              </li>
            </ul>
  
            <!-- Formulario de comentarios -->
            <div class="bg-gray-50 rounded-lg p-4 sm:p-6">
              <form @submit.prevent="sendComment">
                <label for="comment" class="block text-sm font-medium text-gray-700 mb-2">
                  Añadir comentario
                </label>
                
                <textarea
                  id="comment"
                  v-model="newComment.comment"
                  rows="3"
                  class="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  :class="{'border-red-500': showCommentError}"
                  placeholder="Escribe tu comentario aquí..."
                ></textarea>
                
                <AlertPop v-if="showCommentError" class="mt-2">
                  Por favor escribe un comentario antes de enviar
                </AlertPop>
                
                <div class="mt-4 flex justify-end">
                  <button
                    type="submit"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                  >
                    Enviar comentario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>