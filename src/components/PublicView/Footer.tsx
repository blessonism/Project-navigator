import React from 'react';
import { Github, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border mt-16">
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 My Projects. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </a>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a href="https://example.com" target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4 mr-2" />
                Website
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};
