import GENDER from '@/constant/gender';
import MARRIED_STATUS from '@/constant/marriedStatus';
import { MENU_IDS } from '@/constant/menu';
import RELATIONSHIP from '@/constant/relationship';
import TASK_STATUS from '@/constant/taskStatus';
import useHasPermission from '@/hooks/useHasPermisson';
import queryClient from '@/lib/queryClient';
import {
  apiFetchLovAgents, apiFetchLovDistricts, apiFetchLovNeighborhoods,
  apiFetchLovProvinces, apiFetchLovStaff, apiFetchLovSubDistricts,
  apiFetchUmrohPackage, apiFetchUmrohPackageRooms
} from '@/services/lovService';
import { apiEditTaskAssignedStatus, apiEditTaskStatus, apiFetchTaskDetail } from '@/services/TaskService';
import { apiFetchUmrohDetail } from '@/services/umrohService';
import getStatusColor from '@/utils/getStatusColor';
import numberId from '@/utils/numberId';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Button, Col, Descriptions, Divider, Dropdown, Flex, Menu, Modal, Row
} from 'antd';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa';
import { useLocation, useParams } from 'react-router-dom';

const renderText = (value) => value || '-';

const DetailUmrohPage = () => {
  const canEditStatus = useHasPermission([
    MENU_IDS.TaskAllStatus,
    MENU_IDS.TaskMeStatus,
  ])
  const { pathname } = useLocation()
  const { idRegister, taskId } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');

  const showImage = (url) => {
    setModalImageUrl(url);
    setIsModalVisible(true);
  };
  const closeModal = () => {
    setIsModalVisible(false);
    setModalImageUrl('');
  };

  const { data: resUmrohDetail } = useQuery({
    queryKey: ['umroh-detail', idRegister],
    queryFn: () => apiFetchUmrohDetail(idRegister),
    enabled: !!idRegister
  });

  const { data: resTaskJamaahUmroh, refetch: refetchTask } = useQuery({
    queryKey: ['task-jamaah-umroh', taskId],
    queryFn: () => apiFetchTaskDetail(taskId),
    enabled: !!taskId
  });

  const isTaskAll = pathname.includes('/task/all')
  const editTaskStatus = useMutation({
    mutationFn: (payload) => isTaskAll ? apiEditTaskStatus(taskId, { newStatus: Object.values(payload) }) : apiEditTaskAssignedStatus(taskId, { newStatus: Object.values(payload) }),
    onSuccess: () => {
      refetchTask()
    },
  });

  const data = resUmrohDetail?.data || resTaskJamaahUmroh?.data?.data || {};
  const statusTask = resTaskJamaahUmroh?.data?.status
  const { color, label } = getStatusColor(statusTask || '0');

  const { data: agent } = useQuery({
    queryKey: ['lov-agents', data?.agentId],
    queryFn: () => apiFetchLovAgents({ agentId: data?.agentId }),
    enabled: !!data?.agentId,
  });

  const { data: staff } = useQuery({
    queryKey: ['lov-staff', data?.staffId],
    queryFn: () => apiFetchLovStaff({ staffId: data?.staffId }),
    enabled: !!data?.staffId,
  });

  const { data: province } = useQuery({
    queryKey: ['lov-province', data?.province],
    queryFn: () => apiFetchLovProvinces({ provinceId: data?.province }),
    enabled: !!data?.province,
  });

  const { data: district } = useQuery({
    queryKey: ['lov-districts', data?.province, data?.district],
    queryFn: () => apiFetchLovDistricts(data?.province, { districtId: data?.district }),
    enabled: !!data?.province && !!data?.district,
  });

  const { data: subDistrict } = useQuery({
    queryKey: ['lov-subDistricts', data?.province, data?.district, data?.subDistrict],
    queryFn: () => apiFetchLovSubDistricts(data?.province, data?.district, { districtId: data?.subDistrict }),
    enabled: !!data?.province && !!data?.district && !!data?.subDistrict,
  });

  const { data: neighborhoods } = useQuery({
    queryKey: ['lov-neighborhoods', data?.province, data?.district, data?.subDistrict, data?.neighborhoods],
    queryFn: () =>
      apiFetchLovNeighborhoods(data?.province, data?.district, data?.subDistrict, {
        neighborhoodId: data?.neighborhoods,
      }),
    enabled: !!data?.province && !!data?.district && !!data?.subDistrict && !!data?.neighborhoods,
  });

  const { data: packageUmroh } = useQuery({
    queryKey: ['lov-package', data?.packageId],
    queryFn: () => apiFetchUmrohPackage({ packageId: data?.packageId }),
    enabled: !!data?.packageId,
  });

  const { data: packageRoomPrice } = useQuery({
    queryKey: ['lov-package-price', data?.packageId, data?.packageRoomPrice],
    queryFn: () => apiFetchUmrohPackageRooms(data?.packageId, {
      packageRoomId: data?.packageRoomPrice,
    }),
    enabled: !!data?.packageId && !!data?.packageRoomPrice,
  });

  const fullName = useMemo(() => {
    return [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' ');
  }, [data.firstName, data.middleName, data.lastName]);

  const allowedTransitions = {
    '0': ['1'],       // Pending ➝ In Progress
    '1': ['2', '3'],  // In Progress ➝ Done or Rejected
  };

  const statusMenu = {
    items: Object.entries(TASK_STATUS).map(([key, label]) => ({
      key,
      label,
      disabled: !allowedTransitions[statusTask]?.includes(key),
    })),

    onClick: ({ key }) => {
      if (!allowedTransitions[statusTask]?.includes(key)) {
        return; // Prevent update jika tidak valid
      }

      const handleUpdate = () => {
        editTaskStatus.mutate(key, {
          onSuccess: () => {
            refetchTask()
            queryClient.invalidateQueries('tasks')
            Modal.success({
              title: 'Status Diperbarui',
              content: `Status berhasil diubah menjadi "${TASK_STATUS[key]}"`,
            });
          },
          // onError: (err) => {
          //   Modal.error({
          //     title: 'Gagal Mengubah Status',
          //     content: err?.response?.data?.message || 'Terjadi kesalahan.',
          //   });
          // },
        });
      };

      if (key === '2') {
        // Jika status "Done"
        Modal.confirm({
          title: 'Konfirmasi Selesai',
          icon: <ExclamationCircleOutlined />,
          content: 'Apakah Anda yakin seluruh data jamaah sudah lengkap dan sesuai?',
          okText: 'Ya, sudah sesuai',
          cancelText: 'Batal',
          onOk: handleUpdate,
        });
      } else if (key === '3') {
        // Jika status "Rejected"
        Modal.confirm({
          title: 'Konfirmasi Penolakan',
          icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
          content: 'Apakah Anda yakin ingin menolak data jamaah karena tidak sesuai?',
          okText: 'Ya, tolak data',
          cancelText: 'Batal',
          onOk: handleUpdate,
        });
      } else {
        // Untuk status lain, langsung update tanpa konfirmasi
        handleUpdate();
      }
    },
  };

  return (
    <>
      <Flex justify="flex-end" style={{ marginBottom: 16 }}>
        {statusTask && canEditStatus && (
          <Dropdown menu={statusMenu} trigger={['click']} placement="bottomRight">
            <Button
              size="large"
              icon={<FaCaretDown />}
              color={color}
              variant='solid'
            >
              {label}
            </Button>
          </Dropdown>
        )}
      </Flex>

      <Row gutter={16}>
        <Col lg={12}>
          <Descriptions title="Informasi Jamaah" bordered column={1}>
            <Descriptions.Item label="Nomor KTP">{renderText(data.identityNumber)}</Descriptions.Item>
            <Descriptions.Item label="Nama Lengkap">{renderText(fullName)}</Descriptions.Item>
            <Descriptions.Item label="Jenis Kelamin">{GENDER[data.gender] || '-'}</Descriptions.Item>
            <Descriptions.Item label="Status Pernikahan">{MARRIED_STATUS[data.marriedStatus] || '-'}</Descriptions.Item>
            <Descriptions.Item label="Tempat, Tanggal Lahir">
              {`${renderText(data.birthPlace)}, ${data.birthDate ? moment(data.birthDate).format('DD MMMM YYYY') : '-'
                }`}
            </Descriptions.Item>
            <Descriptions.Item label="No. Telepon">{renderText(data.phoneNumber)}</Descriptions.Item>

            <Descriptions.Item label="Foto KTP">
              {data.photoIdentity ? (
                <a onClick={() => showImage(data.photoIdentity)}>Lihat Gambar</a>
              ) : (
                '-'
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Foto Selfie">
              {data.selfPhoto ? (
                <a onClick={() => showImage(data.selfPhoto)}>Lihat Gambar</a>
              ) : (
                '-'
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Alamat">{renderText(data.address)}</Descriptions.Item>
            <Descriptions.Item label="Provinsi">{renderText(province?.data?.[0]?.name)}</Descriptions.Item>
            <Descriptions.Item label="Kabupaten/Kota">{renderText(district?.data?.[0]?.name)}</Descriptions.Item>
            <Descriptions.Item label="Kecamatan">{renderText(subDistrict?.data?.[0]?.name)}</Descriptions.Item>
            <Descriptions.Item label="Kelurahan">{renderText(neighborhoods?.data?.[0]?.name)}</Descriptions.Item>
          </Descriptions>
        </Col>

        <Col lg={12}>
          <Descriptions title="Informasi Pendaftar" bordered column={1}>
            <Descriptions.Item label="Nama Pendaftar">{renderText(data.registerName)}</Descriptions.Item>
            <Descriptions.Item label="Telepon Pendaftar">{renderText(data.registerPhone)}</Descriptions.Item>
            <Descriptions.Item label="Nama Agent">{renderText(agent?.data?.[0]?.name)}</Descriptions.Item>
            <Descriptions.Item label="Staff">{renderText(staff?.data?.[0]?.name)}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <Divider />

      <Row gutter={16}>
        <Col lg={12}>
          <Descriptions title="Informasi Paket & Biaya" bordered column={1}>
            <Descriptions.Item label="Paket Umroh">
              {renderText(packageUmroh?.data?.[0]?.name)}
            </Descriptions.Item>
            <Descriptions.Item label="Harga Kamar">
              {numberId(packageRoomPrice?.data?.[0]?.price)}
            </Descriptions.Item>
            <Descriptions.Item label="Diskon Kantor">
              {data.officeDiscount ? numberId(data.officeDiscount) : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Diskon Agen">
              {data.agentDiscount ? numberId(data.agentDiscount) : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Biaya Lain-lain">
              {data.otherExpenses ? numberId(data.otherExpenses) : '-'}
            </Descriptions.Item>
          </Descriptions>
        </Col>

        <Col lg={12}>
          <Descriptions title="Informasi Lainnya" bordered column={1}>
            <Descriptions.Item label="Remarks">
              {RELATIONSHIP[data.remarks] || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Mahram">{renderText(data.mahram)}</Descriptions.Item>
            <Descriptions.Item label="Kondisi Kesehatan">{renderText(data.medicalCondition)}</Descriptions.Item>
            <Descriptions.Item label="Notes">{renderText(data.notes)}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <Modal open={isModalVisible} footer={null} onCancel={closeModal} width={720} centered>
        <img
          src={modalImageUrl}
          alt="Gambar"
          style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }}
        />
      </Modal>
    </>
  );
};

export default DetailUmrohPage;
