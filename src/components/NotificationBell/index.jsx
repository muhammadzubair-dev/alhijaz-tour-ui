import React, { useEffect, useState } from 'react';
import { Popover, List, Badge, Typography, Flex } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { apiFetchTasks } from '@/services/TaskService';
import moment from 'moment';
import { connectSSE, disconnectSSE } from '@/utils/sse';
import useAuthStore from '@/store/authStore';

const NotificationPopover = () => {
  const authUser = useAuthStore((state) => state.user); // ambil user.id
  const [filterTasks, setFilterTasks] = useState({
    page: 1,
    limit: 5,
    sortBy: null,
    sortOrder: null,
    id: '',
    title: '',
    status: '0',
  });

  const [allNotifications, setAllNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: resTasks, isFetching } = useQuery({
    queryKey: ['tasks', filterTasks.page, filterTasks.limit, filterTasks.sortBy, filterTasks.sortOrder, filterTasks.status],
    queryFn: () => apiFetchTasks(filterTasks),
    keepPreviousData: true,
    enabled: !!authUser, // hanya fetch kalau user tersedia
  });

  const totalPages = resTasks?.paging?.totalPages || 1;
  const currentPageData = resTasks?.data || [];

  // ⬅️ Saat fetch API selesai, isi awal dan unread
  useEffect(() => {
    if (filterTasks.page === 1) {
      setAllNotifications(currentPageData);
    } else {
      setAllNotifications((prev) => [...prev, ...currentPageData]);
    }
    setUnreadCount(resTasks?.summary?.unreadCount || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageData]);

  // ⬅️ SSE setup
  useEffect(() => {
    if (!authUser?.id) return;

    connectSSE(
      authUser.id,
      (data) => {
        setAllNotifications((prev) => [data, ...prev]);
        setUnreadCount((prev) => prev + 1);
      },
      (error) => {
        console.error('SSE Error:', error);
      }
    );

    return () => {
      disconnectSSE();
    };
  }, [authUser?.id]);

  const handleLoadMore = () => {
    if (filterTasks.page < totalPages) {
      setFilterTasks((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const content = (
    <div style={{ width: 300, maxHeight: 600, overflow: 'auto' }}>
      <List
        header={
          <Flex justify='flex-end'>
            <Typography.Link style={{ textDecoration: 'underline' }}>
              Tandai Semua Sudah Dibaca
            </Typography.Link>
          </Flex>
        }
        itemLayout="horizontal"
        dataSource={allNotifications}
        locale={{ emptyText: 'Tidak ada notifikasi' }}
        footer={
          filterTasks.page < totalPages && (
            <Flex justify='center'>
              <Typography.Link onClick={handleLoadMore} disabled={isFetching}>
                {isFetching ? 'Loading...' : 'Load More'}
              </Typography.Link>
            </Flex>
          )
        }
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Flex justify='space-between'>
                  <span>{item.type}</span>
                  <span style={{ fontSize: 12 }}>{moment(item.createdAt).fromNow()}</span>
                </Flex>
              }
              description={item.notes}
            />
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <Popover content={content} trigger="click" placement="bottomRight" arrow={false}>
      <Badge count={unreadCount} offset={[-2, 2]}>
        <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
      </Badge>
    </Popover>
  );
};

export default NotificationPopover;
