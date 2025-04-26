<script>
import MainH1 from '../components/MainH1.vue';
import MainButton from '../components/MainButton.vue';

export default {
    name: 'Home',
    components: { MainH1, MainButton },
}
</script>

<template>
    <MainH1 class="mt-20">Bienvenido a Petbook</MainH1>
    <p class="mb-5">Petbook es una red social de mascotas. ¡Registrá a tu mascota y comenzá a postear!</p>
    <RouterLink to="posts">
        <MainButton>Comenzar</MainButton>
    </RouterLink>
    <div>
        <img src="../img/dog-hero.webp" alt="" class="w-[40rem] float-right mr-0">
    </div>
</template>