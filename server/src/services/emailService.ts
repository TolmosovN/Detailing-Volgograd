import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { emailConfig, isEmailEnabled } from '../config/email';

/**
 * Тип данных для отправки email
 */
interface SendEmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

/**
 * Сервис для отправки Email уведомлений
 */
class EmailService {
  private transporter: Transporter | null = null;
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor() {
    if (isEmailEnabled()) {
      this.initializeTransporter();
      this.loadTemplates();
    }
  }

  /**
   * Инициализация SMTP транспорта
   */
  private initializeTransporter(): void {
    try {
      this.transporter = nodemailer.createTransport(emailConfig.smtp);
      console.log('✅ Email transporter initialized');
    } catch (error) {
      console.error('❌ Failed to initialize email transporter:', error);
    }
  }

  /**
   * Загрузка HTML шаблонов
   */
  private loadTemplates(): void {
    const templatesDir = path.join(__dirname, '../templates/email');
    
    try {
      // Проверяем существование папки с шаблонами
      if (!fs.existsSync(templatesDir)) {
        console.warn('⚠️  Email templates directory not found:', templatesDir);
        return;
      }

      const templateFiles = fs.readdirSync(templatesDir).filter(file => file.endsWith('.hbs'));

      templateFiles.forEach(file => {
        const templateName = file.replace('.hbs', '');
        const templatePath = path.join(templatesDir, file);
        const templateContent = fs.readFileSync(templatePath, 'utf-8');
        const compiledTemplate = handlebars.compile(templateContent);
        
        this.templates.set(templateName, compiledTemplate);
      });

      console.log(`✅ Loaded ${this.templates.size} email templates`);
    } catch (error) {
      console.error('❌ Failed to load email templates:', error);
    }
  }

  /**
   * Отправка email
   */
  private async sendEmail(options: SendEmailOptions): Promise<boolean> {
    // Проверка: включены ли email
    if (!isEmailEnabled()) {
      console.log('📧 [Mock] Email would be sent to:', options.to, '| Subject:', options.subject);
      return true;
    }

    // Проверка транспорта
    if (!this.transporter) {
      console.error('❌ Email transporter not initialized');
      return false;
    }

    try {
      // Получаем шаблон
      const template = this.templates.get(options.template);
      if (!template) {
        console.error(`❌ Template not found: ${options.template}`);
        return false;
      }

      // Компилируем HTML
      const html = template(options.context);

      // Отправляем email
      await this.transporter.sendMail({
        from: emailConfig.from,
        to: options.to,
        subject: options.subject,
        html: html,
      });

      console.log(`✅ Email sent to ${options.to}: ${options.subject}`);
      return true;
    } catch (error: any) {
      console.error('❌ Failed to send email:', error.message);
      return false;
    }
  }

  /**
   * Приветственное письмо после регистрации
   */
  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Добро пожаловать в Автомойку Детейлинг!',
      template: 'welcome',
      context: {
        name,
        frontendUrl: emailConfig.frontendUrl,
        loginUrl: `${emailConfig.frontendUrl}/login`,
      },
    });
  }

  /**
   * Подтверждение создания записи
   */
  async sendBookingCreatedEmail(
    email: string,
    bookingData: {
      id: number;
      clientName: string;
      serviceName: string;
      date: string;
      time: string;
      amount: number;
    }
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: `Запись №${bookingData.id} создана`,
      template: 'booking-created',
      context: {
        ...bookingData,
        frontendUrl: emailConfig.frontendUrl,
        paymentUrl: `${emailConfig.frontendUrl}/payment/${bookingData.id}`,
        profileUrl: `${emailConfig.frontendUrl}/profile`,
      },
    });
  }

  /**
   * Подтверждение записи администратором
   */
  async sendBookingConfirmedEmail(
    email: string,
    bookingData: {
      id: number;
      clientName: string;
      serviceName: string;
      date: string;
      time: string;
    }
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: `Запись №${bookingData.id} подтверждена!`,
      template: 'booking-confirmed',
      context: {
        ...bookingData,
        frontendUrl: emailConfig.frontendUrl,
        profileUrl: `${emailConfig.frontendUrl}/profile`,
      },
    });
  }

  /**
   * Уведомление об успешной оплате
   */
  async sendPaymentSuccessEmail(
    email: string,
    paymentData: {
      bookingId: number;
      clientName: string;
      serviceName: string;
      amount: number;
      date: string;
      time: string;
    }
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: `Оплата прошла успешно! Запись №${paymentData.bookingId}`,
      template: 'payment-success',
      context: {
        ...paymentData,
        frontendUrl: emailConfig.frontendUrl,
        profileUrl: `${emailConfig.frontendUrl}/profile`,
      },
    });
  }

  /**
   * Напоминание о записи (за день)
   */
  async sendBookingReminderEmail(
    email: string,
    bookingData: {
      id: number;
      clientName: string;
      serviceName: string;
      date: string;
      time: string;
      address: string;
    }
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: `Напоминание: завтра ваша запись №${bookingData.id}`,
      template: 'booking-reminder',
      context: {
        ...bookingData,
        frontendUrl: emailConfig.frontendUrl,
        profileUrl: `${emailConfig.frontendUrl}/profile`,
      },
    });
  }

  /**
   * Уведомление об отмене записи
   */
  async sendBookingCancelledEmail(
    email: string,
    bookingData: {
      id: number;
      clientName: string;
      serviceName: string;
      date: string;
      time: string;
    }
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: `Запись №${bookingData.id} отменена`,
      template: 'booking-cancelled',
      context: {
        ...bookingData,
        frontendUrl: emailConfig.frontendUrl,
        bookingUrl: `${emailConfig.frontendUrl}/booking`,
      },
    });
  }
}

// Экспортируем singleton
export const emailService = new EmailService();
