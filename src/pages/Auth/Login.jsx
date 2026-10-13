import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import pageStyles from '../../styles/page.module.css'
import styles from './Auth.module.css'

export default function Login() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    
    if (email && password) {
      const isAdmin = email === 'admin@gmail.com' && password === 'admin123'
      const name = isAdmin ? 'Администратор' : 'Пользователь'
      
      const user = { 
        name, 
        email, 
        role: isAdmin ? 'admin' : 'user'
      }
      
      localStorage.setItem('user', JSON.stringify(user))
      
      if (isAdmin) {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } else {
      setError(t('auth.error'))
    }
  }

  return (
    <div className={pageStyles.container}>
      <div className={styles.authBox}>
        <h1 className={pageStyles.title}>{t('auth.login')}</h1>
        <p className={pageStyles.subtitle}>{t('auth.loginSubtitle')}</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>{t('auth.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.ru"
              required
            />
          </div>

          <div className={styles.field}>
            <label>{t('auth.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn}>
            {t('auth.login')}
          </button>

          <p className={styles.switch}>
            {t('auth.noAccount')} <Link to="/register">{t('auth.registerLink')}</Link>
          </p>
        </form>
      </div>
    </div>
  )
}