import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  FileQuestion,
  Image,
  Code2,
  Target,
  Clock,
  Lightbulb,
  BookOpen,
  Camera,
  Layers,
  Sparkles,
  Calendar,
  Zap,
  LucideIcon
} from "lucide-react";

interface EmptyStateProps {
  message: string;
  description?: string;
  className?: string;
  variant?: 'classic' | 'modern';
  icon?: LucideIcon;
  secondaryIcon?: LucideIcon;
  tertiaryIcon?: LucideIcon;
  iconClassName?: string;
}

// 为每个消息类型定义三个相关图标（左-中-右）
const defaultIconSets: Record<string, [LucideIcon, LucideIcon, LucideIcon]> = {
  '暂无项目详情': [FileQuestion, BookOpen, Lightbulb],
  '暂无项目截图': [Image, Camera, Code2],
  '暂无技术栈信息': [Code2, Layers, Lightbulb],
  '暂无功能特性': [Target, Sparkles, Code2],
  '暂无时间线数据': [Clock, Calendar, FileQuestion],
  '暂无挑战与解决方案': [Lightbulb, Zap, Code2],
};

// 三图标的动画变体
const ICON_VARIANTS = {
  left: {
    initial: { scale: 0.8, opacity: 0, x: 0, y: 0, rotate: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      x: 0,
      y: 0,
      rotate: -6,
      transition: { duration: 0.5, delay: 0.1 }
    },
    hover: {
      x: -20,
      y: -8,
      rotate: -12,
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  },
  center: {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, delay: 0.2 }
    },
    hover: {
      y: -12,
      scale: 1.1,
      transition: { duration: 0.3 }
    }
  },
  right: {
    initial: { scale: 0.8, opacity: 0, x: 0, y: 0, rotate: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 6,
      transition: { duration: 0.5, delay: 0.3 }
    },
    hover: {
      x: 20,
      y: -8,
      rotate: 12,
      scale: 1.05,
      transition: { duration: 0.3 }
    }
  }
};

// Modern 主题的动画变体（默认就是展开状态）
const ICON_VARIANTS_MODERN = {
  left: {
    initial: { scale: 0.8, opacity: 0, x: 0, y: 0, rotate: 0 },
    animate: {
      scale: 1.05,
      opacity: 1,
      x: -20,
      y: -8,
      rotate: -12,
      transition: { duration: 0.5, delay: 0.1 }
    },
    hover: {
      scale: 1.05,
      x: -20,
      y: -8,
      rotate: -12,
      transition: { duration: 0.3 }
    }
  },
  center: {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1.1,
      opacity: 1,
      y: -12,
      transition: { duration: 0.5, delay: 0.2 }
    },
    hover: {
      scale: 1.1,
      y: -12,
      transition: { duration: 0.3 }
    }
  },
  right: {
    initial: { scale: 0.8, opacity: 0, x: 0, y: 0, rotate: 0 },
    animate: {
      scale: 1.05,
      opacity: 1,
      x: 20,
      y: -8,
      rotate: 12,
      transition: { duration: 0.5, delay: 0.3 }
    },
    hover: {
      scale: 1.05,
      x: 20,
      y: -8,
      rotate: 12,
      transition: { duration: 0.3 }
    }
  }
};

const CONTENT_VARIANTS = {
  initial: { y: 20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, delay: 0.4 }
  },
};

