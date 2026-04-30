import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, ReactNode } from "react"
import { Loader2 } from "lucide-react"

type ButtonVariant =
  | "gradient"
  | "outline"
  | "solid"
  | "danger"
  | "danger-outline"

interface MyCustomButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  gradient: "my-btn",
  outline: "my-btn-outline",
  solid: "my-btn-solid",
  danger: "my-btn-danger",
  "danger-outline": "my-btn-danger-outline",
}

export default function MyCustomButton({
  children,
  className,
  variant = "gradient",
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  fullWidth = false,
  ...props
}: MyCustomButtonProps) {
  return (
    <button
      className={cn(
        variantClasses[variant],
        !fullWidth && "w-fit",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {leftIcon}
          <span>{children}</span>
          {rightIcon}
        </>
      )}
    </button>
  )
}