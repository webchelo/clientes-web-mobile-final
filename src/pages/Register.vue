<script>
import MainH1 from '../components/MainH1.vue';
import MainButton from '../components/MainButton.vue';
import MainLabel from '../components/MainLabel.vue';
import AlertPop from '../components/AlertPop.vue';
import { register } from '../services/auth';

export default {
    name: 'Register',
    components: { MainH1, MainButton, MainLabel, AlertPop },
    data() {
        return {
            user: {
                email: '',
                password: '',
            },
            loading: false,
            wrongCredentials: false,
        };
    },
    methods: {
        async handleSubmit() {
            this.loading = true;
            try {
                await register(this.user.email, this.user.password);
                this.$router.push({
                    path: '/perfil',
                });
            } catch (error) {
                console.error('[Register] Error en el registro de usuario:', error);
                this.wrongCredentials = true;
            }
            this.loading = false;
        }
    }
}
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-6xl w-full flex bg-white rounded-xl shadow-lg overflow-hidden">
            <!-- Columna izquierda: Imagen del animal -->
            <div class="hidden md:block md:w-1/2 bg-yellow-100">
                <img 
                    src="../img/dog-hero.webp" 
                    alt="Animal companion"
                    class="w-full h-full object-cover"
                >
            </div>

            <!-- Columna derecha: Formulario -->
            <div class="w-full md:w-1/2 p-8 sm:p-12">
                <div class="text-center mb-8">
                    <MainH1 class="text-3xl font-extrabold text-gray-900">Crear una Cuenta</MainH1>
                    <p class="mt-2 text-sm text-gray-600">
                        Únete a nuestra comunidad de amantes de los animales
                    </p>
                </div>

                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <div>
                        <MainLabel for="email" class="block text-sm font-medium text-gray-700">
                            Email
                        </MainLabel>
                        <input
                            type="email"
                            id="email"
                            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100"
                            :disabled="loading"
                            v-model="user.email"
                            required
                            placeholder="tu@email.com"
                        >
                    </div>

                    <div>
                        <MainLabel for="password" class="block text-sm font-medium text-gray-700">
                            Contraseña
                        </MainLabel>
                        <input
                            type="password"
                            id="password"
                            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 disabled:bg-gray-100"
                            :disabled="loading"
                            v-model="user.password"
                            required
                            placeholder="••••••••"
                            minlength="6"
                        >
                    </div>

                    <AlertPop v-if="wrongCredentials" class="mt-4">
                        Error en el registro. La contraseña debe tener al menos 6 caracteres.
                    </AlertPop>

                    <div>
                        <MainButton 
                            type="submit"
                            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            :disabled="loading"
                        >
                            <span v-if="!loading">Crear Cuenta</span>
                            <span v-else>Creando cuenta...</span>
                        </MainButton>
                    </div>
                </form>

                <div class="mt-6 text-center text-sm text-gray-600">
                    <p>
                        ¿Ya tienes una cuenta?
                        <router-link to="/login" class="font-medium text-yellow-600 hover:text-yellow-500">
                            Inicia sesión
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>