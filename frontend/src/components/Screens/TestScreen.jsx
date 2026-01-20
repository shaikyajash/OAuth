import React, { useEffect } from 'react';
import axios from 'axios'; // ✅ Make sure axios is imported

export const TestScreen = () => {

  useEffect(() => {
    axios.get('https://oauth-1i2f.onrender.com/test', {
      withCredentials: true // ✅ Required to send and receive cookies
    })
      .then(() => {
        // Request successful
      })
      .catch(error => {
        console.error('❌ Error fetching /test:', error);
      });
  }, []);

  return <div>TestScreen</div>;
};
