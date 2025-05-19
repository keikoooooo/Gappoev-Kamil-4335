import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { register } from '../services/authService';
import { logout } from '../services/authService';
import '../styles/RegistrationForm.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    student_card: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    contact_number: '',
    dormitory_id: '',
    room_id: '',
    group_number: '',
    specialization: '',
    role_id: '',
    email: '',
    phone: '',
    birth_date: '',
    course: '',
    faculty: '',
    social_links: {
      additionalProp1: '',
      additionalProp2: '',
      additionalProp3: '',
    },
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_links.')) {
      const key = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [key]: value,
        },
      }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.student_card.trim()) newErrors.student_card = 'Номер студенческого билета обязателен';
    if (!formData.password) newErrors.password = 'Пароль обязателен';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Подтверждение пароля обязательно';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }
    if (!formData.full_name.trim()) newErrors.full_name = 'Полное имя обязательно';
    if (!formData.email.trim()) newErrors.email = 'Электронная почта обязательна';
    if (!formData.dormitory_id) newErrors.dormitory_id = 'ID общежития обязателен';
    if (!formData.room_id) newErrors.room_id = 'ID комнаты обязателен';
    if (!formData.group_number) newErrors.group_number = 'Номер группы обязателен';
    if (!formData.specialization.trim()) newErrors.specialization = 'Специализация обязательна';
    if (!formData.role_id) newErrors.role_id = 'ID роли обязателен';
    if (!formData.course) newErrors.course = 'Курс обязателен';
    if (!formData.faculty.trim()) newErrors.faculty = 'Факультет обязателен';
    if (!formData.contact_number) newErrors.contact_number = 'Контактный номер обязателен';

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailPattern.test(formData.email)) {
      newErrors.email = 'Некорректный формат email';
    }

    const phonePattern = /^\+?\d{10,15}$/;
    if (formData.phone && !phonePattern.test(formData.phone)) {
      newErrors.phone = 'Некорректный формат телефона (например, +79991234567)';
    }

    if (formData.contact_number && (isNaN(formData.contact_number) || Number(formData.contact_number) <= 0)) {
      newErrors.contact_number = 'Контактный номер должен быть положительным числом';
    }

    if (formData.dormitory_id && (isNaN(formData.dormitory_id) || Number(formData.dormitory_id) <= 0)) {
      newErrors.dormitory_id = 'ID общежития должен быть положительным числом';
    }
    if (formData.room_id && (isNaN(formData.room_id) || Number(formData.room_id) <= 0)) {
      newErrors.room_id = 'ID комнаты должен быть положительным числом';
    }
    if (formData.group_number && (isNaN(formData.group_number) || Number(formData.group_number) <= 0)) {
      newErrors.group_number = 'Номер группы должен быть положительным числом';
    }
    if (formData.role_id && (isNaN(formData.role_id) || Number(formData.role_id) <= 0)) {
      newErrors.role_id = 'ID роли должен быть положительным числом';
    }
    if (formData.course && (isNaN(formData.course) || Number(formData.course) <= 0)) {
      newErrors.course = 'Курс должен быть положительным числом';
    }

    if (formData.birth_date) {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(formData.birth_date)) {
        newErrors.birth_date = 'Дата должна быть в формате ГГГГ-ММ-ДД';
      } else {
        const birthDate = new Date(formData.birth_date);
        const today = new Date('2025-05-18T23:40:00Z');
        let age = today.getUTCFullYear() - birthDate.getUTCFullYear();
        const monthDiff = today.getUTCMonth() - birthDate.getUTCMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getUTCDate() < birthDate.getUTCDate())) {
          age--;
        }
        if (age < 18) {
          newErrors.birth_date = 'Вы должны быть старше 18 лет';
        }
      }
    }

    const latinPattern = /^[A-Za-z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]*$/;
    if (formData.password && !latinPattern.test(formData.password)) {
      newErrors.password = 'Пароль должен содержать только латинские символы';
    }
    if (formData.full_name && !latinPattern.test(formData.full_name)) {
      newErrors.full_name = 'Имя должно содержать только латинские символы';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setErrors({});

    if (!validateForm()) return;

    const socialLinks = {};
    if (formData.social_links.additionalProp1) {
      socialLinks.additionalProp1 = formData.social_links.additionalProp1;
    }
    if (formData.social_links.additionalProp2) {
      socialLinks.additionalProp2 = formData.social_links.additionalProp2;
    }
    if (formData.social_links.additionalProp3) {
      socialLinks.additionalProp3 = formData.social_links.additionalProp3;
    }

    let birthDateUTC = formData.birth_date ? new Date(formData.birth_date).toISOString() : new Date('2000-01-01').toISOString();

    const dataToSend = {
      student_card: formData.student_card,
      password: formData.password,
      full_name: formData.full_name,
      contact_number: formData.contact_number || '0',
      dormitory_id: Number(formData.dormitory_id),
      room_id: Number(formData.room_id),
      group_number: Number(formData.group_number),
      specialization: formData.specialization,
      role_id: Number(formData.role_id),
      email: formData.email,
      phone: formData.phone || '',
      birth_date: birthDateUTC,
      course: Number(formData.course),
      faculty: formData.faculty,
      social_links: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
    };

    console.log('Data sent before request:', JSON.stringify(dataToSend, null, 2));

    try {
      const response = await register(dataToSend);
      console.log('Server response:', response);
      navigate('/login');
    } catch (err) {
      let errorMessage = 'Ошибка регистрации';
      if (err.response?.data?.detail) {
        if (Array.isArray(err.response.data.detail)) {
          const newServerErrors = {};
          err.response.data.detail.forEach(error => {
            console.log('Error detail:', error);
            const field = error.loc[1];
            newServerErrors[field] = error.msg;
          });
          setErrors(prev => ({ ...prev, ...newServerErrors }));
        } else {
          errorMessage = err.response.data.detail;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      setServerError(errorMessage);
      console.log('Server response:', err.response?.data);
      console.error('Register error:', err.response?.data || err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Регистрация</h2>
        {location.pathname === '/admin/register-users' && (
          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Выйти
          </button>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="student_card"
              value={formData.student_card}
              onChange={handleChange}
              placeholder="Номер студ. билета*"
              required
            />
            {errors.student_card && <span className="error-message">{errors.student_card}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Пароль*"
              required
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Подтвердите пароль*"
              required
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Полное имя*"
              required
            />
            {errors.full_name && <span className="error-message">{errors.full_name}</span>}
          </div>

          <div className="form-group">
            <input
              type="number"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              placeholder="Контактный номер*"
              required
            />
            {errors.contact_number && <span className="error-message">{errors.contact_number}</span>}
          </div>

          <div className="form-group">
            <input
              type="number"
              name="dormitory_id"
              value={formData.dormitory_id}
              onChange={handleChange}
              placeholder="ID общежития*"
              required
            />
            {errors.dormitory_id && <span className="error-message">{errors.dormitory_id}</span>}
          </div>

          <div className="form-group">
            <input
              type="number"
              name="room_id"
              value={formData.room_id}
              onChange={handleChange}
              placeholder="ID комнаты*"
              required
            />
            {errors.room_id && <span className="error-message">{errors.room_id}</span>}
          </div>

          <div className="form-group">
            <input
              type="number"
              name="group_number"
              value={formData.group_number}
              onChange={handleChange}
              placeholder="Номер группы*"
              required
            />
            {errors.group_number && <span className="error-message">{errors.group_number}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Специализация*"
              required
            />
            {errors.specialization && <span className="error-message">{errors.specialization}</span>}
          </div>

          <div className="form-group">
            <input
              type="number"
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              placeholder="ID роли*"
              required
            />
            {errors.role_id && <span className="error-message">{errors.role_id}</span>}
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Электронная почта*"
              required
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Телефон (например, +79991234567)"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              placeholder="Дата рождения (ГГГГ-ММ-ДД)"
            />
            {errors.birth_date && <span className="error-message">{errors.birth_date}</span>}
          </div>

          <div className="form-group">
            <input
              type="number"
              name="course"
              value={formData.course}
              onChange={handleChange}
              placeholder="Курс*"
              required
            />
            {errors.course && <span className="error-message">{errors.course}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="faculty"
              value={formData.faculty}
              onChange={handleChange}
              placeholder="Факультет*"
              required
            />
            {errors.faculty && <span className="error-message">{errors.faculty}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="social_links.additionalProp1"
              value={formData.social_links.additionalProp1}
              onChange={handleChange}
              placeholder="Социальная сеть 1"
            />
            {errors.social_links?.additionalProp1 && <span className="error-message">{errors.social_links.additionalProp1}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="social_links.additionalProp2"
              value={formData.social_links.additionalProp2}
              onChange={handleChange}
              placeholder="Социальная сеть 2"
            />
            {errors.social_links?.additionalProp2 && <span className="error-message">{errors.social_links.additionalProp2}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="social_links.additionalProp3"
              value={formData.social_links.additionalProp3}
              onChange={handleChange}
              placeholder="Социальная сеть 3"
            />
            {errors.social_links?.additionalProp3 && <span className="error-message">{errors.social_links.additionalProp3}</span>}
          </div>

          <button type="submit" className="register-button">Зарегистрироваться</button>
          {serverError && <div className="error">{serverError}</div>}
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;