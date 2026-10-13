import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import pageStyles from '../../styles/page.module.css'
import styles from './Profile.module.css'

export default function Profile() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('data')
  const [user, setUser] = useState({ name: '', email: '' })

  useEffect(() => {
    const saved = localStorage.getItem('user')
    if (saved) {
      setUser(JSON.parse(saved))
    } else {
      navigate('/login')
    }
  }, [navigate])

  const orders = [
    { id: 1, date: '10.08.2026', total: 870, status: t('profile.statuses.delivered'), items: 2 },
    { id: 2, date: '05.08.2026', total: 450, status: t('profile.statuses.cooking'), items: 1 },
    { id: 3, date: '28.07.2026', total: 1340, status: t('profile.statuses.delivered'), items: 3 },
  ]

  const recipes = [
    { id: 1, name: 'Мой любимый боул', ingredients: 'Рис, курица, авокадо, соус песто', date: '12.08.2026' },
    { id: 2, name: 'Острый с креветками', ingredients: 'Лапша, креветки, перец, соус том ям', date: '08.08.2026' },
  ]

  const getStatusClass = (status) => {
    const map = {
      [t('profile.statuses.delivered')]: styles.statusDelivered,
      [t('profile.statuses.cooking')]: styles.statusCooking,
      [t('profile.statuses.delivering')]: styles.statusDelivering,
      [t('profile.statuses.pending')]: styles.statusPending,
    }
    return map[status] || styles.statusPending
  }

  return (
    <div className={pageStyles.container}>
      <h1 className={pageStyles.title}>{t('profile.title')}</h1>
      <p className={pageStyles.subtitle}>{t('profile.subtitle')}</p>

      <div className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'data' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('data')}
        >
          {t('profile.tabs.data')}
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'orders' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          {t('profile.tabs.orders')}
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'recipes' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          {t('profile.tabs.recipes')}
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'data' && (
          <div className={styles.dataTab}>
            <div className={styles.field}>
              <label>{t('profile.name')}</label>
              <input type="text" value={user.name || ''} readOnly />
            </div>
            <div className={styles.field}>
              <label>{t('profile.email')}</label>
              <input type="email" value={user.email || ''} readOnly />
            </div>
            <button className={styles.editBtn}>{t('profile.edit')}</button>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className={styles.ordersTab}>
            {orders.length === 0 ? (
              <p className={styles.emptyText}>{t('profile.noOrders')}</p>
            ) : (
              orders.map(order => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <span className={styles.orderId}>{t('profile.order')}{order.id}</span>
                    <span className={styles.orderDate}>{order.date}</span>
                  </div>
                  <div className={styles.orderDetails}>
                    <span>{order.items} товара</span>
                    <span className={styles.orderTotal}>{order.total} ₽</span>
                  </div>
                  <span className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'recipes' && (
          <div className={styles.recipesTab}>
            {recipes.length === 0 ? (
              <p className={styles.emptyText}>{t('profile.noRecipes')}</p>
            ) : (
              recipes.map(recipe => (
                <div key={recipe.id} className={styles.recipeCard}>
                  <h3 className={styles.recipeName}>{recipe.name}</h3>
                  <p className={styles.recipeIngredients}>{recipe.ingredients}</p>
                  <span className={styles.recipeDate}>{recipe.date}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}