<script>
import Home from './pages/Home.vue';
import { logout, subscribeToAuth } from './services/auth';
import { auth } from './services/firebase';

export default {
    name: 'App',
    components: {Home},
    data() {
        return {
            authUser: {
                id: null,
                email: null,
                displayName: null,
                photoURL: null
            }
        };
    },
    methods: {
        handleLogout() {
            logout();
            this.$router.push({
                path: '/iniciar-sesion',
            });
        }
    },
    mounted() {
        subscribeToAuth(newUserData => this.authUser = newUserData);
    },
}
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <!-- Barra de navegación -->
        <nav class="bg-white shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <!-- Logo y menú izquierdo -->
                    <div class="flex items-center">
                        <div class="flex-shrink-0 flex items-center">
                            <img src="./img/bone-solid.svg" alt="Logo Petbook" class="h-8 w-8 text-yellow-500">
                            <span class="ml-2 text-xl font-semibold text-gray-900">Petbook</span>
                        </div>
                        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <router-link 
                                to="/" 
                                class="border-yellow-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                active-class="border-yellow-500"
                            >
                                Inicio
                            </router-link>
                            <router-link 
                                v-if="authUser.id" 
                                to="/posts" 
                                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                active-class="border-yellow-500 text-gray-900"
                            >
                                Posts
                            </router-link>
                        </div>
                    </div>

                    <!-- Menú derecho -->
                    <div class="hidden sm:ml-6 sm:flex sm:items-center">
                        <div v-if="authUser.id === null" class="flex space-x-4">
                            <router-link 
                                to="/iniciar-sesion" 
                                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                active-class="border-yellow-500 text-gray-900"
                            >
                                Iniciar Sesión
                            </router-link>
                            <router-link 
                                to="/registro" 
                                class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                                active-class="border-yellow-500 text-gray-900"
                            >
                                Registro
                            </router-link>
                        </div>
                        <div v-else class="flex items-center space-x-4">
                            <router-link 
                                to="/perfil" 
                                class="flex items-center text-sm text-gray-700 hover:text-yellow-600 transition-colors"
                            >
                                <div v-if="authUser.photoURL" class="h-8 w-8 rounded-full overflow-hidden mr-2">
                                    <img :src="authUser.photoURL" alt="Foto de perfil" class="h-full w-full object-cover">
                                </div>
                                <div v-else class="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold mr-2">
                                    {{ authUser.displayName ? authUser.displayName.charAt(0) : authUser.email.charAt(0).toUpperCase() }}
                                </div>
                                <span>{{ authUser.displayName ? authUser.displayName : authUser.email.split('@')[0] }}</span>
                            </router-link>
                            <button 
                                @click="handleLogout" 
                                class="text-gray-500 hover:text-gray-700 text-sm font-medium"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>

                    <!-- Menú móvil -->
                    <div class="-mr-2 flex items-center sm:hidden">
                        <button 
                            type="button" 
                            class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500"
                            @click="isMobileMenuOpen = !isMobileMenuOpen"
                        >
                            <span class="sr-only">Abrir menú principal</span>
                            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Menú móvil desplegable -->
            <div v-if="isMobileMenuOpen" class="sm:hidden">
                <div class="pt-2 pb-3 space-y-1">
                    <router-link 
                        to="/" 
                        class="bg-yellow-50 border-yellow-500 text-yellow-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        active-class="bg-yellow-50 border-yellow-500 text-yellow-700"
                    >
                        Inicio
                    </router-link>
                    <router-link 
                        v-if="authUser.id" 
                        to="/posts" 
                        class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        active-class="bg-yellow-50 border-yellow-500 text-yellow-700"
                    >
                        Posts
                    </router-link>
                    <router-link 
                        v-if="!authUser.id" 
                        to="/iniciar-sesion" 
                        class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        active-class="bg-yellow-50 border-yellow-500 text-yellow-700"
                    >
                        Iniciar Sesión
                    </router-link>
                    <router-link 
                        v-if="!authUser.id" 
                        to="/registro" 
                        class="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                        active-class="bg-yellow-50 border-yellow-500 text-yellow-700"
                    >
                        Registro
                    </router-link>
                    <div v-if="authUser.id" class="pt-4 border-t border-gray-200">
                        <div class="flex items-center px-4">
                            <div v-if="authUser.photoURL" class="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                                <img :src="authUser.photoURL" alt="Foto de perfil" class="h-full w-full object-cover">
                            </div>
                            <div v-else class="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold">
                                {{ authUser.displayName ? authUser.displayName.charAt(0) : authUser.email.charAt(0).toUpperCase() }}
                            </div>
                            <div class="ml-3">
                                <div class="text-base font-medium text-gray-800">{{ authUser.displayName ? authUser.displayName : authUser.email.split('@')[0] }}</div>
                                <div class="text-sm font-medium text-gray-500">{{ authUser.email }}</div>
                            </div>
                        </div>
                        <div class="mt-3 space-y-1">
                            <router-link 
                                to="/perfil" 
                                class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                            >
                                Tu perfil
                            </router-link>
                            <button 
                                @click="handleLogout" 
                                class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Contenido principal -->
        <main class="flex-grow">
            <router-view class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" />
        </main>

        <!-- Pie de página -->
        <footer class="bg-white border-t border-gray-200">
            <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <p class="text-center text-gray-500 text-sm">
                    &copy; {{ new Date().getFullYear() }} Marcelo Anavia DWN4AV | Clientes Web Mobile
                </p>
            </div>
        </footer>
    </div>
</template>