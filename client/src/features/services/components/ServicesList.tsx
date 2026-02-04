import { servicesApi } from "@shared/api/servicesApi";
import { AnimatedServicesList } from "./AnimatedServicesList";

/**
 * Серверный компонент для загрузки услуг
 */
export const ServicesList = async () => {
  const services = await servicesApi.getServices();
  
  return <AnimatedServicesList services={services} />;
};

