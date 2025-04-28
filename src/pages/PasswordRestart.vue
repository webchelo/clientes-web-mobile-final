<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <img class="mx-auto h-12 w-auto" src="../assets/logo.svg" alt="Petbook Logo">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Restablecer Contraseña</h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form class="space-y-6" @submit.prevent="handleResetPassword">
            <!-- Nueva Contraseña -->
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700">
                Nueva Contraseña
              </label>
              <div class="mt-1 relative">
                <input
                  id="newPassword"
                  v-model="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  :class="{ 'border-red-500': error && newPassword }"
                >
              </div>
            </div>

            <!-- Confirmar Contraseña -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                Confirmar Nueva Contraseña
              </label>
              <div class="mt-1 relative">
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                  :class="{ 'border-red-500': error && confirmPassword }"
                >
              </div>
            </div>

            <!-- Mensajes de estado -->
            <div v-if="error" class="rounded-md bg-red-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
                </div>
              </div>
            </div>

            <div v-if="success" class="rounded-md bg-green-50 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">{{ success }}</h3>
                </div>
              </div>
            </div>

            <!-- Botón de envío -->
            <div>
              <button
                type="submit"
                :disabled="loading"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="!loading">Restablecer Contraseña</span>
                <span v-else class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              </button>
            </div>
          </form>

          <div class="mt-6 text-center">
            <router-link 
              to="/iniciar-sesion" 
              class="font-medium text-yellow-600 hover:text-yellow-500 text-sm"
            >
              Volver a Iniciar Sesión
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PasswordService } from '../services/auth';
import { confirmPasswordReset } from 'firebase/auth';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute();
    const oobCode = route.query.oobCode;
    
    return { oobCode };
  },
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      loading: false,
      error: '',
      success: ''
    };
  },
  methods: {
    async handleResetPassword() {
      if (this.newPassword !== this.confirmPassword) {
        this.error = 'Las contraseñas no coinciden';
        return;
      }
      
      if (this.newPassword.length < 6) {
        this.error = 'La contraseña debe tener al menos 6 caracteres';
        return;
      }
      
      this.loading = true;
      this.error = '';
      this.success = '';
      
      try {
        await confirmPasswordReset(auth, this.oobCode, this.newPassword);
        this.success = '¡Contraseña actualizada con éxito! Ahora puedes iniciar sesión con tu nueva contraseña.';
        this.newPassword = '';
        this.confirmPassword = '';
      } catch (error) {
        this.error = PasswordService.getErrorMessage(error.code);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>