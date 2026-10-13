import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getIngredients } from '../../api/ingredients'
import pageStyles from '../../styles/page.module.css'
import styles from './Catalog.module.css'

export default function Catalog() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState({})
  const [loading, setLoading] = useState(true)
  const [allIngredients, setAllIngredients] = useState({})
  const totalSteps = 5

  // Загружаем ингредиенты из API
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const data = await getIngredients()
        const grouped = {}
        data.forEach(item => {
          if (!grouped[item.step]) {
            grouped[item.step] = []
          }
          grouped[item.step].push(item)
        })
        setAllIngredients(grouped)
      } catch (error) {
        console.error('Ошибка загрузки ингредиентов:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchIngredients()
  }, [])

  // Загружаем сохранённые данные при открытии
  useEffect(() => {
    if (location.state?.selected) {
      setSelected(location.state.selected)
    }
    if (location.state?.step) {
      setStep(location.state.step)
    }
  }, [location.state])

  const stepsData = {
    1: {
      title: 'Выбери основу',
      description: 'Что будет базой твоего боула?',
      multiple: false,
    },
    2: {
      title: 'Выбери белок',
      description: 'Добавь источник белка',
      multiple: false,
    },
    3: {
      title: 'Выбери овощи',
      description: 'Выбери до 3 овощей',
      multiple: true,
      maxSelect: 3,
    },
    4: {
      title: 'Выбери соус',
      description: 'Что придаст вкус твоему боулу?',
      multiple: false,
      canSkip: true,
    },
    5: {
      title: 'Выбери посыпку',
      description: 'Финишный штрих',
      multiple: false,
      canSkip: true,
    }
  }

  const currentData = stepsData[step]
  const currentOptions = allIngredients[step] || []

  const nutrition = useMemo(() => {
    let total = { calories: 0, protein: 0, fats: 0, carbs: 0 }
    
    Object.keys(selected).forEach(stepKey => {
      const stepNum = parseInt(stepKey)
      const selectedIds = selected[stepKey]
      if (!selectedIds) return
      
      const ids = Array.isArray(selectedIds) ? selectedIds : [selectedIds]
      const options = allIngredients[stepNum] || []
      
      ids.forEach(id => {
        const option = options.find(o => o.id === id)
        if (option) {
          total.calories += option.calories || 0
          total.protein += option.protein || 0
          total.fats += option.fats || 0
          total.carbs += option.carbs || 0
        }
      })
    })
    
    return total
  }, [selected, allIngredients])

  const handleSelect = (id) => {
    if (currentData.multiple) {
      const currentSelected = selected[step] || []
      if (currentSelected.includes(id)) {
        setSelected(prev => ({
          ...prev,
          [step]: currentSelected.filter(item => item !== id)
        }))
      } else {
        if (currentSelected.length < currentData.maxSelect) {
          setSelected(prev => ({
            ...prev,
            [step]: [...currentSelected, id]
          }))
        }
      }
    } else {
      setSelected(prev => ({
        ...prev,
        [step]: prev[step] === id ? null : id
      }))
    }
  }

  const isSelected = (id) => {
    if (currentData.multiple) {
      return (selected[step] || []).includes(id)
    }
    return selected[step] === id
  }

  const isStepValid = () => {
    if (step === 3) return true
    if (currentData.canSkip) return true
    return selected[step] !== null && selected[step] !== undefined && selected[step] !== ''
  }

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  if (loading) {
    return (
      <div className={pageStyles.container}>
        <h1 className={pageStyles.title}>{t('catalog.title')}</h1>
        <p className={pageStyles.subtitle}>Загрузка...</p>
      </div>
    )
  }

  return (
    <div className={pageStyles.container}>
      <h1 className={pageStyles.title}>{t('catalog.title')}</h1>
      <p className={pageStyles.subtitle}>{t('catalog.subtitle')}</p>

      <div className={styles.stepsIndicator}>
        {[1, 2, 3, 4, 5].map((num) => (
          <div key={num} className={`${styles.stepDot} ${step === num ? styles.active : ''}`}>
            {num}
          </div>
        ))}
      </div>

      <div className={styles.stepContent}>
        <h2 className={styles.stepTitle}>{currentData.title}</h2>
        <p className={styles.stepDescription}>{currentData.description}</p>
        {currentData.multiple && (
          <p className={styles.selectionCount}>
            Выбрано: {(selected[step] || []).length} / {currentData.maxSelect}
          </p>
        )}
        <div className={styles.optionsGrid}>
          {currentOptions.map((option) => (
            <div 
              key={option.id} 
              className={`${styles.optionCard} ${isSelected(option.id) ? styles.selected : ''}`}
              onClick={() => handleSelect(option.id)}
            >
              <div className={styles.optionEmoji}>{option.emoji}</div>
              <div className={styles.optionName}>{option.name}</div>
              <div className={styles.optionTooltip}>
                {option.weight} · {option.calories} ккал
                <span className={styles.optionDescription}>{option.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.stepNav}>
        <button onClick={prevStep} disabled={step === 1}>
          {t('catalog.back')}
        </button>
        <button 
          onClick={() => {
            if (step === totalSteps) {
              navigate('/my-bowl', { state: { selected } })
            } else {
              nextStep()
            }
          }} 
          disabled={!isStepValid()}
        >
          {step === totalSteps ? t('catalog.finish') : t('catalog.next')}
        </button>
      </div>

      <div className={styles.nutritionBar}>
        <span>🔥 {Math.round(nutrition.calories)} ккал</span>
        <span>💪 {nutrition.protein.toFixed(1)}г белка</span>
        <span>🧈 {nutrition.fats.toFixed(1)}г жиров</span>
        <span>🌾 {nutrition.carbs.toFixed(1)}г углеводов</span>
      </div>
    </div>
  )
}