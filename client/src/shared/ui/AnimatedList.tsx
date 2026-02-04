"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type AnimatedListProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/**
 * Контейнер для анимированного списка элементов
 * Элементы появляются по очереди с задержкой
 */
export const AnimatedList = ({ children, className, delay = 0 }: AnimatedListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

type AnimatedListItemProps = {
  children: ReactNode;
  index: number;
  className?: string;
};

/**
 * Анимированный элемент списка
 * Появляется с задержкой в зависимости от индекса
 */
export const AnimatedListItem = ({ children, index, className }: AnimatedListItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Анимация для grid элементов (карточки услуг)
 */
export const AnimatedGridItem = ({ children, index, className }: AnimatedListItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Fade in анимация
 */
export const FadeIn = ({ children, delay = 0, className }: AnimatedListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Slide up анимация
 */
export const SlideUp = ({ children, delay = 0, className }: AnimatedListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Scale in анимация
 */
export const ScaleIn = ({ children, delay = 0, className }: AnimatedListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
