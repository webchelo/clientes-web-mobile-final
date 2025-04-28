<script>
import MainH1 from '../components/MainH1.vue';
import MainButton from '../components/MainButton.vue';
import MainH2 from '../components/MainH2.vue';

export default {
    name: 'Home',
    components: { MainH1, MainButton, MainH2 },
}
</script>

<template>
    <MainH1 class="mt-20 text-9xl">La red social</MainH1>
    <MainH2 class="text-8xl">de tus mascotas</MainH2>
    <p class="mb-5 mt-14 ">¡Registrate para comenzar a postear!</p>
    <RouterLink to="posts">
        <MainButton>Comenzar</MainButton>
    </RouterLink>
    <div class="flex flex-row gap-32 justify-center -mt-14">
        <div class="bg-yellow-300 rounded-full w-[20rem] h-[10rem] overflow-hidden mt-40">
            <img src="../img/catdog-hero.webp" alt="" class="w-full h-full object-cover left- relative">
        </div>
        <div class="bg-yellow-300 rounded-full w-[20rem] h-[20rem] overflow-hidden">
            <img src="../img/dog-hero.webp" alt="" class="w-full h-full object-cover">
        </div>
        <div class="bg-yellow-300 rounded-full w-[10rem] h-[20rem] overflow-auto">
            <img src="../img/hamster-hero.webp" alt="" class="w-full h-full object-cover">
        </div>

    </div>
</template>