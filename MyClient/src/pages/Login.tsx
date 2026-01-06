import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { LoginRequest } from '../types';
import Toast from '../components/Toast';
import Logo from '../components/Logo';
import FallingStars from '../components/FallingStars';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    name: '',
    email: '',
    password: ''
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('🔐 Login attempt for:', formData.email);
      const response = await authService.login(formData);
      
      setToast({ message: 'התחברות בוצעה בהצלחה', type: 'success' });
      
      setTimeout(() => {
        if (response.user.role === 'Teacher') {
          navigate('/teacher');
        } else {
          navigate('/student');
        }
      }, 1000);
      
    } catch (error: any) {
      console.error('❌ Login failed:', error.response?.data?.message || error.message);
      setToast({ 
        message: error.response?.data?.message || 'שגיאה בהתחברות', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (password: string): boolean => {
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return password.length >= 8 && hasLetter && hasNumber;
  };

  return (
    <div className="auth-container">
      <div className="page-logo">
        <Logo />
      </div>
      
      <FallingStars isActive={loading} />
      
      <div className="hero-message">
        מצוינות היא לא פעולה, היא הרגל
      </div>
      <p style={{ fontSize: '1.2rem', fontWeight: 300, marginBottom: '3rem', textAlign: 'center' }}>
        המקום שלך להגשת הישגים
      </p>
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center' }}>כניסה למערכת</h2>
        
        <input
          type="text"
          placeholder="שם מלא"
          className="luxury-input"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        
        <input
          type="email"
          placeholder="אימייל"
          className="luxury-input"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        
        <input
          type="password"
          placeholder="סיסמה (8+ תווים, אותיות ומספרים)"
          className="luxury-input"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        
        <button 
          type="submit" 
          className="luxury-button"
          disabled={!validatePassword(formData.password) || loading}
        >
          {loading ? '⏳ מתחבר...' : 'כניסה'}
        </button>
        
        <p style={{ textAlign: 'center', fontWeight: 300 }}>
          אין לך חשבון? 
          <span 
            style={{ textDecoration: 'underline', cursor: 'pointer', marginRight: '0.5rem' }}
            onClick={() => navigate('/register')}
          >
            הרשמה
          </span>
        </p>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Login;