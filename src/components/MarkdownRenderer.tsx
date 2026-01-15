import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const remarkPlugins = [remarkGfm];

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
}) => {
  return (
    <div
      className={cn(
        'prose dark:prose-invert max-w-none',
        'prose-p:leading-relaxed prose-pre:bg-muted prose-pre:border prose-pre:border-border',
        'prose-h1:text-2xl prose-h1:font-bold prose-h1:mt-4 prose-h1:mb-3',
        'prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-4 prose-h2:mb-2',
        'prose-h3:text-lg prose-h3:font-medium prose-h3:mt-3 prose-h3:mb-2',
        'prose-ul:my-3 prose-ol:my-3 prose-li:my-1',
        'prose-p:my-2',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        components={{
          a: ({ href, children, ...props }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
