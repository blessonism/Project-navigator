import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Github, Search, Globe, Code2, Rocket, Filter, Image as ImageIcon, Plus, Pencil, Trash2, Save, X, ArrowLeft, Eye, EyeOff, LogOut, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { verifyPassword, isAuthenticated, setAuthenticated, logout } from '@/lib/auth';
import ProjectDetailDialog from '@/components/ProjectDetailDialog';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TechStackItem {
  name: string;
  version?: string;
  purpose: string;
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'other';
}

interface Challenge {
  title: string;
  description: string;
  solution: string;
}

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'milestone' | 'feature' | 'bugfix' | 'release';
}

interface Project {
  id: string;
  title: string;
  description: string;
  liveUrl: string;
  githubUrl?: string;
  tags: string[];
  category: string;
  image?: string;
  status: 'live' | 'development' | 'archived';

  // 详情页新增字段
  detailedDescription?: string;  // 详细描述（Markdown）
  screenshots?: string[];        // 截图数组
  techStack?: TechStackItem[];   // 详细技术栈
  features?: string[];           // 核心功能列表
  challenges?: Challenge[];      // 开发挑战
  timeline?: TimelineEvent[];    // 项目时间线
  startDate?: string;            // 开始日期
  duration?: string;             // 开发周期
}

interface ProjectFormData {
  title: string;
  description: string;
  liveUrl: string;
  githubUrl: string;
  tags: string;
  category: string;
  image: string;
  status: 'live' | 'development' | 'archived';

  // 详情页新增字段
  detailedDescription: string;
  screenshots: string;  // 逗号分隔的 URL
  features: string;     // 逗号分隔
  challenges: string;   // 逗号分隔

  // 时间线字段
  startDate: string;
  duration: string;
  timelineData: string;  // JSON 字符串
}

