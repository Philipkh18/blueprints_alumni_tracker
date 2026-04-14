import { SignIn } from '@clerk/nextjs'
import AuthFrame from '@/components/auth/AuthFrame'

export default function LoginPage() {
  return (
    <AuthFrame
      title="Welcome back"
      description="Sign in to reach the Blueprints for Pangaea alumni directory, updates, and opportunities."
    >
      <SignIn />
    </AuthFrame>
  )
}
