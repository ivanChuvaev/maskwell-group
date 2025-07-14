import { forwardRef } from 'react'
import cn from 'classnames'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, ref) {
    return (
      <button
        ref={ref}
        {...props}
        className={cn(
          `
          px-2 py-1
          min-h-8
          bg-gray-600 hover:bg-gray-700 
          text-white font-medium 
          cursor-pointer
          rounded-lg 
          transition-colors duration-200 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          active:transform active:scale-95
        `,
          props.className
        )}
      />
    )
  }
)
