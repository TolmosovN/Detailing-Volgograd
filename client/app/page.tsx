import Link from "next/link";
import { ServicesList } from "@features/services/components/ServicesList";
import { Button } from "@shared/ui/Button";
import { Container } from "@shared/ui/Container";
import { APP_CONFIG } from "@shared/config";

export default function HomePage() {
  return (
    <Container className="py-8 space-y-8">
      {/* Блок для быстрой записи */}
      <section
        id="booking"
        className="space-y-4 text-center"
      >
        <h1 className="text-3xl sm:text-4xl font-bold">
          {APP_CONFIG.name}
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto">
          {APP_CONFIG.description}
        </p>
        <Link href="/booking">
          <Button>Записаться</Button>
        </Link>
      </section>

      {/* Блок с услугами */}
      <section
        id="services"
        className="space-y-4"
      >
        <h2 className="text-xl font-semibold">
          Популярные услуги
        </h2>
        <ServicesList />
      </section>

      {/* Блок "О нас" */}
      <section
        id="about"
        className="space-y-3"
      >
        <h2 className="text-xl font-semibold">
          О нас
        </h2>
        <p className="text-slate-300 text-sm">
          Мы специализируемся на профессиональной мойке и детейлинге автомобилей
          в Волгограде. Используем качественную химию и бережные технологии
          ухода за кузовом и салоном.
        </p>
      </section>

      {/* Блок "Контакты" */}
      <section
        id="contacts"
        className="space-y-3"
      >
        <h2 className="text-xl font-semibold">
          Контакты
        </h2>
        <div className="text-sm text-slate-300 space-y-1">
          <p>Телефон: {APP_CONFIG.phone}</p>
          <p>Адрес: {APP_CONFIG.address}</p>
          <p>Режим работы: {APP_CONFIG.workingHours}</p>
        </div>
      </section>
    </Container>
  );
}

