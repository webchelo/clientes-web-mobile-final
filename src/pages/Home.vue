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
  <div class="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
    <!-- Hero Section -->
    <div class="container mx-auto px-6 md:px-12 lg:px-24 pt-20 pb-32">
      <div class="text-center mb-16">
        <MainH1 class="text-6xl md:text-8xl lg:text-9xl font-bold text-yellow-600 mb-4">
          La red social
        </MainH1>
        <MainH2 class="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-800">
          de tus mascotas
        </MainH2>
        
        <p class="text-xl md:text-2xl text-gray-600 mt-10 mb-8 max-w-2xl mx-auto">
          Conecta con otros amantes de mascotas y comparte los mejores momentos de tus mascotas.
        </p>
        
        <RouterLink to="/posts">
          <MainButton class="px-8 py-4 text-lg md:text-xl hover:scale-105 transform transition">
            Comenzar la aventura
          </MainButton>
        </RouterLink>
      </div>

      <!-- Gallery Section -->
      <div class="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-12 lg:gap-24 px-4">
        <!-- Cat & Dog Image -->
        <div class="relative group">
          <div class="bg-yellow-300 rounded-full w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 overflow-hidden shadow-xl transform group-hover:-translate-y-4 transition duration-300">
            <img src="../img/catdog-hero.webp" alt="Gato y perro juntos" class="w-full h-full object-cover">
          </div>
          <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md whitespace-nowrap">
            <span class="text-yellow-600 font-medium">Amigos inseparables</span>
          </div>
        </div>

        <!-- Main Dog Image -->
        <div class="relative group z-10">
          <div class="bg-yellow-400 rounded-full w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 overflow-hidden shadow-2xl transform group-hover:-translate-y-6 transition duration-300">
            <img src="../img/dog-hero.webp" alt="Perro hero" class="w-full h-full object-cover">
          </div>
          <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md whitespace-nowrap">
            <span class="text-yellow-600 font-medium">¡Únete ahora!</span>
          </div>
        </div>

        <!-- Hamster Image -->
        <div class="relative group">
          <div class="bg-yellow-300 rounded-full w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 overflow-hidden shadow-xl transform group-hover:-translate-y-4 transition duration-300">
            <img src="../img/hamster-hero.webp" alt="Hámster" class="w-full h-full object-cover">
          </div>
          <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md whitespace-nowrap">
            <span class="text-yellow-600 font-medium">Pequeños amigos</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Additional CTA -->
    <div class="bg-yellow-500 py-12">
      <div class="container mx-auto text-center px-6">
        <h3 class="text-3xl md:text-4xl font-bold text-white mb-6">¿Qué esperas para unirte?</h3>
        <RouterLink to="/registro">
          <MainButton class="bg-white text-yellow-600 hover:bg-gray-100 px-8 py-3 text-lg">
            Regístrate gratis
          </MainButton>
        </RouterLink>
      </div>
    </div>
  </div>
</template>