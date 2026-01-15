import * as React from 'react';
import { CheckCircle, Code2, AlertCircle, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';
import { EmptyState } from '@/components/EmptyState';
import type { ProjectTimelineProps } from './types';

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

class TimelineErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Timeline component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-32 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>时间线加载失败</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="text-primary hover:underline text-sm mt-2"
            >
              重试
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const TimelineRenderer = ({ data }: { data: TimelineEntry[] }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(0);

  React.useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [data]);

  return (
    <div className="w-full font-sans">
      <div ref={containerRef} className="relative pb-8">
        {data.map((item, index) => (
          <div key={`${item.title}-${index}`} className="flex justify-start pt-8 md:gap-10">
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-20 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-background flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-muted-foreground/20 ring-2 ring-muted-foreground/40" />
              </div>
              <h3 className="hidden md:block text-lg md:pl-20 md:text-2xl font-bold text-muted-foreground">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-xl mb-4 text-left font-bold text-muted-foreground">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        {/* 渐变时间线：两端浅中间深 */}
        <div
          style={{ height: height + 'px' }}
          className="absolute left-[31px] md:left-[31px] top-0 w-px bg-gradient-to-b from-transparent via-muted-foreground/50 to-transparent"
        />
      </div>
    </div>
  );
};

export const ProjectTimeline: React.FC<ProjectTimelineProps> = ({
  project,
  variant,
  useErrorBoundary = true,
  className,
}) => {
  const timelineData: TimelineEntry[] = React.useMemo(() => {
    if (!project.timeline) return [];

    return project.timeline.map((event) => ({
      title: new Date(event.date).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
      }),
      content: (
        <div>
          <p className="text-foreground text-sm font-normal mb-4">{event.title}</p>
          <div className="space-y-2">
            <div className="flex gap-2 items-center text-muted-foreground text-sm">
              {event.type === 'milestone' && <CheckCircle className="w-4 h-4 text-green-500" />}
              {event.type === 'feature' && <Code2 className="w-4 h-4 text-blue-500" />}
              {event.type === 'bugfix' && <AlertCircle className="w-4 h-4 text-red-500" />}
              {event.type === 'release' && <Zap className="w-4 h-4 text-purple-500" />}
              {event.description}
            </div>
          </div>
        </div>
      ),
    }));
  }, [project.timeline]);

  if (timelineData.length === 0) {
    return <EmptyState message="暂无时间线数据" variant={variant} />;
  }

  const content = (
    <div className={cn(className)}>
      <h3 className="text-lg font-semibold mb-3">项目时间线</h3>
      <TimelineRenderer data={timelineData} />
    </div>
  );

  if (useErrorBoundary) {
    return <TimelineErrorBoundary>{content}</TimelineErrorBoundary>;
  }

  return content;
};
