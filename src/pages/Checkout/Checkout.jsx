import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { clearCart } from '../../store/slices/cartSlice'
import pageStyles from '../../styles/page.module.css'
import styles from './Checkout.module.css'

export default function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { items, totalPrice } = useSelector(state => state.cart)

  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    address: '',
    entrance: '',
    apartment: '',
    phone: '',
    comment: '',
  })
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const nextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(clearCart())
    navigate('/')
  }

  return (
    <div className={pageStyles.container}>
      <h1 className={pageStyles.title}>{t('checkout.title')}</h1>
      <p className={pageStyles.subtitle}>{t('checkout.subtitle')}</p>

      <div className={styles.steps}>
        <div className={`${styles.stepIndicator} ${step >= 1 ? styles.active : ''}`}>
          <span>1</span> {t('checkout.step1')}
        </div>
        <div className={`${styles.stepIndicator} ${step >= 2 ? styles.active : ''}`}>
          <span>2</span> {t('checkout.step2')}
        </div>
        <div className={`${styles.stepIndicator} ${step >= 3 ? styles.active : ''}`}>
          <span>3</span> {t('checkout.step3')}
        </div>
      </div>

      <div className={styles.checkoutBox}>
        {step === 1 && (
          <div className={styles.stepContent}>
            <h2>{t('checkout.address')}</h2>
            <div className={styles.formGroup}>
              <label>{t('checkout.addressLabel')}</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder={t('placeholder.address')}
                required
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>{t('checkout.entrance')}</label>
                <input
                  name="entrance"
                  value={form.entrance}
                  onChange={handleChange}
                  placeholder={t('placeholder.entrance')}
                />
              </div>
              <div className={styles.formGroup}>
                <label>{t('checkout.apartment')}</label>
                <input
                  name="apartment"
                  value={form.apartment}
                  onChange={handleChange}
                  placeholder={t('placeholder.apartment')}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>{t('checkout.phone')}</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder={t('placeholder.phone')}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t('checkout.comment')}</label>
              <textarea
                name="comment"
                value={form.comment}
                onChange={handleChange}
                placeholder={t('placeholder.comment')}
                rows={3}
              />
            </div>
            <button className={styles.nextBtn} onClick={nextStep}>
              {t('catalog.next')}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className={styles.stepContent}>
            <h2>{t('checkout.delivery')}</h2>
            <div className={styles.formGroup}>
              <label>{t('checkout.date')}</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>{t('checkout.time')}</label>
              <select
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
                required
              >
                <option value="">{t('checkout.selectTime')}</option>
                <option value="12:00-14:00">12:00 - 14:00</option>
                <option value="14:00-16:00">14:00 - 16:00</option>
                <option value="16:00-18:00">16:00 - 18:00</option>
                <option value="18:00-20:00">18:00 - 20:00</option>
                <option value="20:00-22:00">20:00 - 22:00</option>
              </select>
            </div>
            <div className={styles.stepNav}>
              <button className={styles.prevBtn} onClick={prevStep}>
                {t('catalog.back')}
              </button>
              <button className={styles.nextBtn} onClick={nextStep}>
                {t('catalog.next')}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.stepContent}>
            <h2>{t('checkout.confirm')}</h2>
            <div className={styles.orderSummary}>
              <h3>{t('checkout.summary')}</h3>
              {items.map((item, index) => (
                <div key={index} className={styles.summaryItem}>
                  <span>{item.emoji} {item.name}</span>
                  <span>{item.quantity} × {item.price} ₽</span>
                </div>
              ))}
              <div className={styles.summaryTotal}>
                <strong>{t('checkout.total')}:</strong>
                <strong>{totalPrice} ₽</strong>
              </div>
            </div>

            <div className={styles.deliveryInfo}>
              <p><strong>{t('checkout.addressLabel')}</strong> {form.address}</p>
              {form.entrance && <p><strong>{t('checkout.entrance')}</strong> {form.entrance}</p>}
              {form.apartment && <p><strong>{t('checkout.apartment')}</strong> {form.apartment}</p>}
              <p><strong>{t('checkout.phone')}</strong> {form.phone}</p>
              <p><strong>{t('checkout.date')}</strong> {deliveryDate}</p>
              <p><strong>{t('checkout.time')}</strong> {deliveryTime}</p>
              {form.comment && <p><strong>{t('checkout.comment')}</strong> {form.comment}</p>}
            </div>

            <div className={styles.stepNav}>
              <button className={styles.prevBtn} onClick={prevStep}>
                {t('catalog.back')}
              </button>
              <button className={styles.submitBtn} onClick={handleSubmit}>
                {t('checkout.submit')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}