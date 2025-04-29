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
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <!-- Botón de volver -->
        <router-link 
          :to="`/post/${post.id}`" 
          class="inline-flex items-center mb-6 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Volver al post
        </router-link>
  
        <!-- Contenido principal -->
        <div class="bg-white rounded-xl shadow-md overflow-hidden p-6 sm:p-8">
          <!-- Header -->
          <div class="mb-8">
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Agregar imagen al post</h1>
            <p class="mt-2 text-gray-600">Selecciona una imagen para enriquecer tu publicación</p>
          </div>
  
          <!-- Formulario -->
          <form @submit.prevent="handleFileUpload" class="space-y-6">
            <!-- Selector de archivo -->
            <div>
              <MainLabel class="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar imagen <span class="text-red-500">*</span>
              </MainLabel>
              
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <label for="img" class="relative cursor-pointer bg-white rounded-md font-medium text-yellow-600 hover:text-yellow-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-yellow-500">
                      <span>Sube un archivo</span>
                      <input 
                        id="img" 
                        type="file" 
                        accept="image/*"
                        @change="handleFileSelection"
                        :disabled="uploadingImg"
                        class="sr-only"
                      >
                    </label>
                    <p class="pl-1">o arrastra y suelta</p>
                  </div>
                  <p class="text-xs text-gray-500">
                    PNG, JPG, GIF hasta 5MB
                  </p>
                </div>
              </div>
            </div>
  
            <!-- Vista previa -->
            <div v-if="imgPreview" class="space-y-4">
              <h2 class="text-lg font-medium text-gray-900">Vista previa</h2>
              <div class="border border-gray-200 rounded-lg overflow-hidden">
                <img 
                  :src="imgPreview" 
                  alt="Vista previa de la imagen" 
                  class="w-full h-auto max-h-96 object-contain mx-auto"
                >
              </div>
            </div>
  
            <!-- Mensajes de error -->
            <AlertPop v-if="showValidationError" class="mt-2">
              Por favor selecciona una imagen válida para continuar
            </AlertPop>
  
            <!-- Botón de enviar -->
            <div class="pt-4">
              <button
                type="submit"
                :disabled="uploadingImg || !imgPreview"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!uploadingImg">Subir imagen</span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subiendo...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>