<script>

export default {
    name: 'UserProfileData',

    props: {
        user: {
            type: Object,
            required: true,
        }
    }
}
</script>
<template>
    <div class="flex justify-between rounded border border-gray-300 p-4 shadow-xl">
        <section>
        <h2 class="font-bold">Nombre de usuario:</h2>
        <p v-if="user.displayName">{{ user.displayName }}</p>
        <p v-else>Indefinido</p>

        <h2 class="font-bold">Nombre de la mascota:</h2>
        <p v-if="user.pet">{{ user.pet }}</p>
        <p v-else>Indefinido</p>
    
        <h2 class="font-bold">Biografía de <template v-if="user.pet">{{ user.pet }}</template><template v-else>la mascota</template>:</h2>
        <p v-if="user.petBio">{{ user.petBio }}</p>
        <p v-else>Indefinido</p>
    
    </section>
        <section class="mb-3">
            <img
                v-if="user.photoURL"
                :src="user.photoURL"
                alt=""
                class="w-[30rem] rounded border border-4 border-yellow-600"
            >
        </section>
    </div>
    
</template>