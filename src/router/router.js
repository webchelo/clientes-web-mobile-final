import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import Posts from "../pages/Posts.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import MyProfile from "../pages/MyProfile.vue";
import UserProfile from "../pages/UserProfile.vue";
import Post from "../pages/Post.vue";
import PostEdit from "../pages/PostEdit.vue";
import ModifyProfilePhoto from "../pages/ModifyProfilePhoto.vue";
import PostUploadImg from "../pages/PostUploadImg.vue";
import { subscribeToAuth } from "../services/auth";
import ModifyProfile from "../pages/ModifyProfile.vue";

const routes = [
    { path: '/',                        component: Home, },
    { path: '/iniciar-sesion',          component: Login, },
    { path: '/registro',                component: Register, },
    { path: '/posts',                   component: Posts,               meta: { requiresAuth: true } },
    { path: '/posts/editar/foto/:id',                   component: PostUploadImg,               meta: { requiresAuth: true } },
    { path: '/post/:id',                component: Post,                meta: { requiresAuth: true } },
    { path: '/edit/:id',                component: PostEdit,            meta: { requiresAuth: true } },
    { path: '/perfil',                  component: MyProfile,           meta: { requiresAuth: true } },
    { path: '/perfil/editar',              component: ModifyProfile,       meta: { requiresAuth: true } },
    { path: '/perfil/editar/foto',              component: ModifyProfilePhoto,  meta: { requiresAuth: true } },
    { path: '/usuario/:id',             component: UserProfile,         meta: { requiresAuth: true } },
];

const router = createRouter({
    routes,
    history: createWebHashHistory(),
});

let authUser = {
    id: null,
    email: null,
}

subscribeToAuth(newUserData => authUser = newUserData);

router.beforeEach((to, from) => {
    if(authUser.id === null && to.meta.requiresAuth) {
        return {
            path: '/iniciar-sesion',
        };
    }
});

export default router;