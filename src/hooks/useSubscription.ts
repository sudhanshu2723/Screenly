import { useState } from 'react'
import axios from 'axios'

interface PaymentResponse {
  status: number
  session_url: string
}

export const useSubscription = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const onSubscribe = async () => {
    setIsProcessing(true)
    try {
      const response = await axios.get<PaymentResponse>('/api/payment')
      if (response.data.status === 200) {
        return (window.location.href = `${response.data.session_url}`)
      }
      setIsProcessing(false)
    } catch (error) {
      console.log(error, '🔴')
      setIsProcessing(false) // Ensure processing state is reset on error
    }
  }
  return { onSubscribe, isProcessing }
}
