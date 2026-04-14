import { SignUp } from '@clerk/nextjs'
import AuthFrame from '@/components/auth/AuthFrame'

export default function SignUpPage() {
  return (
    <AuthFrame
      title="Join the network"
      description="Create your account to contribute to the Blueprints for Pangaea alumni hub."
    >
      <SignUp />
    </AuthFrame>
  )
}
