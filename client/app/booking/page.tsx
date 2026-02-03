import type { Metadata } from "next";
import { BookingForm } from "@features/booking/components/BookingForm";
import { Container } from "@shared/ui/Container";

export const metadata: Metadata = {
  title: "Запись на мойку | Detailing Volgograd",
  description: "Запишитесь на автомойку или детейлинг в Волгограде"
};

export default function BookingPage() {
  return (
    <Container className="py-8">
      <div className="mb-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">
          Запись на мойку
        </h1>
        <p className="text-slate-300 text-sm sm:text-base">
          Выберите услугу и удобное время для записи
        </p>
      </div>
      <BookingForm />
    </Container>
  );
}
