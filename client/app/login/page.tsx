import { Container } from "@shared/ui/Container";
import { LoginForm } from "@features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <Container className="py-16">
      <LoginForm />
    </Container>
  );
}
