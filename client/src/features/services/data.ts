import type { Service } from "./types";

/**
 * Моковые данные услуг.
 * Позже их можно будет получать с бэкенда.
 */
export const MOCK_SERVICES: Service[] = [
  {
    id: 1,
    name: "Экспресс-мойка",
    description: "Быстрая наружная мойка кузова с сушкой.",
    priceFrom: 500
  },
  {
    id: 2,
    name: 'Комплекс "Стандарт"',
    description: "Кузов, коврики, пылесос салона, протирка пластика.",
    priceFrom: 1200
  },
  {
    id: 3,
    name: "Детейлинг-полировка",
    description: "Многоступенчатая полировка ЛКП с защитой.",
    priceFrom: 6000
  }
];
