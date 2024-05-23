import React, { useState } from 'react';
import { customAlphabet } from 'nanoid';

const GeneratePassword = () => {
  const [password, setPassword] = useState(''); // Store the generated password

  // Function to generate a random password with given length and characters
  const generatePassword = (length = 12) => {
    // You can change the characters to your desired set for password generation
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    const nanoid = customAlphabet(alphabet, length);
    return nanoid();
  };

  const handleGenerate = () => {
    const newPassword = generatePassword(); // Generate a new password
    setPassword(newPassword); // Update the state with the new password
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h3>Сгенерируйте надежный пароль</h3>
      <button onClick={handleGenerate} style={{ marginBottom: '1em' }}>
        Сгенерировать пароль
      </button>
      <input
        type="text"
        readOnly
        value={password}
        style={{ width: '300px', textAlign: 'center' }}
        placeholder="Пароль появится здесь"
      />
    </div>
  );
};

export default GeneratePassword;
