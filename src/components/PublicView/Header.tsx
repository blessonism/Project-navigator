import React from 'react';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  projectCount: number;
  filteredCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  projectCount,
  filteredCount,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Projects</h1>
              <p className="text-muted-foreground mt-1">
                A collection of {projectCount} deployed projects
              </p>
            </div>
            <Badge
              variant="outline"
              className="shrink-0 whitespace-nowrap px-2 py-0 text-xs sm:px-2.5 sm:py-0.5 sm:text-sm"
            >
              {filteredCount} Projects
            </Badge>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search projects, tags, or technologies..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
