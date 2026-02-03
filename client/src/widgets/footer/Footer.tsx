import { Container } from "@shared/ui/Container";
import { APP_CONFIG } from "@shared/config";

const SOCIAL_LINKS = [
  { name: "Instagram", href: "#", icon: "📷" },
  { name: "VK", href: "#", icon: "🔵" },
  { name: "Telegram", href: "#", icon: "✈️" }
];

/**
 * Футер с контактами, соцсетями и копирайтом.
 */
export const Footer = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80">
      <Container className="py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Копирайт */}
          <div className="text-xs text-slate-400">
            © {new Date().getFullYear()} {APP_CONFIG.name}. Все права защищены.
          </div>

          {/* Контакты */}
          <div className="flex flex-col gap-1 text-xs text-slate-400 sm:text-right">
            <span>Телефон: {APP_CONFIG.phone}</span>
            <span>Адрес: {APP_CONFIG.address}</span>
            <span>Режим работы: {APP_CONFIG.workingHours}</span>
          </div>

          {/* Соцсети */}
          <div className="flex gap-3 sm:flex-col sm:items-end">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="text-slate-400 hover:text-brand transition-colors text-sm"
                aria-label={social.name}
              >
                <span className="mr-1">{social.icon}</span>
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
};

