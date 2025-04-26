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
    <MainH1>Iniciar Sesión</MainH1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-3">
            <MainLabel for="email">Email</MainLabel>
            <input
                type="email"
                id="email"
                class="w-full p-2 border border-gray-300 rounded disabled:bg-gray-100"
                :disabled="loading"
                v-model="user.email"
            >
        </div>
        <div class="mb-3">
            <MainLabel for="password">Contraseña</MainLabel>
            <input
                type="password"
                id="password"
                class="w-full p-2 border border-gray-300 rounded disabled:bg-gray-100"
                :disabled="loading"
                v-model="user.password"
            >
        </div>
        <AlertPop v-if="wrongCredentials">La dirección de Email o la contraseña son erroneas.</AlertPop>
        <MainButton>Ingresar</MainButton>
    </form>
</template>