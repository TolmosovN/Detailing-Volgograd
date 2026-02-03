import { Container } from "@shared/ui/Container";
import { RegisterForm } from "@features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <Container className="py-16">
      <RegisterForm />
    </Container>
  );
}
