import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { addItem } from '../../store/slices/cartSlice'
import { getSelectedItems } from '../../data/products'
import pageStyles from '../../styles/page.module.css'
import styles from './MyBowl.module.css'

export default function MyBowl() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  
  const selected = location.state?.selected || null

  useEffect(() => {
    if (!selected) {
      navigate('/catalog')
    }
  }, [selected, navigate])

  if (!selected) {
    return null
  }

  const items = getSelectedItems(selected)
  
  const totalCalories = items.reduce((sum, item) => sum + item.calories, 0)
  const totalWeight = items.reduce((sum, item) => sum + parseInt(item.weight) || 0, 0)
  const totalProtein = items.reduce((sum, item) => sum + (item.protein || 0), 0)
  const totalFats = items.reduce((sum, item) => sum + (item.fats || 0), 0)
  const totalCarbs = items.reduce((sum, item) => sum + (item.carbs || 0), 0)
  const totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0)

  const handleAddToCart = () => {
    const bowl = {
      id: Date.now(),
      name: 'Мой боул',
      emoji: '🥗',
      price: totalPrice || 450,
      quantity: 1,
      ingredients: items.map(item => item.name).join(', ')
    }
    dispatch(addItem(bowl))
  }

  return (
    <div className={pageStyles.container}>
      <h1 className={pageStyles.title}>{t('myBowl.title')}</h1>
      <p className={pageStyles.subtitle}>{t('myBowl.subtitle')}</p>

      <div className={styles.bowlPreview}>
        <div className={styles.bowlEmoji}>🥗</div>
        <div className={styles.bowlStats}>
          <span>⚖️ {totalWeight}г</span>
          <span>🧩 {items.length} ингредиентов</span>
        </div>
      </div>

      <div className={styles.nutritionBlock}>
        <div className={styles.nutritionItem}>
          <span className={styles.nutritionIcon}>💪</span>
          <span className={styles.nutritionValue}>{totalProtein.toFixed(1)}г</span>
          <span className={styles.nutritionLabel}>Белки</span>
        </div>
        <div className={styles.nutritionItem}>
          <span className={styles.nutritionIcon}>🧈</span>
          <span className={styles.nutritionValue}>{totalFats.toFixed(1)}г</span>
          <span className={styles.nutritionLabel}>Жиры</span>
        </div>
        <div className={styles.nutritionItem}>
          <span className={styles.nutritionIcon}>🌾</span>
          <span className={styles.nutritionValue}>{totalCarbs.toFixed(1)}г</span>
          <span className={styles.nutritionLabel}>Углеводы</span>
        </div>
        <div className={styles.nutritionItem}>
          <span className={styles.nutritionIcon}>🔥</span>
          <span className={styles.nutritionValue}>{totalCalories}</span>
          <span className={styles.nutritionLabel}>ккал</span>
        </div>
      </div>

      <div className={styles.ingredientsList}>
        {items.map((item, index) => (
          <div key={index} className={styles.ingredientItem}>
            <span className={styles.ingredientEmoji}>{item.emoji}</span>
            <div className={styles.ingredientInfo}>
              <span className={styles.ingredientName}>{item.name}</span>
              <span className={styles.ingredientCategory}>{item.category}</span>
            </div>
            <span className={styles.ingredientWeight}>{item.weight}</span>
            <span className={styles.ingredientCalories}>{item.calories} ккал</span>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button 
          onClick={() => navigate('/catalog', { state: { selected, step: 5 } })} 
          className={styles.editBtn}
        >
          {t('myBowl.edit')}
        </button>
        <button onClick={handleAddToCart} className={styles.addToCartBtn}>
          {t('myBowl.addToCart')}
        </button>
      </div>
    </div>
  )
}