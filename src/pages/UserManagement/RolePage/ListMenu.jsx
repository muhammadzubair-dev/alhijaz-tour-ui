import React, { Children, useState } from 'react';
import { Modal, Tree } from 'antd';

const treeData = [
  { title: 'Dashboard', key: '0-0' },
  {
    title: 'User Management',
    key: '0-1',
    children: [
      {
        title: 'User',
        key: '0-1-0',
        children: [
          { title: 'View', key: '0-1-0-0' },
          { title: 'Create', key: '0-1-0-1' },
          { title: 'Update', key: '0-1-0-2' },
          { title: 'Change Status', key: '0-1-0-3' }
        ]
      },
      { title: 'Role', key: '0-1-1' },
      { title: 'Agent', key: '0-1-2' }
    ]
  },
  {
    title: 'Data Master',
    key: '0-2',
    children: [
      { title: 'Bank', key: '0-2-0' },
      { title: 'Social Media', key: '0-2-1' },
      { title: 'Fee', key: '0-2-0-2' },
      { title: 'Jamaah', key: '0-2-0-3' },
      { title: 'Region', key: '0-2-0-4' },
      { title: 'Hotel', key: '0-2-0-5' },
      { title: 'Package', key: '0-2-0-6' },
      { title: 'Airlines', key: '0-2-0-7' },
      { title: 'Partner', key: '0-2-0-8' },
      { title: 'Product Type', key: '0-2-0-9' },
      { title: 'Role', key: '0-2-0-10' },
      { title: 'Agent', key: '0-2-0-11' },
      { title: 'Transportasi', key: '0-2-0-12' },
    ]
  },
];

const ListMenu = () => {
  const [expandedKeys, setExpandedKeys] = useState(['0-0-0', '0-0-1']);
  const [checkedKeys, setCheckedKeys] = useState(['0-0-0']);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const onExpand = expandedKeysValue => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
  const onCheck = checkedKeysValue => {
    console.log('onCheck', checkedKeysValue);
    setCheckedKeys(checkedKeysValue);
  };
  const onSelect = (selectedKeysValue, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeysValue);
  };
  return (
    <Modal
      title="List Menu Role 'Super Admin'"
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={true}
    // onOk={handleOk}
    // onCancel={handleCancel}
    >
      <div style={{ height: 16 }} />
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
    </Modal>
  );
};
export default ListMenu;