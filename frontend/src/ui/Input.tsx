import { forwardRef, type InputHTMLAttributes } from 'react'
import cn from 'classnames'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col gap-1', props.className)}>
        <label>{label}</label>
        <input
          ref={ref}
          {...props}
          className="border border-gray-300 rounded-lg min-h-8 px-1"
        />
        {error && <span className="text-red-500">{error}</span>}
      </div>
    )
  }
)
