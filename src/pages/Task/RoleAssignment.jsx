import { ResultSuccess } from '@/components';
import queryClient from '@/lib/queryClient';
// import { apiDeleteRoleAssignment, apiFetchRoleAssignments } from '@/services/masterService';
import getSortOrder from '@/utils/getSortOrder';
import { CheckCircleFilled, CloseCircleFilled, DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button, Flex, Input, message, Popconfirm, Select, Space, Table, Tooltip } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import FormRoleAssignment from './components/FormRoleAssignment';
import useHasPermission from '@/hooks/useHasPermisson';
import { MENU_IDS } from '@/constant/menu';
import HasPermission from '@/layouts/HasPermission';
import { apiFetchTaskRole } from '@/services/TaskService';
import { apiDeleteAirline } from '@/services/masterService';

const RoleAssignment = () => {
  const canEditRole = useHasPermission([
    MENU_IDS.TaskRoleEdit,
  ])
  const [openForm, setOpenForm] = useState(false)
  const [openResult, setOpenResult] = useState({
    open: false,
    title: '',
    subtitle: ''
  })
  const [filterRoleAssignments, setFilterRoleAssignments] = useState({
    page: 1,
    limit: 10,
    sortBy: null,
    sortOrder: null,
    name: '',
    status: null,
  })
  const [selectedRoleAssignment, setSelectedRoleAssignment] = useState(null);
  const { data: dataRoleAssignments } = useQuery({
    queryKey: ['tasks-role', filterRoleAssignments.page, filterRoleAssignments.limit, filterRoleAssignments.sortBy, filterRoleAssignments.sortOrder],
    queryFn: () => apiFetchTaskRole(filterRoleAssignments),
  });

  const handleCloseForm = () => {
    setSelectedRoleAssignment(null)
    setOpenForm(false)
  }

  const handleOpenFormEdit = (data) => {
    setSelectedRoleAssignment(data)
    setOpenForm(true)
  }

  const handleOpenResult = (values) => {
    setOpenResult((prevState) => ({
      ...prevState,
      ...values
    }))
  }

  const handleTableChange = (pagination, filters, sorter) => {
    const singleSorter = Array.isArray(sorter) ? sorter[0] : sorter;
    setFilterRoleAssignments(prev => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
      sortBy: singleSorter?.field || null,
      sortOrder: singleSorter?.order ? (singleSorter.order === 'ascend' ? 'asc' : 'desc') : null,
    }));
  };

  const columns = [
    {
      title: 'Task Code',
      width: 100,
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Task Name',
      width: 100,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Assign Task to Role',
      width: 100,
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: 'Aktif',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 50,
      align: 'center',
      render: (value) => value ? <CheckCircleFilled style={{ color: "#52c41a" }} /> : <CloseCircleFilled style={{ color: "#ff4d4f" }} />,
    },
    {
      title: 'Description',
      width: 150,
      dataIndex: 'description',
      key: 'description',
    },
    ...(canEditRole ? [{
      title: 'Edit Role',
      key: 'operation',
      fixed: 'right',
      width: 100,
      render: (values) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              color='blue'
              variant='text'
              shape="circle"
              size='small'
              icon={<EditOutlined />}
              onClick={() => handleOpenFormEdit(values)}
            />
          </Tooltip>
        </Space>
      ),
    }] : [])
  ];

  return (
    <div>
      <Table
        rowKey='id'
        size='middle'
        columns={columns}
        dataSource={dataRoleAssignments?.data}
        scroll={{ x: 1500, y: `calc(100vh - 400px)` }}
        // sticky={{ offsetHeader: 64 }}
        onChange={handleTableChange}
        pagination={{
          total: dataRoleAssignments?.paging?.total,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          pageSize: filterRoleAssignments.limit,
          showSizeChanger: true,
          pageSizeOptions: [10, 25, 50, 100],
        }}
      />
      <FormRoleAssignment open={openForm} data={selectedRoleAssignment} onCloseForm={handleCloseForm} onOpenResult={handleOpenResult} />
      <ResultSuccess open={openResult} onOpenResult={handleOpenResult} />
    </div>
  );
};

export default RoleAssignment;