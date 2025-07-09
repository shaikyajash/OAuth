import React, { useEffect } from 'react';
import axios from 'axios'; // ✅ Make sure axios is imported

export const TestScreen = () => {

  useEffect(() => {
    // Debugging: Log cookies and environment variables
    console.log('🍪 All cookies:', document.cookie);
    console.log('🌐 Backend URL:', import.meta.env.VITE_BACKEND_URL);
    console.log('🔗 Frontend URL:', import.meta.env.VITE_FRONTEND_URL);

    axios.get('https://oauth-1i2f.onrender.com/test', {
      withCredentials: true // ✅ Required to send and receive cookies
    })
      .then(response => {
        console.log('✅ Response from /test:', response.data);
      })
      .catch(error => {
        console.error('❌ Error fetching /test:', error);
      });
  }, []);

  return <div>TestScreen</div>;
};
