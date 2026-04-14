import { SignIn } from '@clerk/nextjs'
import AuthFrame from '@/components/auth/AuthFrame'

export default function LoginPage() {
  return (
    <AuthFrame>
      <SignIn />
    </AuthFrame>
  )
}
