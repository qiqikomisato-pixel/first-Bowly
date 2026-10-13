import api from './axios'

export const getIngredients = async (step = null) => {
  const url = step ? `/ingredients?step=${step}` : '/ingredients'
  const response = await api.get(url)
  return response.data
}