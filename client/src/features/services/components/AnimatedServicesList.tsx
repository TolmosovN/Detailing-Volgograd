"use client";

import { Card } from "@shared/ui/Card";
import { formatPrice } from "@shared/lib";
import { AnimatedGridItem } from "@shared/ui/AnimatedList";

type Service = {
  id: number;
  name: string;
  description: string;
  priceFrom: number;
  duration: number;
  isActive: boolean;
};

type AnimatedServicesListProps = {
  services: Service[];
};

/**
 * Клиентский компонент с анимацией для списка услуг
 */
export const AnimatedServicesList = ({ services }: AnimatedServicesListProps) => {
  if (services.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        Список услуг пока пуст. Попробуйте позже.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {services.map((service, index) => (
        <AnimatedGridItem key={service.id} index={index}>
          <Card title={service.name}>
            <p className="mt-2 text-xs text-slate-300">
              {service.description}
            </p>
            <p className="mt-3 text-sm font-medium text-brand">
              от {formatPrice(service.priceFrom)}
            </p>
          </Card>
        </AnimatedGridItem>
      ))}
    </div>
  );
};
