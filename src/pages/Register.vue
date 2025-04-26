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
                await register(this.user.email, this.user.password,);
                this.$router.push({
                    path: '/perfil',
                })
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
    <MainH1>Crear una Cuenta</MainH1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-3">
            <MainLabel 
                for="email"
                class="block mb-2"
            >Email</MainLabel>
            <input
                type="email"
                id="email"
                class="w-full p-2 border border-gray-300 rounded disabled:bg-gray-100"
                :disabled="loading"
                v-model="user.email"
                required
            >
        </div>

        <div class="mb-3">
            <MainLabel 
                for="password"
                class="block mb-2"
            >Contraseña</MainLabel>
            <input
                type="password"
                id="password"
                class="w-full p-2 border border-gray-300 rounded disabled:bg-gray-100"
                :disabled="loading"
                v-model="user.password"
                required
            >
        </div>
        <AlertPop v-if="wrongCredentials">Hay un error en el registro.</AlertPop>
        <MainButton>Crear Cuenta</MainButton>
    </form>
</template>