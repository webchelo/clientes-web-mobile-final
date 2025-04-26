<script>
import Loader from '../components/Loader.vue';
import MainH1 from '../components/MainH1.vue';
import Subtitle from '../components/Subtitle.vue';
import MainSpan from '../components/MainSpan.vue';
import SendButton from '../components/SendButton.vue';
import MainLabel from '../components/MainLabel.vue';
import MiniButton from '../components/MiniButton.vue';
import { subscribeToAuth } from '../services/auth';
import { savePost, subscribeToAllPosts, updateImg } from '../services/post';

export default {
    name: 'Posts',
    components: { MainH1, Loader, Subtitle, MainSpan, SendButton, MainLabel, MiniButton },
    data() {
        return {
            newPost: {
                id: '',
                content: '',
                title: '',
            },
            creatingPost: false,

            posts: [],
            postsLoaded: false,
            unsubscribeFromPosts: () => {},

            authUser: {
                id: null,
                email: null,
            },
            unsubscribeFromAuth: () => {},
        }
    },
    methods: {
        async sendPost() {
            this.creatingPost = true;

            savePost({
                id: this.newPost.id,
                user_id: this.authUser.id,
                email: this.authUser.email,
                content: this.newPost.content,
                title: this.newPost.title,
                
            }, this.newPost.img,).then(() => {
                this.creatingPost = false
                console.log(this.newPost.id)
            }
            );
            this.newPost.title = "";
            this.newPost.content = "";
        },
        /**
         * 
         * @param {Date} date 
         */
        formatDate(date) {
            return Intl.DateTimeFormat('es', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
            }).format(date).replace(',', '');
        },
        
    },
    mounted() {
        this.unsubscribeFromPosts = subscribeToAllPosts(newPosts => {
            this.posts = newPosts;
            this.postsLoaded = true;
        });

        this.unsubscribeFromAuth = subscribeToAuth(newUserData => this.authUser = newUserData);
    },
    unmounted() {
        this.unsubscribeFromPosts();
        this.unsubscribeFromAuth();
    }
}
</script>

<template>
    <MainH1>Posts</MainH1>

    <section>
        <div class="flex flex-col">
            <section>
                <Subtitle>Crear un Post</Subtitle>
                <form 
                    action="#"
                    @submit.prevent="sendPost"
                >
                    <div class="mb-3">
                        <MainSpan>Creador:</MainSpan>
                        <p>{{ authUser.email }}</p>
                    </div>
                    <div class="mb-3">
                        <MainLabel 
                            for="title"
                        >Título:</MainLabel>
                        <input
                            id="title"
                            class="w-30 p-2 border border-orange-300 rounded disabled:bg-gray-100"
                            :disabled="creatingPost"
                            v-model="newPost.title"
                            required
                        />
                    </div>
                    <div class="mb-3">
                        <MainLabel 
                            for="post"
                        >Contenido:</MainLabel>
                        <textarea 
                            id="post"
                            class="w-full p-2 border border-orange-300 rounded disabled:bg-gray-100"
                            :disabled="creatingPost"
                            v-model="newPost.content"
                            required
                        ></textarea>
                    </div>
                    <SendButton 
                        :disabled="creatingPost"
                    >
                        <template   v-if="!creatingPost">Crear</template>
                        <Loader     v-else />
                    </SendButton>
                </form>
            </section>
            <section>
                <h2 class="sr-only">Lista de Posts</h2>
                
                <div 
                    class="border rounded mt-4 min-h-[400px]"
                >
                <Subtitle>Explorar</Subtitle>
                    <ul 
                        v-if="postsLoaded"
                    >
                        <li 
                            v-for="post in posts"
                            class="mb-2 border border-gray-300 p-4 rounded shadow-xl"
                        >
                            <div class="flex justify-between">
                                <div>
                                    <p>
                                    <router-link :to="`/post/${post.id}`"><h2 class="text-4xl">{{ post.title }}</h2></router-link>
                                    <b>Por
                                        <router-link 
                                            :to="`/usuario/${post.user_id}`"
                                            class="text-blue-700 underline"
                                        >{{ post.email }} </router-link>
                                    </b>
                                    </p>
                                    <p>{{ post.content }}</p>
                                </div>
                                <p>{{ formatDate(post.created_at) }}</p>
                            </div>
                            <div v-if="authUser.email === post.email">
                                <router-link :to="`/edit/${post.id}`"><MiniButton class="mt-2">Editar</MiniButton></router-link>
                            </div>
                            
                        </li>
                    </ul>
                    <Loader v-else/>
                </div>
            </section>
        </div>
    </section>
</template>