"use client";

import * as React from "react";
import { motion } from "framer-motion";

// 简化的 cn 函数，如果项目中没有 @/lib/utils
const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

export interface Challenge {
  title: string;
  description: string;
  solution: string;
}

interface ChallengeSectionProps {
  challenges: Challenge[];
  className?: string;
}

export const ChallengeSection: React.FC<ChallengeSectionProps> = ({
  challenges,
  className
}) => {
  if (!challenges || challenges.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Challenges & Solutions
        </h3>
      </div>

      <div className="space-y-4">
        {challenges.map((challenge, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg border bg-card shadow-sm"
          >
            <h4 className="font-medium mb-2 text-foreground flex items-center gap-2">
              Challenge: {challenge.title}
            </h4>

            <p className="text-sm text-muted-foreground mb-3">
              {challenge.description}
            </p>

            <div className="pl-4 border-l-2 border-border">
              <p className="text-sm font-medium text-foreground mb-1">
                Solution:
              </p>
              <p className="text-sm text-muted-foreground">
                {challenge.solution}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};