const IconContainer: React.FC<{
  children: React.ReactNode;
  variant: 'classic' | 'modern';
  position: 'left' | 'center' | 'right';
  className?: string;
}> = ({ children, variant, position, className }) => {
  const baseClasses = "w-14 h-14 rounded-xl flex items-center justify-center relative shadow-lg transition-all duration-300";

  // 中间图标使用不透明渐变，左右图标使用半透明渐变
  const variantClasses = {
    classic: cn(
      position === 'center'
        ? "bg-gradient-to-br from-background via-muted/60 to-muted"
        : "bg-gradient-to-br from-background to-muted/80",
      "border border-border/60",
      "group-hover:shadow-xl group-hover:border-border/80"
    ),
    modern: cn(
      "bg-gradient-to-br from-primary/4 via-primary/8 to-primary/15",
      "border border-primary/20",
      "shadow-primary/10",
      "group-hover:shadow-2xl group-hover:shadow-primary/20 group-hover:border-primary/30"
    )
  };

  const positionClasses = {
    left: variant === 'modern' ? "relative left-2 z-10" : "relative left-2 top-1 z-10",
    center: "relative z-20",
    right: variant === 'modern' ? "relative right-2 z-10" : "relative right-2 top-1 z-10"
  };

  return (
    <motion.div
      variants={variant === 'modern' ? ICON_VARIANTS_MODERN[position] : ICON_VARIANTS[position]}
      className={cn(baseClasses, variantClasses[variant], positionClasses[position], className)}
    >
      <div className={cn(
        "text-sm transition-colors duration-300 relative",
        variant === 'classic' ? "text-muted-foreground group-hover:text-foreground" : "text-primary/70 group-hover:text-primary"
      )}
      style={{ zIndex: 10 }}
      >
        {children}
      </div>
    </motion.div>
  );
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  description,
  className,
  variant = 'classic',
  icon: CustomIcon,
  secondaryIcon: CustomSecondaryIcon,
  tertiaryIcon: CustomTertiaryIcon,
  iconClassName
}) => {
  const defaultIcons = defaultIconSets[message] || [FileQuestion, Target, Code2];
  const LeftIcon = CustomIcon || defaultIcons[0];
  const CenterIcon = CustomSecondaryIcon || defaultIcons[1];
  const RightIcon = CustomTertiaryIcon || defaultIcons[2];

  const containerClasses = {
    classic: cn(
      "group flex flex-col items-center justify-center p-14 rounded-2xl relative overflow-hidden",
      "bg-gradient-to-br from-muted/30 via-muted/20 to-transparent",
      "border-2 border-dashed border-border/60",
      "transition-all duration-500",
      "hover:border-border/90 hover:bg-muted/40 hover:shadow-lg"
    ),
    modern: cn(
      "group flex flex-col items-center justify-center p-14 rounded-3xl relative overflow-hidden",
      "bg-gradient-to-br from-card/50 via-card/30 to-transparent",
      "backdrop-blur-xl border-2 border-dashed border-border/40",
      "shadow-xl shadow-black/5",
      "transition-all duration-500",
      "hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10"
    )
  };

  const textClasses = {
    classic: "text-xl font-bold text-foreground/90 mb-2 tracking-tight",
    modern: "text-2xl font-bold text-foreground/95 mb-3 tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
  };

  const descriptionClasses = {
    classic: "text-sm text-muted-foreground/75 max-w-sm leading-relaxed",
    modern: "text-sm text-muted-foreground/80 max-w-md leading-relaxed"
  };

  return (
    <motion.div
      className={cn(containerClasses[variant], className)}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      {/* Animated Background Pattern */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-700 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '32px 32px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Gradient Orb Effect */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none",
          variant === 'classic' ? "bg-muted" : "bg-primary/30"
        )}
      />

      {/* Three Icon Stack */}
      <div className="flex justify-center isolate relative mb-8">
        <IconContainer variant={variant} position="left">
          <LeftIcon className={cn("w-7 h-7", iconClassName)} />
        </IconContainer>
        <IconContainer variant={variant} position="center">
          <CenterIcon className={cn("w-7 h-7", iconClassName)} />
        </IconContainer>
        <IconContainer variant={variant} position="right">
          <RightIcon className={cn("w-7 h-7", iconClassName)} />
        </IconContainer>
      </div>

      {/* Text Content */}
      <motion.div
        className="relative z-10 text-center"
        variants={CONTENT_VARIANTS}
      >
        <h3 className={textClasses[variant]}>
          {message}
        </h3>

        {description && (
          <p className={descriptionClasses[variant]}>
            {description}
          </p>
        )}
      </motion.div>

      {/* Bottom Accent Line */}
      <motion.div
        className={cn(
          "absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all duration-500",
          variant === 'classic' ? "bg-gradient-to-r from-transparent via-border to-transparent" : "bg-gradient-to-r from-transparent via-primary/50 to-transparent"
        )}
        initial={{ width: "0%" }}
        animate={{ width: "0%" }}
        whileHover={{ width: "80%" }}
      />
    </motion.div>
  );
};
