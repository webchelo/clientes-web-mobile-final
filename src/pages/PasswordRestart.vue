<template>
    <div class="reset-password">
      <h2>Restablecer Contraseña</h2>
      
      <form @submit.prevent="handleResetPassword">
        <div class="form-group">
          <label for="newPassword">Nueva Contraseña</label>
          <input 
            type="password" 
            id="newPassword" 
            v-model="newPassword" 
            required
          />
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirmar Nueva Contraseña</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            required
          />
        </div>
        
        <button type="submit" :disabled="loading">
          {{ loading ? 'Procesando...' : 'Restablecer Contraseña' }}
        </button>
        
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>
      </form>
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
        
        this.loading = true;
        this.error = '';
        this.success = '';
        
        try {
          await confirmPasswordReset(auth, this.oobCode, this.newPassword);
          this.success = 'Contraseña restablecida con éxito. Puedes iniciar sesión con tu nueva contraseña.';
        } catch (error) {
          this.error = AuthService.getErrorMessage(error.code);
        } finally {
          this.loading = false;
        }
      }
    }
  };
  </script>