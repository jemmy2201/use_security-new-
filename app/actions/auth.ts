
export async function logout() {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
  
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      window.location.href = '/signin';
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  }