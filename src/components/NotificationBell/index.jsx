import React, { useState } from 'react';
import { Popover, List, Badge, Avatar, Button, Typography, Flex } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { apiFetchTasks } from '@/services/TaskService';
import moment from 'moment';

const NotificationPopover = () => {
  const [filterTasks, setFilterTasks] = useState({
    page: 1,
    limit: 10,
    sortBy: null,
    sortOrder: null,
    id: '',
    title: '',
    status: status, // initial dari props
  });

  const { data: resTasks } = useQuery({
    queryKey: ['tasks', filterTasks.page, filterTasks.limit, filterTasks.sortBy, filterTasks.sortOrder, filterTasks.status],
    queryFn: () => apiFetchTasks(filterTasks),
  });

  const dataTasks = resTasks?.data || []
  const unreadCount = resTasks?.summary?.unreadCount || 0
  const dataNotifications = dataTasks.map(item => ({
    id: item.id,
    title: item.type,
    createdAt: moment(item.createdAt).format('DD MMM YYYY HH:mm'),
    description: item.notes,
  }))

  const content = (
    <div style={{ width: 300, maxHeight: 600, overflow: 'auto' }}>
      <List
        header={
          <Flex justify='flex-end'>
            <Typography.Link style={{ textDecoration: 'underline' }}>Tandai Semua Sudah Dibaca</Typography.Link>
          </Flex>
        }
        itemLayout="horizontal"
        dataSource={dataNotifications}
        locale={{ emptyText: 'Tidak ada notifikasi' }}
        footer={
          <Flex justify='center'>
            <Typography.Link>Load More</Typography.Link>
          </Flex>}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              // avatar={<Avatar src={item.avatar} />}
              title={
                <Flex justify='space-between'>
                  <span>{item.title}</span>
                  <span style={{ fontSize: 12, fontWeight: 400 }}>{moment(item.createdAt).fromNow()}</span>
                </Flex>
              }
              description={item.description}
            />
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
      <Badge count={unreadCount} offset={[-2, 2]}>
        <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
      </Badge>
    </Popover>
  );
};

export default NotificationPopover;
