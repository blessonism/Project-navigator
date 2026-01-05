import React from 'react';
import { ChallengeSection, Challenge } from './ChallengeSection';

// 使用示例
const ExampleUsage: React.FC = () => {
  const sampleChallenges: Challenge[] = [
    {
      title: "高并发下的库存一致性",
      description: "在电商平台中，多个用户同时购买同一商品时，如何确保库存数据的一致性，避免超卖现象。",
      solution: "实现了基于Redis的分布式锁机制，结合数据库乐观锁，确保库存扣减的原子性操作。"
    },
    {
      title: "支付安全与PCI合规",
      description: "处理用户支付信息时需要满足PCI DSS标准，确保敏感数据的安全传输和存储。",
      solution: "集成Stripe支付网关，采用tokenization技术，敏感数据不经过我们的服务器，通过安全审计。"
    },
    {
      title: "实时数据同步性能",
      description: "多个用户界面需要实时显示库存变化，传统轮询方式造成服务器压力过大。",
      solution: "采用WebSocket长连接 + Redis发布订阅模式，实现高效的实时数据推送机制。"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">项目挑战展示</h1>

      {/* 基础使用 */}
      <ChallengeSection challenges={sampleChallenges} />

      {/* 带自定义样式 */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">自定义样式示例</h2>
        <ChallengeSection
          challenges={sampleChallenges.slice(0, 2)}
          className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg"
        />
      </div>

      {/* 空状态测试 */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">空状态测试</h2>
        <ChallengeSection challenges={[]} />
        <p className="text-gray-500 text-sm mt-2">↑ 空数组时组件不渲染任何内容</p>
      </div>
    </div>
  );
};

export default ExampleUsage;