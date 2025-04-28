<template>
  <div class="change-password-container">
    <h2>Cambiar Contraseña</h2>
    
    <form @submit.prevent="handleChangePassword" class="password-form">
      <div class="form-group">
        <label for="currentPassword">Contraseña Actual:</label>
        <input
          type="password"
          id="currentPassword"
          v-model="currentPassword"
          required
          class="form-input"
        />
      </div>
      
      <div class="form-group">
        <label for="newPassword">Nueva Contraseña:</label>
        <input
          type="password"
          id="newPassword"
          v-model="newPassword"
          required
          class="form-input"
        />
      </div>
      
      <div class="form-group">
        <label for="confirmPassword">Confirmar Nueva Contraseña:</label>
        <input
          type="password"
          id="confirmPassword"
          v-model="confirmPassword"
          required
          class="form-input"
        />
      </div>
      
      <button 
        type="submit" 
        :disabled="loading"
        class="submit-btn"
      >
        {{ loading ? 'Procesando...' : 'Cambiar Contraseña' }}
      </button>
      
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="success" class="success-message">{{ success }}</div>
    </form>
  </div>
</template>

<script>
import { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';

export default {
  name: 'ChangePassword', // Nombre del componente para mejor debugging
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      loading: false,
      error: '',
      success: ''
    };
  },
  methods: {
    async handleChangePassword() {
      // Validación básica
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
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user || !user.email) {
          throw new Error('No hay usuario autenticado');
        }

        // Reautenticación
        const credential = EmailAuthProvider.credential(
          user.email, 
          this.currentPassword
        );
        
        await reauthenticateWithCredential(user, credential);
        
        // Cambio de contraseña
        await updatePassword(user, this.newPassword);
        
        this.success = '¡Contraseña cambiada exitosamente!';
        this.resetForm();
        
      } catch (error) {
        console.error('Error en handleChangePassword:', error);
        this.error = this.getFirebaseErrorMessage(error);
      } finally {
        this.loading = false;
      }
    },
    
    getFirebaseErrorMessage(error) {
      const errorCode = error.code || '';
      
      switch (errorCode) {
        case 'auth/wrong-password':
          return 'La contraseña actual es incorrecta';
        case 'auth/requires-recent-login':
          return 'Debes volver a iniciar sesión para realizar esta acción';
        case 'auth/weak-password':
          return 'La contraseña debe tener al menos 6 caracteres';
        case 'auth/user-not-found':
          return 'Usuario no encontrado';
        case 'auth/too-many-requests':
          return 'Demasiados intentos fallidos. Intenta más tarde';
        default:
          return error.message || 'Ocurrió un error al cambiar la contraseña';
      }
    },
    
    resetForm() {
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    }
  }
};
</script>

<style scoped>
.change-password-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.submit-btn {
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #369f6b;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #ff4444;
  padding: 8px;
  background-color: #ffebee;
  border-radius: 4px;
}

.success-message {
  color: #00C851;
  padding: 8px;
  background-color: #e8f5e9;
  border-radius: 4px;
}
</style>