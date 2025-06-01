<template>
</template>

<script>
import { auth } from '@/firebase/config';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    const logout = async () => {
      try {
        await auth.signOut();
        router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };

    return { logout };
  },
};
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
</style>
