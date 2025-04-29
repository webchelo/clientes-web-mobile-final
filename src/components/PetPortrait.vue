<script>
export default {
  props: {
    image: String, 
    alt: String,
    text: String
  },
  computed: {
    /**
     * La convierte en URL absoluta usando import.meta.url como base
        
       Devuelve la cadena completa con .href
     */
    imgUrl() {
      return new URL(`../img/${this.image}.webp`, import.meta.url).href
    }
  }
}
</script>

<template>
  <div class="relative group">
    <div class="bg-yellow-300 rounded-full w-60 h-60 overflow-hidden shadow-lg transform group-hover:-translate-y-4 transition duration-300">
      <img :src="imgUrl" :alt="alt" class="w-full h-full object-cover">
    </div>
    <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md whitespace-nowrap">
      <span class="text-yellow-600 font-medium">{{ text }}</span>
    </div>
  </div>
</template>