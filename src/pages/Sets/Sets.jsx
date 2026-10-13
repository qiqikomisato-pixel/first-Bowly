import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { addItem } from '../../store/slices/cartSlice'
import { getProducts } from '../../api/products'
import pageStyles from '../../styles/page.module.css'
import styles from './Sets.module.css'

export default function Sets() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [filter, setFilter] = useState('all')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (error) {
        console.error('Ошибка загрузки товаров:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filters = [
    { id: 'all', label: t('sets.filters.all') },
    { id: 'chicken', label: t('sets.filters.chicken') },
    { id: 'seafood', label: t('sets.filters.seafood') },
    { id: 'vegan', label: t('sets.filters.vegan') },
    { id: 'spicy', label: t('sets.filters.spicy') },
  ]

  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter)

  const handleAddToCart = (product) => {
    dispatch(addItem({
      id: Date.now() + product.id,
      name: product.name,
      emoji: product.emoji,
      price: product.price,
      quantity: 1,
      ingredients: product.ingredients
    }))
  }

  if (loading) {
    return (
      <div className={pageStyles.container}>
        <h1 className={pageStyles.title}>{t('sets.title')}</h1>
        <p className={pageStyles.subtitle}>Загрузка...</p>
      </div>
    )
  }

  return (
    <div className={pageStyles.container}>
      <h1 className={pageStyles.title}>{t('sets.title')}</h1>
      <p className={pageStyles.subtitle}>{t('sets.subtitle')}</p>

      <div className={styles.filters}>
        {filters.map(f => (
          <button
            key={f.id}
            className={`${styles.filterBtn} ${filter === f.id ? styles.activeFilter : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={styles.setsGrid}>
        {filteredProducts.map(product => (
          <div key={product.id} className={styles.setCard}>
            <div className={styles.setEmoji}>{product.emoji || '🥗'}</div>
            <h3 className={styles.setName}>{product.name}</h3>
            <div className={styles.setTags}>
              {product.tags && product.tags.map((tag, i) => (
                <span key={i} className={styles.tag}>{tag}</span>
              ))}
            </div>
            <div className={styles.setNutrition}>
              <span>🔥 {product.calories || 0} ккал</span>
              <span>💪 {product.protein || 0}г</span>
              <span>🧈 {product.fats || 0}г</span>
              <span>🌾 {product.carbs || 0}г</span>
            </div>
            <div className={styles.setFooter}>
              <span className={styles.setPrice}>{product.price} ₽</span>
              <button 
                className={styles.addBtn}
                onClick={() => handleAddToCart(product)}
              >
                {t('sets.addToCart')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}