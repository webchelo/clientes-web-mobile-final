<script>
import MainH1 from '../components/MainH1.vue';
import UserProfileData from '../components/UserProfileData.vue';
import Loader from '../components/Loader.vue';
import MiniButton from '../components/MiniButton.vue';
import Subtitle from '../components/Subtitle.vue';
import { subscribeToAuth } from '../services/auth';
import { subscribeToUserPosts } from '../services/my-profile';

export default {
    name: 'MyProfile',
    components: { MainH1, Loader, UserProfileData, MiniButton, Subtitle },
    data() {
        return {
            authUser: {
                id: null,
                email: null,
                displayName: null,
                pet: null,
                petBio: null,
                photoURL: null,
                fullyLoaded: false,
            },
            unsubscribeFromAuth: () => {},
            posts: [],
            unsubscribeFromPosts: () => {},
        }
    },
    methods: {

    },
    async mounted() {
        this.unsubscribeFromAuth = subscribeToAuth(newUserData => this.authUser = newUserData);
        
        this.unsubscribeFromPosts = subscribeToUserPosts(newPosts => {
            this.posts = newPosts;
        }, this.authUser.email);
    },
    unmounted() {
        this.unsubscribeFromAuth();
    },
    
}
</script>
<template>
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <MainH1 class="text-3xl font-bold text-gray-900">Mi Perfil</MainH1>
          
          <Loader v-if="!authUser.fullyLoaded" />
        </div>
  
        <template v-if="authUser.fullyLoaded">
          <!-- Sección de acciones -->
          <div class="bg-white rounded-xl shadow-md p-6 mb-8">
            <div class="flex flex-wrap gap-3 mb-6">
              <router-link 
                to="/perfil/editar" 
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Editar Perfil
              </router-link>
              
              <router-link 
                to="/perfil/editar/foto" 
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cambiar Foto
              </router-link>
              
              <router-link 
                to="/perfil/editar/password" 
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Cambiar Contraseña
              </router-link>
            </div>
  
            <!-- Información del usuario -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <!-- Foto de perfil -->
              <div class="flex flex-col items-center">
                <div class="relative">
                  <img 
                    v-if="authUser.photoURL"
                    :src="authUser.photoURL" 
                    alt="Foto de perfil"
                    class="h-40 w-40 rounded-full object-cover border-4 border-white shadow-lg"
                  >
                  <div 
                    v-else
                    class="h-40 w-40 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-5xl font-bold border-4 border-white shadow-lg"
                  >
                    {{ authUser.displayName ? authUser.displayName.charAt(0) : authUser.email.charAt(0).toUpperCase() }}
                  </div>
                </div>
                
                <h2 class="mt-4 text-xl font-semibold text-gray-800">
                  {{ authUser.displayName || authUser.email.split('@')[0] }}
                </h2>
                <p class="text-sm text-gray-500">{{ authUser.email }}</p>
              </div>
              
              <!-- Datos del usuario -->
              <div class="md:col-span-2">
                <Subtitle class="text-xl font-semibold text-gray-800 mb-4">Mis Datos</Subtitle>
                <UserProfileData :user="authUser" />
                
                <!-- Mascota -->
                <div v-if="authUser.pet" class="mt-6">
                  <Subtitle class="text-xl font-semibold text-gray-800 mb-4">Mi Mascota</Subtitle>
                  <div class="bg-indigo-50 rounded-lg p-4">
                    <div class="flex items-start">
                      <div class="flex-shrink-0 h-16 w-16 rounded-full bg-white flex items-center justify-center text-indigo-600 text-2xl font-bold mr-4">
                        🐾
                      </div>
                      <div>
                        <h3 class="text-lg font-medium text-gray-900">{{ authUser.pet }}</h3>
                        <p v-if="authUser.petBio" class="text-gray-600 mt-1">{{ authUser.petBio }}</p>
                        <p v-else class="text-gray-400 italic mt-1">No hay descripción de la mascota</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Posts del usuario -->
          <div v-if="posts.length > 0" class="bg-white rounded-xl shadow-md p-6">
            <Subtitle class="text-xl font-semibold text-gray-800 mb-6">Mis Publicaciones</Subtitle>
            
            <ul class="space-y-4">
              <li 
                v-for="post in posts"
                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <router-link :to="`/post/${post.id}`" class="block">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="text-lg font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                        {{ post.title }}
                      </h3>
                      <p class="text-sm text-gray-500 mt-1">
                        Publicado el {{ new Date(post.created_at).toLocaleDateString() }}
                      </p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
  
          <div v-else class="bg-white rounded-xl shadow-md p-6 text-center">
            <Subtitle class="text-xl font-semibold text-gray-800 mb-4">Mis Publicaciones</Subtitle>
            <p class="text-gray-500">Aún no has creado ninguna publicación.</p>
            <router-link 
              to="/posts" 
              class="inline-block mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Crear mi primer post
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </template>
  
  