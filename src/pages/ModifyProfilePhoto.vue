<script>
import MainH1 from '../components/MainH1.vue';
import MainButton from '../components/MainButton.vue';
import MainLabel from '../components/MainLabel.vue';
import Loader from '../components/Loader.vue';
import {updateUserPhoto} from '../services/auth.js';

export default {
    name: "ModifyProfilePhoto",
    components: { MainH1, MainButton, Loader, MainLabel },
    data() {
        return {
            photo: null,
            photoPreview: null,
            uploadingPhoto: false,
        }
    },
    methods: {
        handleFileSelection(event) {
            this.photo = event.target.files[0];

            const reader = new FileReader();
            reader.addEventListener('load', () => {
                this.photoPreview = reader.result;
            });
            reader.readAsDataURL(this.photo);
        },
        async handleFileUpload() {
            this.uploadingPhoto = true;
            try {
                await updateUserPhoto(this.photo);
            } catch (error) {
                console.error('[modifyProfilePhoto] Error al editar foto:', error)
            }
            this.uploadingPhoto = false;
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
    >
        <MainLabel
            for="photo"
        >Cambiar foto</MainLabel>
        <input
            class="block"
            type="file"
            id="photo"
            :read-only="uploadingPhoto"
            @change="handleFileSelection"
        >
        <MainButton
            class="mt-4"
            :loading="uploadingPhoto"
        >Actualizar</MainButton>
    </form>
    <div class="mt-4">
        <img
            v-if="photoPreview != null"
            :src="photoPreview"
            alt=""
            class="max-w-[30rem]"
        >
        <img
            v-if="photoPreview != null"
            :src="photoPreview"
            alt=""
            class="w-[20rem]"
        >
        <img
            v-if="photoPreview != null"
            :src="photoPreview"
            alt=""
            class="w-[10rem]"
        >
    </div>
</template>