import React, { useEffect, useState } from 'react';
import { Popover, List, Badge, Typography, Flex, theme } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { apiFetchTasks } from '@/services/TaskService';
import moment from 'moment';
import { connectSSE, disconnectSSE } from '@/utils/sse';
import useAuthStore from '@/store/authStore';
import styles from './index.module.css'; // import css animasi
import { IoIosNotifications } from "react-icons/io";

const NotificationPopover = () => {
  const { token } = theme.useToken()
  const authUser = useAuthStore((state) => state.user);
  const [isShaking, setIsShaking] = useState(false);
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
    queryKey: ['tasks', filterTasks.page, filterTasks.limit],
    queryFn: () => apiFetchTasks(filterTasks),
    keepPreviousData: true,
    enabled: !!authUser,
  });

  useEffect(() => {
    if (filterTasks.page === 1) {
      setAllNotifications(resTasks?.data || []);
    } else {
      setAllNotifications((prev) => [...prev, ...(resTasks?.data || [])]);
    }
    setUnreadCount(resTasks?.summary?.unreadCount || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resTasks?.data]);

  const playNotificationSound = () => {
    const audio = new Audio('/sounds/notification.wav');
    audio.play().catch(() => { });
  };

  const triggerShake = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 700);
  };

  const showNativeNotification = (title, body) => {
    if (!("Notification" in window)) {
      alert("Browser tidak mendukung notifikasi.");
      return;
    }

    // Minta izin jika belum
    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/icon.png", // opsional
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, {
            body,
            icon: "/icon.png",
          });
        }
      });
    }
  };

  useEffect(() => {
    if (!authUser?.id) return;

    connectSSE(
      authUser.id,
      (data) => {
        setAllNotifications((prev) => [data, ...prev]);
        setUnreadCount((prev) => prev + 1);
        playNotificationSound();
        triggerShake();
      },
      (err) => console.error('SSE error:', err)
    );

    return () => disconnectSSE();
  }, [authUser?.id]);

  const handleLoadMore = () => {
    if (resTasks?.paging?.totalPages && filterTasks.page < resTasks.paging.totalPages) {
      setFilterTasks((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handleTest = () => {
    playNotificationSound();
    triggerShake();
    showNativeNotification("Notifikasi Baru", "Anda mendapat tugas validasi jamaah.");
  }

  const content = (
    <div style={{ width: 300, maxHeight: 600, overflow: 'auto' }}>
      <List
        header={
          <Flex justify='flex-end'>
            <Typography.Link onClick={handleTest}>Tandai Semua Sudah Dibaca</Typography.Link>
          </Flex>
        }
        dataSource={allNotifications}
        locale={{ emptyText: 'Tidak ada notifikasi' }}
        footer={
          filterTasks.page < (resTasks?.paging?.totalPages || 1) && (
            <Flex justify='center'>
              <Typography.Link onClick={handleLoadMore}>
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
        <IoIosNotifications
          className={isShaking ? styles['bell-shake'] : ''}
          style={{ fontSize: 30, cursor: 'pointer', color: token.colorTextSecondary }}
        />
      </Badge>
    </Popover>
  );
};

export default NotificationPopover;
