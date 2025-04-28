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
        // Pedimos ser informados del estado de autenticación del usuario.
        subscribeToAuth(newUserData => this.authUser = newUserData);
    },
}
</script>

<template>
    <div class="grid grid-rows-layout h-full">
        <nav class="flex justify-between h-[60px] bg-orange-300 p-4 text-gray-900">
            <div class="flex gap-2 items-center">
                <img src="./img/bone-solid.svg" alt="" class="w-6">
                <p class="text-lg">Petbook</p>
            </div>
            <ul class="flex gap-4">
                <li><router-link to="/">Inicio</router-link></li>
                <template v-if="authUser.id === null">
                    <li><router-link to="/iniciar-sesion">Iniciar Sesión</router-link></li>
                    <li><router-link to="/registro">Registro</router-link></li>
                </template>
                <template v-else>
                    <li><router-link to="/posts">Posts</router-link></li>
                    <li><router-link to="/perfil">Mi Perfil</router-link></li>
                    <li>
                        <form action="#" @submit.prevent="handleLogout">
                            <button type="submit">Cerrar Sesión</button>
                        </form>
                    </li>
                    <li><router-link to="/perfil">{{ authUser.displayName ? authUser.displayName : authUser.email.split('@')[0] }} </router-link></li>
                    <img :src="authUser.photoURL" alt="">
                </template>
            </ul>
        </nav>
        <main class="container p-4 mx-auto">
            <router-view />
        </main>
        <footer class="flex justify-center items-center h-footer bg-yellow-900 text-white">
            <p>Marcelo Anavia DWN4AV | Clientes Web Mobile</p>
        </footer>
    </div>
</template>