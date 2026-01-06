import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { RegisterRequest } from '../types';
import Toast from '../components/Toast';
import Logo from '../components/Logo';
import FallingStars from '../components/FallingStars';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterRequest>({
    userId: '',
    name: '',
    email: '',
    password: '',
    role: 'Student'
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!validatePassword(formData.password)) {
      setToast({ message: 'סיסמה חייבת להכיל 8+ תווים, אותיות ומספרים', type: 'error' });
      setLoading(false);
      return;
    }
    
    try {
      console.log('📝 Registration attempt for:', formData.email);
      const response = await authService.register(formData);
      
      setToast({ message: 'הרשמה בוצעה בהצלחה', type: 'success' });
      
      setTimeout(() => {
        if (response.user.role === 'Teacher') {
          navigate('/teacher');
        } else {
          navigate('/student');
        }
      }, 1000);
      
    } catch (error: any) {
      console.error('❌ Registration failed:', error.response?.data?.message || error.message);
      setToast({ 
        message: error.response?.data?.message || 'שגיאה בהרשמה', 
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
        הצטרפות למצוינות
      </div>
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, textAlign: 'center' }}>הרשמה למערכת</h2>
        
        <input
          type="text"
          placeholder="מזהה משתמש"
          className="luxury-input"
          value={formData.userId}
          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
          required
        />
        
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
        
        <select
          className="luxury-input"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Student' | 'Teacher' })}
        >
          <option value="Student">תלמיד</option>
          <option value="Teacher">מורה</option>
        </select>
        
        <button 
          type="submit" 
          className="luxury-button"
          disabled={!validatePassword(formData.password) || loading}
        >
          {loading ? '⏳ נרשם...' : 'הרשמה'}
        </button>
        
        <p style={{ textAlign: 'center', fontWeight: 300 }}>
          יש לך חשבון? 
          <span 
            style={{ textDecoration: 'underline', cursor: 'pointer', marginRight: '0.5rem' }}
            onClick={() => navigate('/login')}
          >
            כניסה
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

export default Register;