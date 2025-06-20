import React, { useEffect, useState } from 'react';
import { Popover, List, Badge, Typography, Flex, theme } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiFetchTasks, apiFetchTasksAssigned, apiTasksRead } from '@/services/TaskService';
import moment from 'moment';
import { connectSSE, disconnectSSE } from '@/utils/sse';
import useAuthStore from '@/store/authStore';
import styles from './index.module.css'; // import css animasi
import { IoIosNotifications } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const NotificationPopover = () => {
  const { token } = theme.useToken()
  const navigate = useNavigate()
  const authUser = useAuthStore((state) => state.user);
  const [isShaking, setIsShaking] = useState(false);
  const [filterTasks, setFilterTasks] = useState({
    page: 1,
    limit: 2,
    sortBy: null,
    sortOrder: null,
    id: '',
    title: '',
  });

  const [allNotifications, setAllNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: resTasks, isFetching } = useQuery({
    queryKey: ['tasks-notification', filterTasks.page, filterTasks.limit],
    queryFn: () => apiFetchTasksAssigned(filterTasks),
    keepPreviousData: true,
    enabled: !!authUser,
  });

  const readMutation = useMutation({
    mutationFn: apiTasksRead,
    onSuccess: (_, variables) => {
      if (variables?.taskId) {
        // ✅ Update 1 task jadi isRead true
        setAllNotifications((prev) =>
          prev.map((item) =>
            item.id === variables.taskId ? { ...item, isRead: true } : item
          )
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      } else {
        // ✅ Jika mark semua sebagai read
        setAllNotifications((prev) =>
          prev.map((item) => ({ ...item, isRead: true }))
        );
        setUnreadCount(0);
      }
    },
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

  const handleReadAll = () => {
    readMutation.mutate({})
  }

  const content = (
    <div style={{ width: 300, maxHeight: 600, overflow: 'auto' }}>
      <List
        header=
        {unreadCount !== 0 && (
          <Flex justify='flex-end'>
            <Typography.Link onClick={handleReadAll} style={{ textDecoration: 'underline' }}>
              Tandai Semua Sudah Dibaca
            </Typography.Link>
          </Flex>
        )}

        dataSource={allNotifications}
        // locale={{ emptyText: 'Tidak ada notifikasi' }}

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
          <List.Item
            className={`${styles.item} ${styles.hoverable} ${!item.isRead ? styles.unread : ''}`}
            onClick={() => {
              if (!item.isRead) {
                readMutation.mutate({ taskId: item.id })
              }
              navigate(`/task/${item.id}`)
            }
            }
            style={{
              padding: 16,
              '--hover-bg': token.colorFillSecondary,
              '--unread-bg': token.colorInfoBg,
            }}
          >
            <List.Item.Meta
              title={
                <Flex justify='space-between' style={{ gap: 12 }}>
                  <span style={{ fontWeight: 600 }}>{item.type}</span>
                  <span style={{ fontSize: 12, color: token.colorTextTertiary, flexShrink: 0 }}>{moment(item.createdAt).fromNow()}</span>
                </Flex>
              }
              description={
                <div style={{ color: token.colorTextSecondary }} dangerouslySetInnerHTML={{ __html: item.notes }} />
              }
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
