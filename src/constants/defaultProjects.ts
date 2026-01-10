import { Globe, Code2, Rocket, Filter, Search, LucideIcon } from 'lucide-react';
import { Project } from '@/types/project';

export interface Category {
  value: string;
  label: string;
  icon: LucideIcon;
}

export const categories: Category[] = [
  { value: 'all', label: 'All Projects', icon: Globe },
  { value: 'web', label: 'Web Apps', icon: Code2 },
  { value: 'mobile', label: 'Mobile', icon: Rocket },
  { value: 'tool', label: 'Tools', icon: Filter },
  { value: 'analytics', label: 'Analytics', icon: Search },
];

export const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'Allist',
    description: 'A full-stack e-commerce solution with payment integration, inventory management, and real-time analytics dashboard.',
    liveUrl: 'https://alist.sukisq.cloud',
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
    title: 'Blog',
    description: 'Collaborative task management tool with drag-and-drop interface, team collaboration features, and deadline tracking.',
    liveUrl: 'https://blog.sukisq.me',
    githubUrl: 'https://github.com/blessonism/Hextra-blog',
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
    title: 'weread2flomo',
    description: 'Real-time weather monitoring dashboard with interactive maps, forecasts, and historical data visualization.',
    liveUrl: 'https://weread2flomo.sukisq.me/',
    githubUrl: 'https://github.com/blessonism/weread2flomo',
    tags: ['React', 'TypeScript', 'Chart.js', 'API'],
    category: 'web',
    status: 'live',
    image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop',
  },
  {
    id: '4',
    title: '倒计时',
    description: 'AI-powered portfolio website generator that creates personalized portfolio sites based on user input and preferences.',
    liveUrl: 'https://time.sukisq.me/',
    githubUrl: 'https://github.com/blessonism/deadline',
    tags: ['Next.js', 'OpenAI', 'Prisma', 'PostgreSQL'],
    category: 'tool',
    status: 'live',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
  },
  {
    id: '5',
    title: '工具导航栏',
    description: 'Comprehensive analytics platform for tracking social media performance across multiple platforms with AI insights.',
    liveUrl: 'https://tool.sukisq.me/zh',
    githubUrl: 'https://github.com/blessonism/devtoolset',
    tags: ['Python', 'Django', 'React', 'TensorFlow'],
    category: 'analytics',
    status: 'development',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
  },
  {
    id: '6',
    title: 'Prompt 优化器',
    description: 'Mobile-first fitness tracking application with workout plans, nutrition tracking, and progress visualization.',
    liveUrl: 'https://prompt.sukisq.me/',
    githubUrl: 'https://github.com/blessonism/prompt',
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
