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
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto">
        <!-- Header y botón de volver -->
        <div class="flex justify-between items-center mb-8">
          <MainH1 class="text-2xl sm:text-3xl font-bold text-gray-900">Editar Publicación</MainH1>
          <router-link 
            :to="`/post/${oldPost.id}`"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Volver al post
          </router-link>
        </div>
  
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Editando publicación de {{ authUser.email }}
            </h3>
          </div>
          
          <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
            <form @submit.prevent="sendEditedPost" class="divide-y divide-gray-200">
              <!-- Sección de título -->
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <div>
                  <label for="title" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Título <span class="text-red-500">*</span>
                  </label>
                </div>
                <div class="mt-1 sm:mt-0 sm:col-span-2">
                  <input
                    type="text"
                    id="title"
                    v-model="oldPost.title"
                    :disabled="creatingPost"
                    class="max-w-lg block w-full shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm border-gray-300 rounded-md disabled:bg-gray-100"
                    :class="{ 'border-red-500': showValidationError && !oldPost.title?.trim() }"
                  >
                </div>
              </div>
  
              <!-- Sección de contenido -->
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <div>
                  <label for="content" class="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                    Contenido <span class="text-red-500">*</span>
                  </label>
                </div>
                <div class="mt-1 sm:mt-0 sm:col-span-2">
                  <textarea
                    id="content"
                    rows="6"
                    v-model="oldPost.content"
                    :disabled="creatingPost"
                    class="max-w-lg shadow-sm block w-full focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm border border-gray-300 rounded-md disabled:bg-gray-100"
                    :class="{ 'border-red-500': showValidationError && !oldPost.content?.trim() }"
                  ></textarea>
                </div>
              </div>
  
              <!-- Mensajes de error -->
              <div v-if="showValidationError" class="px-4 py-3 bg-red-50 sm:px-6">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">
                      Error: Todos los campos marcados con * son obligatorios
                    </h3>
                  </div>
                </div>
              </div>
  
              <!-- Botón de enviar -->
              <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="submit"
                  :disabled="creatingPost"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="!creatingPost">Guardar cambios</span>
                  <span v-else class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>