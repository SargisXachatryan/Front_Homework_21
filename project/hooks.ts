import { useState } from 'react'

interface Rule {
  required?: string
  minLength?: { value: number; message: string }
  maxLength?: { value: number; message: string }
  pattern?: { value: RegExp; message: string }
}

interface Values {
  [key: string]: any
}

interface Errors {
  [key: string]: string
}

interface Rules {
  [key: string]: Rule
}

interface RegisterOptions extends Rule {}

interface UseFormReturn {
  handleSubmit: (callback: (values: Values) => void) => (event: React.FormEvent) => void
  register: (key: string, options?: RegisterOptions) => {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  }
  errors: Errors
  reset: () => void
}

export const useForm = (): UseFormReturn => {
  const [values, setValues] = useState<Values>({})
  const [errors, setErrors] = useState<Errors>({})
  const rules: Rules = {}

  const handleSubmit =
    (callback: (values: Values) => void) =>
    (event: React.FormEvent) => {
      event.preventDefault()

      let tempErrors: Errors = { ...errors }
      for (let key in rules) {
        const rule = rules[key]
        const value = values[key]

        if (rule.required && (!value || !value.trim())) {
          tempErrors[key] = rule.required
        } else if (rule.minLength && value.length < rule.minLength.value) {
          tempErrors[key] = rule.minLength.message
        } else if (rule.maxLength && value.length > rule.maxLength.value) {
          tempErrors[key] = rule.maxLength.message
        } else if (rule.pattern && !rule.pattern.value.test(value)){
          tempErrors[key] = rule.pattern.message
        } else {
          delete tempErrors[key]
        }
      }

      setErrors(tempErrors)

      if (Object.keys(tempErrors).length === 0) {
        callback(values)
      }
    }

  const register = (key: string, options: RegisterOptions = {}) => {
    rules[key] = options
    return {
      value: values[key] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setValues({ ...values, [key]: e.target.value }),
    }
  }

  const reset = () => {
    setValues({})
    setErrors({})
  }

  return { handleSubmit, register, errors, reset }
}
