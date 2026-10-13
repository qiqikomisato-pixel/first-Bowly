import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import pageStyles from '../../styles/page.module.css'
import styles from './Home.module.css'

export default function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const steps = [
    { emoji: '🍚', label: t('steps.base') },
    { emoji: '🍗', label: t('steps.protein') },
    { emoji: '🥬', label: t('steps.vegetables') },
    { emoji: '🧂', label: t('steps.sauce') },
    { emoji: '🌿', label: t('steps.topping') },
  ]

  const popularSets = [
    { id: 1, name: 'Классический', price: 450, ingredients: 'Рис, курица, огурцы, соус терияки' },
    { id: 2, name: 'С лососем', price: 520, ingredients: 'Рис, лосось, авокадо, соус унаги' },
    { id: 3, name: 'Вегетарианский', price: 380, ingredients: 'Киноа, тофу, перец, соус песто' },
  ]

  return (
    <>
      <div className={pageStyles.container}>
        <h1 className={pageStyles.title}>
          {t('home.title')}
        </h1>
        <p className={pageStyles.subtitle}>
          {t('home.subtitle')}
        </p>
        <button 
          className={styles.button}
          onClick={() => navigate('/catalog')}
        >
          {t('home.button')}
        </button>
      </div>

      <div className={styles.stepsSection}>
        <h2 className={styles.sectionTitle}>{t('home.howItWorks')}</h2>
        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepCard}>
              <span className={styles.stepEmoji}>{step.emoji}</span>
              <span className={styles.stepLabel}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.setsSection}>
        <div className={styles.setsHeader}>
          <h2 className={styles.sectionTitle}>{t('home.popularSets')}</h2>
          <button 
            className={styles.viewAllBtn}
            onClick={() => navigate('/sets')}
          >
            {t('home.viewAll')}
          </button>
        </div>
        <div className={styles.setsGrid}>
          {popularSets.map((set) => (
            <div key={set.id} className={styles.setCard}>
              <div className={styles.setImage}>🥗</div>
              <h3 className={styles.setName}>{set.name}</h3>
              <p className={styles.setIngredients}>{set.ingredients}</p>
              <p className={styles.setPrice}>{set.price} ₽</p>
              <button className={styles.setButton}>{t('sets.addToCart')}</button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}