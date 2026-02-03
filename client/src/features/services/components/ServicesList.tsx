import { Card } from "@shared/ui/Card";
import { formatPrice } from "@shared/lib";
import { servicesApi } from "@shared/api/servicesApi";

export const ServicesList = async () => {
  const services = await servicesApi.getServices();

  if (services.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        Список услуг пока пуст. Попробуйте позже.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {services.map((service) => (
        <Card key={service.id} title={service.name}>
          <p className="mt-2 text-xs text-slate-300">
            {service.description}
          </p>
          <p className="mt-3 text-sm font-medium text-brand">
            от {formatPrice(service.priceFrom)}
          </p>
        </Card>
      ))}
    </div>
  );
};

