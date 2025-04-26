<script>
import SendButton from '../components/SendButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainLabel from '../components/MainLabel.vue';
import MainButton from '../components/MainButton.vue';
import { subscribeToAuth, updateUser } from '../services/auth';

export default {
    name: 'ModifyProfile',
    components: { SendButton, MainH1, MainLabel, MainButton },
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
        }
    },
    methods: {
        async sendChanges() {
            this.editingProfile = true;
            try {
                await updateUser({
                    displayName: this.userProfile.displayName,
                    pet: this.userProfile.pet,
                    petBio: this.userProfile.petBio,
                })
            } catch (error) {
                console.error('[modifyProfile] Error al editar perfil:', error)
            }
            this.editingProfile = false;
        }
    },
    async mounted() {
        this.unsubscribeFromAuth = subscribeToAuth(newUserData => this.authUser = newUserData);

        //this.userProfile = await getUserById(this.$route.params.id)

        this.userProfile.displayName = this.authUser.displayName;
        this.userProfile.pet = this.authUser.pet;
        this.userProfile.petBio = this.authUser.petBio;
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
        <div>
            <MainLabel
                for="displayName"
            >Nombre</MainLabel>
            <input
                class="block border border-yellow-600 rounded"
                type="text"
                name="displayName"
                id="displayName"
                v-model="userProfile.displayName"
                :disabled="editingProfile"
                required
            />

        </div>

        <div>
            <MainLabel
                for="pet"
            >Nombre de la mascota</MainLabel>
            <input
                class="block border border-yellow-600 rounded"
                type="text"
                name="pet"
                id="pet" 
                v-model="userProfile.pet"
                :disabled="editingProfile"
                required
            />

        </div>

        <div>
            <MainLabel
                for="petBio"
            >Biografía de la mascota</MainLabel>
            <textarea
                class="block border border-yellow-600 rounded w-[30rem]"
                type="text"
                name="petBio"
                id="petBio"
                v-model="userProfile.petBio"
                :disabled="editingProfile"
                required
                >
            </textarea>

        </div>

        <SendButton
            class="mt-4"
            :disabled="editingProfile"
        >Guardar cambios</SendButton>
          
    </form>
</template>