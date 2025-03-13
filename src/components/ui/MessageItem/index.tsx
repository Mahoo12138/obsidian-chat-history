import React from 'react';
import { Message, ContentBlock } from '@/lib/type';
import Avatar from '@/components/ui/Avatar';  // 新增 Avatar 组件导入

interface MessageProps {
  message: Message;
}



export const MessageItem: React.FC<MessageProps> = ({ message }) => {
  // 新增头像配置
  const avatarConfig = {
    size: 'sm' as const,
    shape: 'circle' as const,
    username: message.role === 'me' ? 'You' : message.role
  };

  // 修改容器样式为 flex 布局
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    flexDirection: message.role === 'user' ? 'row' : 'row-reverse',
    margin: '1rem 0'
  };

  // 消息内容样式调整
  const contentStyle: React.CSSProperties = {
    padding: '1rem',
    borderRadius: '1rem',
    maxWidth: '80%',
    backgroundColor: message.role === 'user' ? '#e3f2fd' : '#f5f5f5',
  };

  // 渲染结构化内容
  const renderContent = (content: ContentBlock | string) => {
    if (typeof content === 'string') {
      return <p>{content}</p>;
    }

    switch (content.type) {
      case 'image':
        return <img src={content.value} alt="Attachment" style={{ maxWidth: '100%' }} />;
      case 'quote':
        return <blockquote cite={content.source}>{content.value}</blockquote>;
      default:
        return <p>{content.value}</p>;
    }
  };

  return (
    <div style={containerStyle}>
      {/* 新增头像部分 */}
      <Avatar
        src={message.role === 'me' ? '/default-me-avatar.png' : '/default-user-avatar.png'}
        {...avatarConfig}
      />

      <div style={contentStyle}>
        {/* 消息头 */}
        <div style={{ marginBottom: '0.5rem' }}>
          <small style={{ opacity: 0.7 }}>
            {message.role} · {message.createdAt?.toLocaleString()}
          </small>
        </div>

        {/* 消息内容 */}
        <div>
          {Array.isArray(message.content)
            ? message.content.map(renderContent)
            : renderContent(message.content)}
        </div>

        {/* 附件展示 */}
        {message.attachments?.map(attach => (
          <div key={attach.url} style={{ marginTop: '0.5rem' }}>
            <a href={attach.url} target="_blank" rel="noopener noreferrer">
              {attach.name || 'Download Attachment'}
            </a>
          </div>
        ))}

        {/* 工具调用状态 */}
        {message.toolInvocations?.map((tool, index) => (
          <div key={index} style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            backgroundColor: 'rgba(0,0,0,0.05)'
          }}>
            <small>{tool.toolName} - {tool.state}</small>
          </div>
        ))}
      </div>
    </div>
  );
};