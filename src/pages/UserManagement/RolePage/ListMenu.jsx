import React, { Children, useEffect, useState } from 'react';
import { Button, Flex, Modal, Tree } from 'antd';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiFetchMenu } from '@/services/lovService';
import { apiCreateRoleMenu } from '@/services/userService';
import queryClient from '@/lib/queryClient';

const treeData = [
  { title: 'Dashboard', key: 'DASH' },
  {
    title: 'Pendaftaran',
    key: 'RGST',
    children: [
      {
        title: 'Pendaftaran Umroh',
        key: 'RGST|UMRH',
        children: [
          { title: 'List Umroh', key: "RGST|UMRH|LIST" },
          { title: 'Tambah Umroh', key: "RGST|UMRH|ADD" },
        ]
      }
    ]
  }
];

function buildTree(flatData) {
  const idMap = {};
  const tree = [];

  flatData.forEach(item => {
    const { id, name } = item;
    const node = { title: name, key: id, children: [] };
    idMap[id] = node;

    const parts = id.split('|');
    if (parts.length === 1) {
      // Ini adalah root
      tree.push(node);
    } else {
      // Ini adalah anak dari parent
      const parentId = parts.slice(0, -1).join('|');
      if (!idMap[parentId]) {
        idMap[parentId] = { title: '', key: parentId, children: [] };
      }
      idMap[parentId].children.push(node);
    }
  });

  // Hapus children kosong
  function cleanEmptyChildren(nodes) {
    nodes.forEach(node => {
      if (node.children.length === 0) {
        delete node.children;
      } else {
        cleanEmptyChildren(node.children);
      }
    });
  }

  cleanEmptyChildren(tree);
  return tree;
}

const ListMenu = ({ open, onCloseForm, onOpenResult, data }) => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const { data: resMenu, isLoading } = useQuery({
    queryKey: ['lov-menu'],
    queryFn: apiFetchMenu,
  });

  const treeData = buildTree(resMenu?.data || [])

  const createRoleMenuMutation = useMutation({
    mutationFn: (payload) => apiCreateRoleMenu(data?.id, payload),
    onSuccess: () => {
      setCheckedKeys()
      onCloseForm();
      queryClient.invalidateQueries(['roles']);
      onOpenResult({
        open: true,
        title: 'Role Menu Berhasil Diperbarui',
        subtitle: `Role Menu untuk ${data?.name} telah berhasil diperbarui ke sistem.`,
      });
    },
  });

  const onExpand = expandedKeysValue => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue) => {
    setSelectedKeys(selectedKeysValue);
  };

  const handleSubmit = () => {
    createRoleMenuMutation.mutate({ data: checkedKeys })
  }

  function filterDeepestOnly(data = []) {
    const set = new Set(data);
    return data.filter((item) => {
      const parts = item.split('|');
      // Kalau item punya child (misal: USRM|ROLE → USRM|ROLE|ADD), maka dia akan dihapus
      for (let i = 1; i < parts.length; i++) {
        const parent = parts.slice(0, i).join('|');
        if (set.has(parent)) {
          // Jika parent ada di set, hapus parent
          set.delete(parent);
        }
      }
      return set.has(item);
    });
  }

  useEffect(() => {
    const roleMenus = data?.menu;
    if (Array.isArray(roleMenus)) {
      setCheckedKeys(filterDeepestOnly(roleMenus));
    } else {
      setCheckedKeys([]);
    }
  }, [data?.menu]);

  return (
    <Modal
      title={`Menu ${data?.name}`}
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={open}
      onCancel={onCloseForm}
      footer={null}
    // onOk={handleOk}
    // onCancel={handleCancel}
    >
      {/* <div style={{ height: 16 }} /> */}
      <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={treeData}
        style={{ padding: '16px 0' }}
      />

      <Flex gap={16} justify='flex-end'>
        <Button color="default" variant="filled" onClick={onCloseForm} loading={isLoading}>
          Batal
        </Button>
        <Button type="primary" onClick={handleSubmit} loading={isLoading}>
          Simpan
        </Button>
      </Flex>
    </Modal>
  );
};
export default ListMenu;
