<script>
import AlertPop from '../components/AlertPop.vue';
import SendButton from '../components/SendButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainLabel from '../components/MainLabel.vue';
import MainButton from '../components/MainButton.vue';
import { subscribeToAuth, updateUser } from '../services/auth';

export default {
    name: 'ModifyProfile',
    components: { AlertPop, SendButton, MainH1, MainLabel, MainButton },
    data() {
        return {
            userProfile: {
                displayName: '',
                pet: '',
                petBio: '',
            },
            authUser: {
                id: '',
                email: '',
                displayName: '',
                pet: '',
                petBio: '',
                photoURL: null,
            },
            unsubscribeFromAuth: () => {},
            editingProfile: false,
            showValidationError: false,
        }
    },
    methods: {
        async sendChanges() {
            
            if (!this.userProfile.displayName.trim() || !this.userProfile.pet.trim()) {
                this.showValidationError = true;
                return; 
            }

            this.editingProfile = true;
            this.showValidationError = false; 

            try {
                await updateUser({
                    displayName: this.userProfile.displayName,
                    pet: this.userProfile.pet,
                    petBio: this.userProfile.petBio,
                });
                this.$router.push('/perfil');
            } catch (error) {
                console.error('[modifyProfile] Error al editar perfil:', error);
                this.showValidationError = true;
            } finally {
                this.editingProfile = false;
            }
        }
    },
    async mounted() {
        this.unsubscribeFromAuth = subscribeToAuth(newUserData => {
            this.authUser = newUserData;
            
            this.userProfile.displayName = this.authUser.displayName;
            this.userProfile.pet = this.authUser.pet;
            this.userProfile.petBio = this.authUser.petBio;
        });
    },
    unmounted() {
        this.unsubscribeFromAuth();
    }
}
</script>

<template>
    <router-link :to="'/perfil'"><MainButton>Volver</MainButton></router-link>
    <MainH1 class="mt-4">Editar Perfil</MainH1>
    <p>{{ authUser.email }}</p> 

    <form action="#" @submit.prevent="sendChanges">
        <div class="mb-4">
            <MainLabel for="displayName">Nombre</MainLabel>
            <input
                class="block w-full p-2 border border-yellow-600 rounded disabled:bg-gray-100"
                :class="{'border-red-500': showValidationError && !userProfile.displayName.trim()}"
                type="text"
                name="displayName"
                id="displayName"
                v-model="userProfile.displayName"
                :disabled="editingProfile"
            />
        </div>

        <div class="mb-4">
            <MainLabel for="pet">Nombre de la mascota</MainLabel>
            <input
                class="block w-full p-2 border border-yellow-600 rounded disabled:bg-gray-100"
                :class="{'border-red-500': showValidationError && !userProfile.pet.trim()}"
                type="text"
                name="pet"
                id="pet" 
                v-model="userProfile.pet"
                :disabled="editingProfile"
            />
        </div>

        <div class="mb-4">
            <MainLabel for="petBio">Biografía de la mascota</MainLabel>
            <textarea
                class="block w-full p-2 border border-yellow-600 rounded disabled:bg-gray-100"
                name="petBio"
                id="petBio"
                v-model="userProfile.petBio"
                :disabled="editingProfile"
                rows="4"
            ></textarea>
        </div>

        <AlertPop v-if="showValidationError">
            Error: El nombre y el nombre de la mascota son campos obligatorios
        </AlertPop>

        <SendButton
            class="mt-4"
            :disabled="editingProfile"
        >
            <template v-if="!editingProfile">Guardar cambios</template>
            <template v-else>Guardando...</template>
        </SendButton>
    </form>
</template>