const ProjectNavigationWebsite: React.FC = () => {
  const defaultProjects: Project[] = [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with payment integration, inventory management, and real-time analytics dashboard.',
      liveUrl: 'https://example.com/ecommerce',
      githubUrl: 'https://github.com/user/ecommerce',
      tags: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      category: 'web',
      status: 'live',
      image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
      detailedDescription: `# E-Commerce Platform

一个现代化的全栈电商平台，为中小企业提供完整的在线销售解决方案。

## 核心特性

- **用户管理系统**：完整的用户注册、登录、个人资料管理
- **商品管理**：支持多规格商品、库存管理、批量操作
- **购物车与结算**：实时购物车、多种支付方式、订单跟踪
- **管理后台**：实时销售数据、用户分析、库存预警
- **移动端适配**：响应式设计，完美支持移动设备

## 技术亮点

- 使用 React 18 + TypeScript 构建现代化前端
- Node.js + Express 提供高性能 API 服务
- MongoDB 数据库设计，支持复杂查询和聚合
- Stripe 支付集成，支持信用卡、Apple Pay、Google Pay
- Redis 缓存层，提升系统响应速度
- JWT 认证 + RBAC 权限控制
- 微服务架构，易于扩展和维护`,
      screenshots: [
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&h=800&fit=crop'
      ],
      techStack: [
        { name: 'React', category: 'frontend', purpose: '用户界面构建' },
        { name: 'TypeScript', category: 'frontend', purpose: '类型安全开发' },
        { name: 'Tailwind CSS', category: 'frontend', purpose: '样式框架' },
        { name: 'Node.js', category: 'backend', purpose: '服务端运行时' },
        { name: 'Express', category: 'backend', purpose: 'Web 框架' },
        { name: 'MongoDB', category: 'database', purpose: '文档数据库' },
        { name: 'Redis', category: 'database', purpose: '缓存数据库' },
        { name: 'Stripe', category: 'other', purpose: '支付处理' },
        { name: 'JWT', category: 'other', purpose: '身份认证' },
        { name: 'Docker', category: 'devops', purpose: '容器化部署' }
      ],
      features: [
        '用户注册登录系统',
        '商品浏览和搜索',
        '购物车管理',
        '多种支付方式',
        '订单管理系统',
        '库存管理',
        '销售数据分析',
        '移动端响应式设计',
        '邮件通知系统',
        '优惠券系统'
      ],
      challenges: [
        {
          title: "高并发下的库存一致性问题",
          description: "在电商平台中，多个用户同时购买同一商品时，如何确保库存数据的一致性，避免超卖现象。",
          solution: "实现了基于Redis的分布式锁机制，结合数据库乐观锁，确保库存扣减的原子性操作。"
        },
        {
          title: "支付安全和 PCI 合规性要求",
          description: "处理用户支付信息时需要满足PCI DSS标准，确保敏感数据的安全传输和存储。",
          solution: "集成Stripe支付网关，采用tokenization技术，敏感数据不经过我们的服务器，通过安全审计。"
        },
        {
          title: "复杂的商品规格和价格体系",
          description: "支持多规格商品、批量定价、会员折扣等复杂的价格计算逻辑。",
          solution: "设计了灵活的价格引擎，支持规则链模式，可动态配置各种定价策略。"
        },
        {
          title: "实时数据同步和缓存策略",
          description: "多个用户界面需要实时显示库存变化，传统轮询方式造成服务器压力过大。",
          solution: "采用WebSocket长连接 + Redis发布订阅模式，实现高效的实时数据推送机制。"
        },
        {
          title: "移动端性能优化",
          description: "移动设备上的加载速度和响应性能需要特别优化，特别是商品图片和列表渲染。",
          solution: "实现了图片懒加载、虚拟滚动、代码分割等优化策略，首屏加载时间减少60%。"
        }
      ],
      timeline: [
        {
          id: '1',
          date: '2024-01-15',
          title: '项目启动',
          description: '完成需求分析，确定技术栈：React + Node.js + MongoDB',
          type: 'milestone'
        },
        {
          id: '2',
          date: '2024-02-01',
          title: '用户系统开发',
          description: '实现用户注册、登录、JWT 认证和权限管理',
          type: 'feature'
        },
        {
          id: '3',
          date: '2024-02-15',
          title: '商品管理模块',
          description: '开发商品 CRUD、分类管理、库存系统',
          type: 'feature'
        },
        {
          id: '4',
          date: '2024-03-01',
          title: '购物车与订单',
          description: '实现购物车逻辑、订单生成和状态管理',
          type: 'feature'
        },
        {
          id: '5',
          date: '2024-03-10',
          title: '修复库存并发问题',
          description: '解决高并发下库存扣减的数据一致性问题',
          type: 'bugfix'
        },
        {
          id: '6',
          date: '2024-03-20',
          title: 'Stripe 支付集成',
          description: '集成 Stripe 支付网关，支持多种支付方式',
          type: 'feature'
        },
        {
          id: '7',
          date: '2024-04-01',
          title: '管理后台开发',
          description: '构建管理员后台，包含数据分析和报表功能',
          type: 'feature'
        },
        {
          id: '8',
          date: '2024-04-15',
          title: 'v1.0 正式发布',
          description: '完成所有核心功能，通过安全测试，正式上线',
          type: 'release'
        }
      ],
      startDate: '2024-01-15',
      duration: '3 个月'
    },
    {
      id: '2',
      title: 'Task Management App',
      description: 'Collaborative task management tool with drag-and-drop interface, team collaboration features, and deadline tracking.',
      liveUrl: 'https://example.com/taskapp',
      githubUrl: 'https://github.com/user/taskapp',
      tags: ['Vue.js', 'Firebase', 'Tailwind CSS'],
      category: 'web',
      status: 'live',
      image: 'https://images.unsplash.com/photo-1540350394557-8d14678e7f91?w=800&h=600&fit=crop',
      detailedDescription: `# Task Management App

一个现代化的团队协作任务管理应用，帮助团队高效组织和跟踪项目进度。

## 产品特色

- **直观的看板界面**：拖拽式任务管理，支持自定义工作流
- **实时协作**：团队成员实时同步，即时通知和更新
- **智能提醒**：基于截止日期和优先级的智能提醒系统
- **数据可视化**：项目进度图表、团队效率分析
- **多平台支持**：Web、移动端无缝同步

## 设计理念

采用简洁的 Material Design 设计语言，注重用户体验和操作效率。通过颜色编码、图标系统和动画效果，让复杂的项目管理变得简单直观。

## 技术架构

- 前端采用 Vue 3 + Composition API，提供响应式用户界面
- Firebase 作为后端服务，提供实时数据库和身份认证
- Tailwind CSS 构建一致的设计系统
- PWA 技术支持，可安装到桌面和移动设备`,
      screenshots: [
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop'
      ],
      techStack: [
        { name: 'Vue.js', category: 'frontend', purpose: '渐进式前端框架' },
        { name: 'TypeScript', category: 'frontend', purpose: '类型安全开发' },
        { name: 'Tailwind CSS', category: 'frontend', purpose: '原子化 CSS 框架' },
        { name: 'Vite', category: 'frontend', purpose: '快速构建工具' },
        { name: 'Firebase', category: 'backend', purpose: '后端即服务' },
        { name: 'Firestore', category: 'database', purpose: '实时数据库' },
        { name: 'Firebase Auth', category: 'other', purpose: '身份认证' },
        { name: 'PWA', category: 'frontend', purpose: '渐进式 Web 应用' },
        { name: 'Chart.js', category: 'frontend', purpose: '数据可视化' },
        { name: 'Sortable.js', category: 'frontend', purpose: '拖拽排序' }
      ],
      features: [
        '看板式任务管理',
        '拖拽排序功能',
        '任务分配和协作',
        '截止日期提醒',
        '项目进度跟踪',
        '团队成员管理',
        '文件附件上传',
        '评论和讨论',
        '数据导出功能',
        '移动端适配'
      ],
      challenges: [
        {
          title: "实时数据同步的性能优化",
          description: "多用户协作时需要实时同步任务状态变化，传统轮询方式延迟高且消耗资源。",
          solution: "采用Firebase Firestore实时监听器，结合客户端缓存策略，实现毫秒级数据同步。"
        },
        {
          title: "复杂的拖拽交互实现",
          description: "看板中的任务卡片需要支持跨列拖拽、排序、嵌套等复杂交互，同时保持流畅的用户体验。",
          solution: "使用Sortable.js库，结合Vue 3的响应式系统，实现了平滑的拖拽动画和状态管理。"
        },
        {
          title: "离线模式的数据一致性",
          description: "用户在网络不稳定时仍需正常使用，离线操作与在线同步的数据冲突处理。",
          solution: "实现了本地存储队列机制，支持冲突检测和自动合并策略，确保数据一致性。"
        },
        {
          title: "大量任务的虚拟滚动优化",
          description: "当项目包含数千个任务时，DOM渲染性能急剧下降，影响用户体验。",
          solution: "实现了虚拟滚动技术，只渲染可视区域的任务卡片，支持万级任务的流畅操作。"
        },
        {
          title: "多租户数据隔离设计",
          description: "不同团队的数据需要严格隔离，同时支持跨团队协作的权限管理。",
          solution: "设计了基于Firebase安全规则的多层权限体系，确保数据安全和灵活的协作模式。"
        }
      ],
      timeline: [
        {
          id: '1',
          date: '2024-02-01',
          title: '项目规划',
          description: '完成产品设计和技术选型，确定使用 Vue.js + Firebase',
          type: 'milestone'
        },
        {
          id: '2',
          date: '2024-02-10',
          title: '基础架构搭建',
          description: '搭建 Vue 3 项目，配置 Firebase，建立基础组件库',
          type: 'feature'
        },
        {
          id: '3',
          date: '2024-02-20',
          title: '看板功能开发',
          description: '实现看板界面、任务卡片、拖拽排序功能',
          type: 'feature'
        },
        {
          id: '4',
          date: '2024-03-01',
          title: '用户系统集成',
          description: '集成 Firebase Auth，实现用户注册登录和权限管理',
          type: 'feature'
        },
        {
          id: '5',
          date: '2024-03-05',
          title: '修复拖拽性能问题',
          description: '优化拖拽动画，解决大量任务时的卡顿问题',
          type: 'bugfix'
        },
        {
          id: '6',
          date: '2024-03-15',
          title: '实时协作功能',
          description: '实现多用户实时同步、在线状态显示、即时通知',
          type: 'feature'
        },
        {
          id: '7',
          date: '2024-03-25',
          title: '数据分析模块',
          description: '添加项目统计图表、团队效率分析、导出功能',
          type: 'feature'
        },
        {
          id: '8',
          date: '2024-04-01',
          title: 'PWA 支持',
          description: '添加 PWA 功能，支持离线使用和桌面安装',
          type: 'feature'
        },
        {
          id: '9',
          date: '2024-04-10',
          title: 'v1.0 版本发布',
          description: '完成所有核心功能，通过用户测试，正式发布',
          type: 'release'
        }
      ],
      startDate: '2024-02-01',
      duration: '2.5 个月'
    },
    {
      id: '3',
      title: 'Weather Dashboard',
      description: 'Real-time weather monitoring dashboard with interactive maps, forecasts, and historical data visualization.',
      liveUrl: 'https://example.com/weather',
      githubUrl: 'https://github.com/user/weather',
      tags: ['React', 'TypeScript', 'Chart.js', 'API'],
      category: 'web',
      status: 'live',
      image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop',
    },
    {
      id: '4',
      title: 'Portfolio Generator',
      description: 'AI-powered portfolio website generator that creates personalized portfolio sites based on user input and preferences.',
      liveUrl: 'https://example.com/portfolio-gen',
      githubUrl: 'https://github.com/user/portfolio-gen',
      tags: ['Next.js', 'OpenAI', 'Prisma', 'PostgreSQL'],
      category: 'tool',
      status: 'live',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    },
    {
      id: '5',
      title: 'Social Media Analytics',
      description: 'Comprehensive analytics platform for tracking social media performance across multiple platforms with AI insights.',
      liveUrl: 'https://example.com/analytics',
      tags: ['Python', 'Django', 'React', 'TensorFlow'],
      category: 'analytics',
      status: 'development',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    },
    {
      id: '6',
      title: 'Fitness Tracker',
      description: 'Mobile-first fitness tracking application with workout plans, nutrition tracking, and progress visualization.',
      liveUrl: 'https://example.com/fitness',
      githubUrl: 'https://github.com/user/fitness',
      tags: ['React Native', 'Redux', 'Express', 'MySQL'],
      category: 'mobile',
      status: 'live',
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop',
    },
    {
      id: '7',
      title: 'Blog CMS',
      description: 'Headless CMS for managing blog content with markdown support, SEO optimization, and multi-author capabilities.',
      liveUrl: 'https://example.com/blog-cms',
      githubUrl: 'https://github.com/user/blog-cms',
      tags: ['Next.js', 'Contentful', 'GraphQL'],
      category: 'tool',
      status: 'live',
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop',
    },
    {
      id: '8',
      title: 'Video Streaming Platform',
      description: 'Netflix-like video streaming service with user authentication, content recommendations, and adaptive streaming.',
      liveUrl: 'https://example.com/streaming',
      tags: ['React', 'AWS', 'Node.js', 'Redis'],
      category: 'web',
      status: 'development',
      image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=600&fit=crop',
    },
    {
      id: '9',
      title: 'Code Snippet Manager',
      description: 'Developer tool for organizing and sharing code snippets with syntax highlighting and team collaboration features.',
      liveUrl: 'https://example.com/snippets',
      githubUrl: 'https://github.com/user/snippets',
      tags: ['Svelte', 'Supabase', 'Prism.js'],
      category: 'tool',
      status: 'live',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
    },
  ];

  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showImages, setShowImages] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    liveUrl: '',
    githubUrl: '',
    tags: '',
    category: 'web',
    image: '',
    status: 'live',
    detailedDescription: '',
    screenshots: '',
    features: '',
    challenges: '',
    startDate: '',
    duration: '',
    timelineData: '',
  });

  // 认证相关状态
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // 详情页状态
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const categories = [
    { value: 'all', label: 'All Projects', icon: Globe },
    { value: 'web', label: 'Web Apps', icon: Code2 },
    { value: 'mobile', label: 'Mobile', icon: Rocket },
    { value: 'tool', label: 'Tools', icon: Filter },
    { value: 'analytics', label: 'Analytics', icon: Search },
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const saved = localStorage.getItem('projects');
    if (saved) {
      setProjects(JSON.parse(saved));
    }
    const savedImageMode = localStorage.getItem('showImages');
    if (savedImageMode !== null) {
      setShowImages(savedImageMode === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('showImages', String(showImages));
  }, [showImages]);

  // 监听 URL 参数和快捷键
  useEffect(() => {
    // 检查 URL 参数
    const params = new URLSearchParams(window.location.search);
    if (params.has('admin')) {
      if (!isAuthenticated()) {
        setIsAuthDialogOpen(true);
      } else {
        setIsAdminMode(true);
      }
      // 清除 URL 参数
      window.history.replaceState({}, '', window.location.pathname);
    }

    // 监听快捷键 Ctrl+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (!isAuthenticated()) {
          setIsAuthDialogOpen(true);
        } else {
          setIsAdminMode(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 处理密码验证
  const handlePasswordSubmit = async () => {
    setAuthError('');

    if (!password) {
      setAuthError('请输入密码');
      return;
    }

    const isValid = await verifyPassword(password);

    if (isValid) {
      setAuthenticated(true);
      setIsAuthDialogOpen(false);
      setIsAdminMode(true);
      setPassword('');
    } else {
      setAuthError('密码错误，请重试');
      setPassword('');
    }
  };

  // 处理退出登录
  const handleLogout = () => {
    logout();
    setIsAdminMode(false);
  };

  const handleAddProject = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      liveUrl: '',
      githubUrl: '',
      tags: '',
      category: 'web',
      image: '',
      status: 'live',
      detailedDescription: '',
      screenshots: '',
      features: '',
      challenges: '',
      startDate: '',
      duration: '',
      timelineData: '',
    });
    setIsDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);

    // 将时间线数据转换为 JSON 字符串
    const timelineJson = project.timeline ? JSON.stringify(project.timeline, null, 2) : '';

    setFormData({
      title: project.title,
      description: project.description,
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl || '',
      tags: project.tags.join(', '),
      category: project.category,
      image: project.image || '',
      status: project.status,
      detailedDescription: project.detailedDescription || '',
      screenshots: project.screenshots?.join(', ') || '',
      features: project.features?.join(', ') || '',
      challenges: project.challenges?.join(', ') || '',
      startDate: project.startDate || '',
      duration: project.duration || '',
      timelineData: timelineJson,
    });
    setIsDialogOpen(true);
  };

  const handleSaveProject = () => {
    if (!formData.title || !formData.description || !formData.liveUrl) {
      alert('请填写必填项：标题、描述和在线链接');
      return;
    }

    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    const screenshotsArray = formData.screenshots.split(',').map(url => url.trim()).filter(url => url);
    const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f);
    const challengesArray = formData.challenges.split(',').map(c => c.trim()).filter(c => c);

    // 解析时间线 JSON
    let timelineArray: TimelineEvent[] | undefined;
    if (formData.timelineData.trim()) {
      try {
        timelineArray = JSON.parse(formData.timelineData);
      } catch (e) {
        alert('时间线数据格式错误，请检查 JSON 格式');
        return;
      }
    }

    if (editingProject) {
      // 编辑现有项目
      setProjects(projects.map(p =>
        p.id === editingProject.id
          ? {
              ...p,
              title: formData.title,
              description: formData.description,
              liveUrl: formData.liveUrl,
              githubUrl: formData.githubUrl || undefined,
              tags: tagsArray,
              category: formData.category,
              image: formData.image || undefined,
              status: formData.status,
              detailedDescription: formData.detailedDescription || undefined,
              screenshots: screenshotsArray.length > 0 ? screenshotsArray : undefined,
              features: featuresArray.length > 0 ? featuresArray : undefined,
              challenges: challengesArray.length > 0 ? challengesArray : undefined,
              startDate: formData.startDate || undefined,
              duration: formData.duration || undefined,
              timeline: timelineArray,
            }
          : p
      ));
    } else {
      // 添加新项目
      const newProject: Project = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl || undefined,
        tags: tagsArray,
        category: formData.category,
        image: formData.image || undefined,
        status: formData.status,
        detailedDescription: formData.detailedDescription || undefined,
        screenshots: screenshotsArray.length > 0 ? screenshotsArray : undefined,
        features: featuresArray.length > 0 ? featuresArray : undefined,
        challenges: challengesArray.length > 0 ? challengesArray : undefined,
        startDate: formData.startDate || undefined,
        duration: formData.duration || undefined,
        timeline: timelineArray,
      };
      setProjects([...projects, newProject]);
    }

    setIsDialogOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    setDeleteProjectId(id);
  };

  const confirmDelete = () => {
    if (deleteProjectId) {
      setProjects(projects.filter(p => p.id !== deleteProjectId));
      setDeleteProjectId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'development':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'archived':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  if (isAdminMode) {
    return (
      <div className="min-h-screen bg-background">
        {/* Admin Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAdminMode(false)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  返回展示页面
                </Button>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">项目管理</h1>
                  <p className="text-muted-foreground mt-1">
                    管理您的 {projects.length} 个项目
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handleAddProject}>
                  <Plus className="h-4 w-4 mr-2" />
                  添加项目
                </Button>
                <Button variant="outline" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  退出登录
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Admin Content */}
        <main className="container mx-auto py-8">
          {/* Settings Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>显示设置</CardTitle>
              <CardDescription>配置项目展示的显示选项</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="admin-image-toggle" className="text-base font-medium">
                      显示项目图片
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      在项目卡片中显示封面图片
                    </p>
                  </div>
                </div>
                <Switch
                  id="admin-image-toggle"
                  checked={showImages}
                  onCheckedChange={setShowImages}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex-1">
                  <Label className="text-base font-medium">
                    主题样式
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    选择您喜欢的主题样式
                  </p>
                </div>
                <ThemeSwitcher />
              </div>
            </CardContent>
          </Card>

          {/* Projects List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">所有项目</h2>
            {projects.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground">暂无项目，点击上方按钮添加您的第一个项目</p>
                </CardContent>
              </Card>
            ) : (
              projects.map((project) => (
                <Card key={project.id} className="group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle>{project.title}</CardTitle>
                          <Badge variant="outline" className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProject(project)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>分类: {project.category}</span>
                        <span>•</span>
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                          在线链接
                        </a>
                        {project.githubUrl && (
                          <>
                            <span>•</span>
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                              GitHub
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? '编辑项目' : '添加新项目'}</DialogTitle>
              <DialogDescription>
                {editingProject ? '修改项目信息' : '填写项目信息以添加到您的作品集'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">项目标题 *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="例如：E-Commerce Platform"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">项目描述 *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="简要描述您的项目功能和特点"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">项目分类 *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Web Apps</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="tool">Tools</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">项目状态 *</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="liveUrl">在线链接 *</Label>
                <Input
                  id="liveUrl"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub 链接（可选）</Label>
                <Input
                  id="githubUrl"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/user/repo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">项目图片 URL（可选）</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">技术标签 *</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="用逗号分隔，例如：React, Node.js, MongoDB"
                />
              </div>

              {/* 详情页字段 */}
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground">详情页内容（可选）</h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="detailedDescription">详细描述（支持 Markdown）</Label>
                    <Textarea
                      id="detailedDescription"
                      value={formData.detailedDescription}
                      onChange={(e) => setFormData({ ...formData, detailedDescription: e.target.value })}
                      placeholder="使用 Markdown 格式编写详细介绍，支持标题、列表、链接等"
                      rows={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="screenshots">项目截图 URL</Label>
                    <Textarea
                      id="screenshots"
                      value={formData.screenshots}
                      onChange={(e) => setFormData({ ...formData, screenshots: e.target.value })}
                      placeholder="用逗号分隔多个图片 URL，例如：https://example.com/1.jpg, https://example.com/2.jpg"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="features">核心功能</Label>
                    <Textarea
                      id="features"
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      placeholder="用逗号分隔，例如：用户认证, 实时通知, 数据可视化"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="challenges">开发挑战</Label>
                    <Textarea
                      id="challenges"
                      value={formData.challenges}
                      onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                      placeholder="用逗号分隔，例如：性能优化, 跨浏览器兼容, 复杂状态管理"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* 时间线字段 */}
              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-semibold mb-3 text-muted-foreground">项目时间线（可选）</h4>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">开始日期</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">开发周期</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="例如：3 个月"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timelineData">时间线事件（JSON 格式）</Label>
                    <Textarea
                      id="timelineData"
                      value={formData.timelineData}
                      onChange={(e) => setFormData({ ...formData, timelineData: e.target.value })}
                      placeholder={`JSON 格式示例：
[
  {
    "id": "1",
    "date": "2024-01-15",
    "title": "项目启动",
    "description": "完成需求分析和技术选型",
    "type": "milestone"
  },
  {
    "id": "2",
    "date": "2024-03-20",
    "title": "核心功能完成",
    "description": "实现用户认证和数据管理",
    "type": "feature"
  }
]`}
                      rows={8}
                      className="font-mono text-xs"
                    />
                    <p className="text-xs text-muted-foreground">
                      事件类型：milestone（里程碑）、feature（新功能）、bugfix（修复）、release（发布）
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                <X className="h-4 w-4 mr-2" />
                取消
              </Button>
              <Button onClick={handleSaveProject}>
                <Save className="h-4 w-4 mr-2" />
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={deleteProjectId !== null} onOpenChange={() => setDeleteProjectId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除</AlertDialogTitle>
              <AlertDialogDescription>
                您确定要删除此项目吗？此操作无法撤销。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto py-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">My Projects</h1>
                <p className="text-muted-foreground mt-1">
                  A collection of {projects.length} deployed projects
                </p>
              </div>
              <Badge variant="outline" className="text-sm">
                {filteredProjects.length} Projects
              </Badge>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search projects, tags, or technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8">
        <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full max-w-2xl grid-cols-5 mb-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <TabsTrigger key={category.value} value={category.value} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.value} value={category.value} className="mt-0">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No projects found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <Card
                      key={project.id}
                      className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50 flex flex-col overflow-hidden"
                    >
                      {showImages && project.image && (
                        <div className="relative w-full h-48 overflow-hidden">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {project.title}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(project.status)} capitalize text-xs`}
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-3">
                          {project.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="flex-grow">
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>

                      <CardFooter className="flex gap-2 pt-4 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProject(project);
                            setIsDetailDialogOpen(true);
                          }}
                        >
                          <Info className="h-4 w-4 mr-2" />
                          详情
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1"
                          asChild
                        >
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            View Live
                          </a>
                        </Button>
                        {project.githubUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2"
                            >
                              <Github className="h-4 w-4" />
                              <span className="hidden sm:inline">Code</span>
                            </a>
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 My Projects. All rights reserved.
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

      {/* 密码验证对话框 */}
      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>管理员身份验证</DialogTitle>
            <DialogDescription>
              请输入管理员密码以访问项目管理功能
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">密码</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handlePasswordSubmit();
                    }
                  }}
                  placeholder="请输入密码"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {authError && (
                <p className="text-sm text-destructive">{authError}</p>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              <p>提示：您可以通过以下方式访问管理功能：</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>在 URL 后添加 ?admin 参数</li>
                <li>按下快捷键 Ctrl+Shift+A</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAuthDialogOpen(false);
                setPassword('');
                setAuthError('');
              }}
            >
              取消
            </Button>
            <Button onClick={handlePasswordSubmit}>
              验证
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 项目详情对话框 */}
      {selectedProject && (
        <ProjectDetailDialog
          project={selectedProject}
          open={isDetailDialogOpen}
          onOpenChange={setIsDetailDialogOpen}
        />
      )}
    </div>
  );
};

export default ProjectNavigationWebsite;
