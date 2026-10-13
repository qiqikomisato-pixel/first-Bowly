import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { removeItem, updateQuantity } from '../../store/slices/cartSlice'
import pageStyles from '../../styles/page.module.css'
import styles from './Cart.module.css'

export default function Cart() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { items, totalCount, totalPrice } = useSelector(state => state.cart)

  const removeFromCart = (id) => {
    dispatch(removeItem(id))
  }

  const changeQuantity = (id, quantity) => {
    if (quantity < 1) return
    dispatch(updateQuantity({ id, quantity }))
  }

  return (
    <div className={pageStyles.container}>
      <h1 className={pageStyles.title}>{t('cart.title')}</h1>
      <p className={pageStyles.subtitle}>
        {items.length === 0 ? t('cart.empty') : `${totalCount} товаров на сумму ${totalPrice} ₽`}
      </p>

      {items.length === 0 ? (
        <div className={styles.emptyCart}>
          <span className={styles.emptyEmoji}>🛒</span>
          <p>{t('cart.empty')}</p>
          <button onClick={() => navigate('/catalog')} className={styles.emptyBtn}>
            {t('cart.emptyBtn')}
          </button>
        </div>
      ) : (
        <>
          <div className={styles.cartList}>
            {items.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <span className={styles.itemEmoji}>{item.emoji}</span>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemPrice}>{item.price} ₽</span>
                  {item.ingredients && (
                    <span className={styles.itemIngredients}>{item.ingredients}</span>
                  )}
                </div>
                <div className={styles.itemActions}>
                  <button 
                    onClick={() => changeQuantity(item.id, item.quantity - 1)}
                    className={styles.qtyBtn}
                  >
                    −
                  </button>
                  <span className={styles.qtyCount}>{item.quantity}</span>
                  <button 
                    onClick={() => changeQuantity(item.id, item.quantity + 1)}
                    className={styles.qtyBtn}
                  >
                    +
                  </button>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className={styles.removeBtn}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <div className={styles.summaryRow}>
              <span>{t('cart.total')}</span>
              <span className={styles.summaryTotal}>{totalPrice} ₽</span>
            </div>
            <button 
              className={styles.checkoutBtn}
              onClick={() => navigate('/checkout')}
            >
              {t('cart.checkout')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}