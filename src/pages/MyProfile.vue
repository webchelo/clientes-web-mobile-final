<script>
import MainH1 from '../components/MainH1.vue';
import UserProfileData from '../components/UserProfileData.vue';
import Loader from '../components/Loader.vue';
import MiniButton from '../components/MiniButton.vue';
import Subtitle from '../components/Subtitle.vue';
import { subscribeToAuth } from '../services/auth';
import { subscribeToUserPosts } from '../services/my-profile';

export default {
    name: 'MyProfile',
    components: { MainH1, Loader, UserProfileData, MiniButton, Subtitle },
    data() {
        return {
            authUser: {
                id: null,
                email: null,
                displayName: null,
                pet: null,
                petBio: null,
                photoURL: null,
                fullyLoaded: false,
            },
            unsubscribeFromAuth: () => {},
            posts: [],
            unsubscribeFromPosts: () => {},
        }
    },
    methods: {

    },
    async mounted() {
        this.unsubscribeFromAuth = subscribeToAuth(newUserData => this.authUser = newUserData);
        
        this.unsubscribeFromPosts = subscribeToUserPosts(newPosts => {
            this.posts = newPosts;
        }, this.authUser.email);
    },
    unmounted() {
        this.unsubscribeFromAuth();
    },
    
}
</script>

<template>
    <MainH1>Mi Perfil</MainH1>

    <template v-if="authUser.fullyLoaded">
        <router-link to="/perfil/editar"><MiniButton class="mr-4">Editar Perfil</MiniButton></router-link>
        <router-link to="/perfil/editar/foto"><MiniButton>Editar mi foto</MiniButton></router-link>

        <Subtitle class="mt-4">Mis datos ({{ authUser.email }})</Subtitle>
        <UserProfileData :user="authUser" />

        <template v-if="posts.length > 0">
            <Subtitle class="mt-8">Mis Posts</Subtitle>
            <ul>
                <li 
                    v-for="post in posts"
                    class="mb-2 border border-gray-300 p-4 text-xl"
                >
                    <router-link :to="`/post/${post.id}`">{{ post.title }}</router-link>
                </li>
            </ul>
        </template>
    </template>

    <Loader v-else/>
</template>
