<script>
import MainH1 from '../components/MainH1.vue';
import MainLabel from '../components/MainLabel.vue';
import MainButton from '../components/MainButton.vue';
import AlertPop from '../components/AlertPop.vue';
import { login } from '../services/auth';

export default {
    name: 'Login',
    components: { MainH1, MainLabel, MainButton, AlertPop },
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
                await login(this.user.email, this.user.password);
                this.$router.push({
                    path: '/perfil',
                });
            } catch (error) {
                console.error('[Login handleSubmit] ', error);
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
                    src="../img/catdog-hero.webp" 
                    alt="Animal companion"
                    class="w-full h-full object-cover"
                >
            </div>

            <!-- Columna derecha: Formulario -->
            <div class="w-full md:w-1/2 p-8 sm:p-12">
                <div class="text-center mb-8">
                    <MainH1 class="text-3xl font-extrabold text-gray-900">Iniciar Sesión</MainH1>
                    <p class="mt-2 text-sm text-gray-600">
                        Accede a tu cuenta para disfrutar de nuestros servicios
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
                        La dirección de Email o la contraseña son incorrectas.
                    </AlertPop>

                    <div>
                        <MainButton 
                            type="submit"
                            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            :disabled="loading"
                        >
                            <span v-if="!loading">Ingresar</span>
                            <span v-else>Iniciando sesión...</span>
                        </MainButton>
                    </div>
                </form>

                <div class="mt-6 text-center text-sm text-gray-600">
                    <p>
                        ¿No tienes una cuenta?
                        <router-link to="/register" class="font-medium text-yellow-600 hover:text-yellow-500">
                            Regístrate
                        </router-link>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>