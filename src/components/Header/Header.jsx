import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import styles from './Header.module.css'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t, i18n } = useTranslation()
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })
  const menuRef = useRef(null)
  const burgerRef = useRef(null)
  
  const cartCount = useSelector(state => state.cart.totalCount)
  const [isAuth, setIsAuth] = useState(() => {
    return !!localStorage.getItem('user')
  })
  const [isAdmin, setIsAdmin] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.role === 'admin'
  })

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light')
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ru' ? 'en' : 'ru'
    i18n.changeLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setIsAuth(false)
    setIsAdmin(false)
    navigate('/')
    closeMenu()
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme)
      setIsDark(savedTheme === 'dark')
    }
    setIsAuth(!!localStorage.getItem('user'))
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    setIsAdmin(user.role === 'admin')
  }, [location])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        burgerRef.current &&
        !burgerRef.current.contains(event.target)
      ) {
        closeMenu()
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <div className={styles.left}>
          <button 
            ref={burgerRef}
            className={styles.burger}
            onClick={toggleMenu}
          >
            ☰
          </button>
          <NavLink to="/" className={styles.logo} onClick={closeMenu}>
            BOWLY 🥗
          </NavLink>
        </div>

        <nav ref={menuRef} className={`${styles.nav} ${isMenuOpen ? styles.open : ''}`}>
          <NavLink to="/" className={styles.link} onClick={closeMenu}>
            {t('header.home')}
          </NavLink>
          <NavLink to="/sets" className={styles.link} onClick={closeMenu}>
            {t('header.sets')}
          </NavLink>
          <NavLink to="/catalog" className={styles.link} onClick={closeMenu}>
            {t('header.catalog')}
          </NavLink>
          <NavLink to="/my-bowl" className={styles.link} onClick={closeMenu}>
            {t('header.myBowl')}
          </NavLink>
          <NavLink to="/profile" className={styles.link} onClick={closeMenu}>
            {t('header.profile')}
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={styles.link} onClick={closeMenu}>
              {t('header.admin')}
            </NavLink>
          )}
          <div className={styles.mobileActions}>
            <button onClick={toggleLanguage} className={styles.mobileLangBtn}>
              {i18n.language === 'ru' ? '🇬🇧 EN' : '🇷🇺 RU'}
            </button>
            <button onClick={toggleTheme} className={styles.mobileThemeBtn}>
              {isDark ? '☀️ Светлая' : '🌙 Тёмная'}
            </button>
            {isAuth ? (
              <button onClick={handleLogout} className={styles.mobileLogoutBtn}>
                {t('header.logout')}
              </button>
            ) : (
              <NavLink to="/login" className={styles.mobileLoginLink} onClick={closeMenu}>
                {t('header.login')}
              </NavLink>
            )}
          </div>
        </nav>

        <div className={styles.right}>
          <button 
            onClick={toggleLanguage}
            className={styles.langBtn}
          >
            {i18n.language === 'ru' ? 'EN' : 'RU'}
          </button>

          <button 
            onClick={toggleTheme} 
            className={styles.themeBtn}
            aria-label="Переключить тему"
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {isAuth ? (
            <button onClick={handleLogout} className={styles.authBtn}>
              {t('header.logout')}
            </button>
          ) : (
            <button 
              onClick={() => navigate('/login')} 
              className={styles.authBtn}
            >
              {t('header.login')}
            </button>
          )}

          <button onClick={() => navigate('/cart')} className={styles.cart}>
            🛒
            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}