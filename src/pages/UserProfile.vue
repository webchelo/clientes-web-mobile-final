<script>
import Loader from '../components/Loader.vue';
import MainH1 from '../components/MainH1.vue';
import UserProfileData from '../components/UserProfileData.vue';
import Subtitle from '../components/Subtitle.vue';
import MiniButton from '../components/MiniButton.vue';
import MainButton from '../components/MainButton.vue'
import { subscribeToAuth } from '../services/auth';
import { subscribeToUserPosts } from '../services/my-profile';
import { getUserProfileById } from '../services/user-profile';

export default {
    name: 'UserProfile',
    components: { MainH1, Loader, UserProfileData, Subtitle, MiniButton, MainButton },
    data() {
        return {
            user: {
                id: null,
                email: null,
                pet: null,
            },
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
            userLoaded: false,
            posts: [],
            unsubscribeFromPosts: () => {},
        }
    },
    async mounted() {
        this.unsubscribeFromAuth = subscribeToAuth(newUserData => this.authUser = newUserData);
        this.userLoaded = false;
        this.user = await getUserProfileById(this.$route.params.id);

        this.userLoaded = true;
        this.unsubscribeFromPosts = subscribeToUserPosts(newPosts => {
            this.posts = newPosts;
        }, this.user.email);
    },
    unmounted() {
        this.unsubscribeFromAuth();
    }
}
</script>

<template>
    <MainH1>Perfil</MainH1>

    <template v-if="authUser.fullyLoaded">
        <router-link :to="'/posts'"><MainButton>Volver</MainButton></router-link>
        <Subtitle class="mt-4">Datos del usuario {{ user.email }}</Subtitle>
        <UserProfileData :user="user" />
        <template v-if="posts.length > 0">
            <Subtitle class="mt-8">Posts</Subtitle>
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

