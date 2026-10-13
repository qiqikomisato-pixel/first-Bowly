import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import pageStyles from '../../styles/page.module.css'
import styles from './Admin.module.css'

export default function Admin() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('products')
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([
    { id: 1, name: 'Классический', price: 450, category: 'set', inStock: true },
    { id: 2, name: 'С лососем', price: 520, category: 'set', inStock: true },
    { id: 3, name: 'Вегетарианский', price: 380, category: 'set', inStock: false },
  ])
  const [orders, setOrders] = useState([
    { id: 1, user: 'Иван', total: 870, status: t('profile.statuses.delivered'), date: '10.08.2026' },
    { id: 2, user: 'Мария', total: 450, status: t('profile.statuses.cooking'), date: '05.08.2026' },
    { id: 3, user: 'Петр', total: 1340, status: t('profile.statuses.pending'), date: '28.07.2026' },
  ])
  const [users, setUsers] = useState([
    { id: 1, name: 'Иван Иванов', email: 'ivan@mail.ru', registered: '10.08.2026' },
    { id: 2, name: 'Мария Петрова', email: 'maria@mail.ru', registered: '05.08.2026' },
  ])

  useEffect(() => {
    const saved = localStorage.getItem('user')
    if (saved) {
      const parsed = JSON.parse(saved)
      setUser(parsed)
      if (parsed.role !== 'admin') {
        navigate('/')
      }
    } else {
      navigate('/login')
    }
  }, [navigate])

  if (!user || user.role !== 'admin') {
    return null
  }

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const changeOrderStatus = (id, newStatus) => {
    setOrders(orders.map(o => 
      o.id === id ? { ...o, status: newStatus } : o
    ))
  }

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
      <h1 className={pageStyles.title}>{t('admin.title')}</h1>
      <p className={pageStyles.subtitle}>{t('admin.subtitle')}</p>

      <div className={styles.adminTabs}>
        <button 
          className={`${styles.adminTab} ${activeTab === 'products' ? styles.activeAdminTab : ''}`}
          onClick={() => setActiveTab('products')}
        >
          {t('admin.tabs.products')}
        </button>
        <button 
          className={`${styles.adminTab} ${activeTab === 'orders' ? styles.activeAdminTab : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          {t('admin.tabs.orders')}
        </button>
        <button 
          className={`${styles.adminTab} ${activeTab === 'users' ? styles.activeAdminTab : ''}`}
          onClick={() => setActiveTab('users')}
        >
          {t('admin.tabs.users')}
        </button>
      </div>

      <div className={styles.adminContent}>
        {activeTab === 'products' && (
          <div>
            <div className={styles.adminHeader}>
              <h2>{t('admin.products.title')}</h2>
              <button className={styles.addBtn}>{t('admin.products.add')}</button>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>{t('admin.products.name')}</th>
                    <th>{t('admin.products.price')}</th>
                    <th>{t('admin.products.category')}</th>
                    <th>{t('admin.products.inStock')}</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.price} ₽</td>
                      <td>{p.category}</td>
                      <td>
                        <span className={p.inStock ? styles.inStock : styles.outStock}>
                          {p.inStock ? t('admin.products.inStockYes') : t('admin.products.inStockNo')}
                        </span>
                      </td>
                      <td>
                        <button className={styles.editBtn}>✏️</button>
                        <button className={styles.deleteBtn} onClick={() => deleteProduct(p.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <h2>{t('admin.orders.title')}</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>{t('admin.orders.number')}</th>
                    <th>{t('admin.orders.user')}</th>
                    <th>{t('admin.orders.total')}</th>
                    <th>{t('admin.orders.date')}</th>
                    <th>{t('admin.orders.status')}</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>{o.user}</td>
                      <td>{o.total} ₽</td>
                      <td>{o.date}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${getStatusClass(o.status)}`}>
                          {o.status}
                        </span>
                      </td>
                      <td>
                        <select 
                          value={o.status}
                          onChange={(e) => changeOrderStatus(o.id, e.target.value)}
                          className={styles.statusSelect}
                        >
                          <option value={t('profile.statuses.pending')}>{t('profile.statuses.pending')}</option>
                          <option value={t('profile.statuses.cooking')}>{t('profile.statuses.cooking')}</option>
                          <option value={t('profile.statuses.delivering')}>{t('profile.statuses.delivering')}</option>
                          <option value={t('profile.statuses.delivered')}>{t('profile.statuses.delivered')}</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <h2>{t('admin.users.title')}</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>{t('admin.users.name')}</th>
                    <th>{t('admin.users.email')}</th>
                    <th>{t('admin.users.registered')}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.registered}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}