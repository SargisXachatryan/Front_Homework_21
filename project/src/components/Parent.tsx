import { useForm } from '../../hooks'
import styles from './style.module.css'

export const Parent = () => {
  const { handleSubmit, register, errors, reset } = useForm()

  const handleAdd = (data: { [key: string]: any }) => {
    console.log(data)
    reset()
  }

  return (
    <>
      <h1 className={styles.title}>Parent</h1>

      <form onSubmit={handleSubmit(handleAdd)}>
        <div>
          {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
          <input
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 3, message: 'Username must be at least 3 characters long' },
              maxLength: { value: 20, message: 'Username cannot exceed 20 characters' },
              pattern: { value: /^[a-zA-Z]+$/, message: 'Username can only contain letters' },
            })}
          />
        </div>

        <div>
          {errors.age && <p style={{ color: 'red' }}>{errors.age}</p>}
          <input
            type="number"
            {...register('age', {
              required: 'Age is required',
              minLength: { value: 1, message: 'Age must be at least 1 digit' },
              maxLength: { value: 3, message: 'Age cannot exceed 3 digits' },
            })}
          />
        </div>

        <button type="submit">Save</button>
      </form>
    </>
  )
}
