// src/components/PasswordStrengthChecker.js
import React, { useEffect, useState } from 'react';

const PasswordStrengthChecker = ({ password, setPassword }) => {
    const [strength, setStrength] = useState('');
    const [showGenerateButton, setShowGenerateButton] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');

    const checkPasswordStrength = (password) => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const weakPasswordRegex = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d]{6,}$/;

        if (strongPasswordRegex.test(password)) {
            setStrength('Strong');
            setShowGenerateButton(false);
        } else if (weakPasswordRegex.test(password)) {
            setStrength('Medium');
            setShowGenerateButton(true);
        } else {
            setStrength('Weak');
            setShowGenerateButton(true);
        }
    };

    const generateStrongPassword = () => {
        const length = 12; // Desired length of the strong password
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$!%*?&";
        let password = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        setGeneratedPassword(password);
        setPassword(password); // Update the password input with the generated password
    };

    useEffect(() => {
        checkPasswordStrength(password);
    }, [password]);

    return (
        <div>
            <p style={{ color: strength === 'Strong' ? 'green' : strength === 'Medium' ? 'orange' : 'red' }}>
                Password Strength: <strong>{strength}</strong>
            </p>
            {strength === 'Weak' && (
                <p>Your password should be at least 8 characters long, include uppercase letters, numbers, and special characters.</p>
            )}
            {strength === 'Medium' && (
                <p>Consider adding more characters and special symbols to strengthen your password.</p>
            )}
            {showGenerateButton && (
                <button
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                    onClick={generateStrongPassword}
                >
                    Generate Strong Password
                </button>
            )}
            {generatedPassword && (
                <div className="mt-2">
                    <p>Generated Strong Password: <strong>{generatedPassword}</strong></p>
                </div>
            )}
        </div>
    );
};

export default PasswordStrengthChecker;
