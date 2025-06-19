import { apiFetchUmrohDetail } from '@/services/umrohService';
import { useQuery } from '@tanstack/react-query';
import { Col, Descriptions, Divider, Row } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

const DetailUmrohPage = () => {
  const { idRegister } = useParams();

  const { data: resUmrohDetail } = useQuery({
    queryKey: ['umroh-detail', idRegister],
    queryFn: () => apiFetchUmrohDetail(idRegister),
  });

  const data = resUmrohDetail?.data || {};

  const fullName = [data.firstName, data.middleName, data.lastName].filter(Boolean).join(' ');
  const genderMap = { '1': 'Laki-laki', '0': 'Perempuan' };
  const marriedStatusMap = { '0': 'Belum Menikah', '1': 'Menikah' };
  const relationshipMap = {
    '0': 'Ayah',
    '1': 'Ibu',
    '2': 'Anak Perempuan',
    '3': 'Anak',
    '4': 'Saudara Laki-laki',
    '5': 'Saudara Perempuan',
    '6': 'Lajang',
    '7': 'Wog',
    '8': 'Suami',
    '9': 'Istri',
  };

  const birthDate = data.birthDate
    ? new Date(data.birthDate).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : '-';

  return (
    <>
      <Row gutter={16}>
        {/* <Descriptions title="Informasi Umum" bordered column={1}>
        <Descriptions.Item label="Umroh Code">{data.umrohCode || '-'}</Descriptions.Item>
        <Descriptions.Item label="Register ID">{data.registerId || '-'}</Descriptions.Item>
        <Descriptions.Item label="Remarks">{data.remarks || '-'}</Descriptions.Item>

      </Descriptions>

      <Divider /> */}
        <Col lg={12}>
          <Descriptions title="Informasi Jamaah" bordered column={1}>
            <Descriptions.Item label="Nomor KTP">{data.identityNumber || '-'}</Descriptions.Item>
            <Descriptions.Item label="Nama Lengkap">{fullName}</Descriptions.Item>
            <Descriptions.Item label="Jenis Kelamin">{genderMap[data.gender] || '-'}</Descriptions.Item>
            <Descriptions.Item label="Status Pernikahan">{marriedStatusMap[data.marriedStatus] || '-'}</Descriptions.Item>
            <Descriptions.Item label="Tempat, Tanggal Lahir">
              {`${data.birthPlace || '-'}, ${birthDate}`}
            </Descriptions.Item>
            <Descriptions.Item label="No. Telepon">{data.phoneNumber || '-'}</Descriptions.Item>
            <Descriptions.Item label="Alamat">{data.address || '-'}</Descriptions.Item>
            <Descriptions.Item label="Provinsi">{String(data.province || '-')}</Descriptions.Item>
            <Descriptions.Item label="Kabupaten/Kota">{String(data.district || '-')}</Descriptions.Item>
            <Descriptions.Item label="Kecamatan">{String(data.subDistrict || '-')}</Descriptions.Item>
            <Descriptions.Item label="Kelurahan">{String(data.neighborhoods || '-')}</Descriptions.Item>
          </Descriptions>
        </Col>

        <Col lg={12}>
          <Descriptions title="Informasi Pendaftar" bordered column={1}>
            <Descriptions.Item label="Nama Pendaftar">{data.registerName || '-'}</Descriptions.Item>
            <Descriptions.Item label="Telepon Pendaftar">{data.registerPhone || '-'}</Descriptions.Item>
            <Descriptions.Item label="ID Agen">{data.agentId || '-'}</Descriptions.Item>
            <Descriptions.Item label="ID Staff">{data.staffId || '-'}</Descriptions.Item>
          </Descriptions>
        </Col>


        {/* <Divider /> */}



        {/* <Divider /> */}

        {/* <Descriptions title="Informasi Identitas (KTP)" bordered column={1}>

        <Descriptions.Item label="Foto KTP">
          {data.photoIdentity ? (
            <img src={data.photoIdentity} alt="Foto KTP" width={120} />
          ) : (
            '-'
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Foto Diri">
          {data.selfPhoto ? (
            <img src={data.selfPhoto} alt="Foto Diri" width={120} />
          ) : (
            '-'
          )}
        </Descriptions.Item>
      </Descriptions>

      <Divider /> */}



        {/* <Divider /> */}


      </Row>

      <Divider />

      <Row gutter={16}>
        <Col lg={12}>
          <Descriptions title="Informasi Paket & Biaya" bordered column={1}>
            <Descriptions.Item label="Paket Umroh">{data.packageId || '-'}</Descriptions.Item>
            <Descriptions.Item label="Harga Kamar">{data.packageRoomPrice ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Diskon Kantor">{data.officeDiscount ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Diskon Agen">{data.agentDiscount ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="Biaya Lain-lain">{data.otherExpenses ?? '-'}</Descriptions.Item>
          </Descriptions>
        </Col>
        <Col lg={12}>
          <Descriptions title="Informasi Lainnya" bordered column={1}>
            <Descriptions.Item label="Remarks">{relationshipMap[data.remarks] || '-'}</Descriptions.Item>
            <Descriptions.Item label="Mahram">{data.mahram || '-'}</Descriptions.Item>
            <Descriptions.Item label="Kondisi Kesehatan">{data.medicalCondition || '-'}</Descriptions.Item>
            <Descriptions.Item label="Notes">{data.notes || '-'}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <Divider />
    </>

  );
};

export default DetailUmrohPage;
