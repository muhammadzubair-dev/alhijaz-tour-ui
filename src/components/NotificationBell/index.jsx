import React from 'react';
import { Popover, List, Badge, Avatar, Button, Typography, Flex } from 'antd';
import { BellOutlined } from '@ant-design/icons';

const notifications = [
  {
    id: 1,
    title: 'Pesan baru dari Budi',
    description: 'Cek pesanmu sekarang.',
    avatar: 'https://i.pravatar.cc/40?img=1',
  },
  {
    id: 2,
    title: 'Update sistem',
    description: 'Sistem akan diperbarui malam ini.',
    avatar: 'https://i.pravatar.cc/40?img=2',
  },
  {
    id: 1,
    title: 'Pesan baru dari Budi',
    description: 'Cek pesanmu sekarang.',
    avatar: 'https://i.pravatar.cc/40?img=1',
  },
  {
    id: 2,
    title: 'Update sistem',
    description: 'Sistem akan diperbarui malam ini.',
    avatar: 'https://i.pravatar.cc/40?img=2',
  },
];

const NotificationPopover = () => {
  const content = (
    <div style={{ width: 300, maxHeight: 600, overflow: 'auto' }}>
      <List
        header={
          <Flex justify='flex-end'>
            <Typography.Link style={{ textDecoration: 'underline' }}>Tandai Semua Sudah Dibaca</Typography.Link>
          </Flex>
        }
        itemLayout="horizontal"
        dataSource={notifications}
        locale={{ emptyText: 'Tidak ada notifikasi' }}
        footer={
          <Flex justify='center'>
            <Typography.Link>Load More</Typography.Link>
          </Flex>}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              // avatar={<Avatar src={item.avatar} />}
              title={item.title}
              description={item.description}
            />
            Aku adalah anak gembala selalu riang serta gembira
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottomRight"
      arrow={false}
    >
      <Badge count={notifications.length} offset={[-2, 2]}>
        <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
      </Badge>
    </Popover>
  );
};

export default NotificationPopover;
