import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, Code, Bug, Rocket } from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'milestone' | 'feature' | 'bugfix' | 'release';
}

interface TimelineProps {
  events: TimelineEvent[];
  startDate?: string;
  duration?: string;
}

const Timeline: React.FC<TimelineProps> = ({ events, startDate, duration }) => {
  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>暂无时间线数据</p>
      </div>
    );
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'feature':
        return <Code className="h-5 w-5" />;
      case 'bugfix':
        return <Bug className="h-5 w-5" />;
      case 'release':
        return <Rocket className="h-5 w-5" />;
      default:
        return <Calendar className="h-5 w-5" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'milestone':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'feature':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'bugfix':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'release':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getEventLabel = (type: string) => {
    switch (type) {
      case 'milestone':
        return '里程碑';
      case 'feature':
        return '新功能';
      case 'bugfix':
        return '修复';
      case 'release':
        return '发布';
      default:
        return '事件';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // 按日期排序（最新的在上面）
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="space-y-4">
      {/* 项目信息 */}
      {(startDate || duration) && (
        <div className="flex gap-4 text-sm text-muted-foreground mb-6">
          {startDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>开始时间：{formatDate(startDate)}</span>
            </div>
          )}
          {duration && (
            <div className="flex items-center gap-2">
              <span>•</span>
              <span>开发周期：{duration}</span>
            </div>
          )}
        </div>
      )}

      {/* 时间线 */}
      <div className="relative">
        {/* 垂直线 */}
        <div className="absolute left-[21px] top-0 bottom-0 w-[2px] bg-border" />

        {/* 事件列表 */}
        <div className="space-y-6">
          {sortedEvents.map((event) => (
            <div key={event.id} className="relative flex gap-4">
              {/* 图标节点 */}
              <div
                className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-background ${getEventColor(
                  event.type
                )}`}
              >
                {getEventIcon(event.type)}
              </div>

              {/* 内容 */}
              <div className="flex-1 pb-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {event.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(event.date)}
                    </p>
                  </div>
                  <Badge variant="outline" className={getEventColor(event.type)}>
                    {getEventLabel(event.type)}
                  </Badge>
                </div>
                {event.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
