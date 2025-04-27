<script>
import AlertPop from '../components/AlertPop.vue'; 
import MainH1 from '../components/MainH1.vue';
import MainButton from '../components/MainButton.vue';
import MainLabel from '../components/MainLabel.vue';
import Loader from '../components/Loader.vue';
import { updateUserPhoto } from '../services/auth.js';

export default {
    name: "ModifyProfilePhoto",
    components: { AlertPop, MainH1, MainButton, Loader, MainLabel },
    data() {
        return {
            photo: null,
            photoPreview: null,
            uploadingPhoto: false,
            showValidationError: false,
        }
    },
    methods: {
        handleFileSelection(event) {
            const file = event.target.files[0];
            if (!file) return;

            this.photo = file;
            this.showValidationError = false;

            const reader = new FileReader();
            reader.addEventListener('load', () => {
                this.photoPreview = reader.result;
            });
            reader.readAsDataURL(this.photo);
        },
        async handleFileUpload() {
           
            if (!this.photo) {
                this.showValidationError = true;
                return; 
            }

            this.uploadingPhoto = true;
            this.showValidationError = false;

            try {
                await updateUserPhoto(this.photo);
                this.$router.push('/perfil');
            } catch (error) {
                console.error('[modifyProfilePhoto] Error al editar foto:', error);
                this.showValidationError = true;
            } finally {
                this.uploadingPhoto = false;
            }
        }
    }
}
</script>

<template>
    <router-link :to="'/perfil'"><MainButton>Volver</MainButton></router-link>
    <MainH1>Editar mi foto de perfil</MainH1>
    
    <form
        action="#"
        @submit.prevent="handleFileUpload"
        class="mb-6"
    >
        <div class="mb-4">
            <MainLabel for="photo">Cambiar foto</MainLabel>
            <input
                type="file"
                id="photo"
                accept="image/*"
                @change="handleFileSelection"
                :disabled="uploadingPhoto"
                class="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-orange-50 file:text-orange-700
                    hover:file:bg-orange-100"
            >
        </div>

        <AlertPop v-if="showValidationError">
            Error: Debes seleccionar una imagen para actualizar tu foto de perfil
        </AlertPop>

        <MainButton
            class="mt-4"
            :disabled="uploadingPhoto"
        >
            <template v-if="!uploadingPhoto">Actualizar</template>
            <Loader v-else />
        </MainButton>
    </form>

    <div v-if="photoPreview" class="mt-6 space-y-4">
        <h2 class="font-bold">Vista previa:</h2>
        <div class="flex flex-wrap gap-4">
            <div class="flex flex-col items-center">
                <p class="text-sm mb-1">Tamaño grande</p>
                <img :src="photoPreview" alt="Vista previa" class="max-w-[30rem] border border-gray-300 rounded">
            </div>
            <div class="flex flex-col items-center">
                <p class="text-sm mb-1">Tamaño mediano</p>
                <img :src="photoPreview" alt="Vista previa" class="w-[20rem] border border-gray-300 rounded">
            </div>
            <div class="flex flex-col items-center">
                <p class="text-sm mb-1">Tamaño pequeño</p>
                <img :src="photoPreview" alt="Vista previa" class="w-[10rem] border border-gray-300 rounded">
            </div>
        </div>
    </div>
</template>