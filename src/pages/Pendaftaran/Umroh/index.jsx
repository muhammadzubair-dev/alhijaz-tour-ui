/* eslint-disable react-hooks/exhaustive-deps */
import { Label } from '@/components';
import { apiFetchJamaahByIdentity, apiFetchLovAgents, apiFetchLovDistricts, apiFetchLovNeighborhoods, apiFetchLovProvinces, apiFetchLovSubDistricts, apiFetchUmrohPackage, apiFetchUmrohPackageRooms } from '@/services/lovService';
import useAuthStore from '@/store/authStore';
import checkFormatImage from '@/utils/checkFormatImage';
import getBase64 from '@/utils/getbase64';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  Typography,
  Upload
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const defaultValue = {
  firstName: null,
  middleName: null,
  lastName: null,
  identityNumber: null,
  birthPlace: null,
  birthDate: null,
  gender: null,
  phoneNumber: null,
  marriedStatus: null,
  province: null,
  district: null,
  subDistrict: null,
  neighborhoods: null,
  address: null,
  packageId: null,
  packageRoomPrice: null,
  officeDiscount: null,
  agentDiscount: null,
  agentId: null,
  staffId: null,
  photoIdentity: []
}

const UmrohPage = () => {
  const user = useAuthStore((state) => state.user);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    mode: 'onChange',
    defaultValues: defaultValue,
  });

  const [priceState, setPriceState] = useState(0)
  const [otherPriceState, setOtherPriceState] = useState(0)

  const identityNumber = watch('identityNumber');
  const province = watch('province');
  const district = watch('district');
  const subDistrict = watch('subDistrict');
  const packageId = watch('packageId');
  const packageRoomPrice = watch('packageRoomPrice');

  const isFromJamaah = useRef({
    province: false,
    district: false,
    subDistrict: false,
    neighborhoods: false,
  });

  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPdf, setPreviewPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const { data: resJamaah, refetch: refetchJamaah } = useQuery({
    queryKey: ['lov-jamaah', identityNumber],
    queryFn: () => apiFetchJamaahByIdentity(identityNumber),
    enabled: false,
  });

  const { data: resProvinces } = useQuery({
    queryKey: ['lov-provinces'],
    queryFn: apiFetchLovProvinces,
  });

  const { data: resDistricts, refetch: refetchDistricts } = useQuery({
    queryKey: ['lov-districts', province],
    queryFn: () => apiFetchLovDistricts(province),
    enabled: false,
  });

  const { data: resSubDistricts, refetch: refetchSubDistricts } = useQuery({
    queryKey: ['lov-subdistricts', province, district],
    queryFn: () => apiFetchLovSubDistricts(province, district),
    enabled: false,
  });

  const { data: resNeighborhoods, refetch: refetchNeighborhoods } = useQuery({
    queryKey: ['lov-neighborhoods', province, district, subDistrict],
    queryFn: () =>
      apiFetchLovNeighborhoods(province, district, subDistrict),
    enabled: false,
  });

  const { data: resUmrohPackage } = useQuery({
    queryKey: ['lov-umroh-package'],
    queryFn: apiFetchUmrohPackage,
  });

  const { data: resUmrohPackageRooms, refetch: refetchPackageRooms } = useQuery({
    queryKey: ['lov-umroh-package-rooms', packageId],
    queryFn: () => apiFetchUmrohPackageRooms(packageId),
    enabled: false
  });

  const { data: resAgents } = useQuery({
    queryKey: ['lov-agents'],
    queryFn: apiFetchLovAgents,
  });

  const dataJamaah = resJamaah?.data;
  const dataProvinces = resProvinces?.data || [];
  const dataDistricts = resDistricts?.data || [];
  const dataSubDistricts = resSubDistricts?.data || [];
  const dataNeighborhoods = resNeighborhoods?.data || [];
  const dataUmrohPackage = resUmrohPackage?.data || [];
  const dataUmrohPackageRooms = resUmrohPackageRooms?.data || [];
  const dataAgents = resAgents?.data || [];

  const handlePreview = async (file) => {
    const isPDF = file.url?.endsWith('.pdf') || file.name?.endsWith('.pdf');
    if (isPDF) {
      setPdfUrl(file.url);
      setPreviewPdf(true);
      return;
    }

    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // Load & autofill
  useEffect(() => {
    if (dataJamaah) {
      setValue('firstName', dataJamaah.firstName);
      setValue('middleName', dataJamaah.midName);
      setValue('lastName', dataJamaah.lastName);
      setValue('gender', dataJamaah.gender.toString());
      setValue('marriedStatus', dataJamaah.marriedStatus.toString());
      setValue('birthPlace', dataJamaah.birthPlace);
      setValue('birthDate', dayjs(dataJamaah.birthDate));
      setValue('phoneNumber', dataJamaah.phoneNumber);
      setValue('address', dataJamaah.address);

      isFromJamaah.current = {
        province: true,
        district: true,
        subDistrict: true,
        neighborhoods: true,
      };

      setValue('province', dataJamaah.province);
    }
  }, [dataJamaah, setValue]);

  // Refetch by level
  useEffect(() => {
    if (packageId) refetchPackageRooms();
  }, [packageId]);

  useEffect(() => {
    if (packageRoomPrice) {
      const selectedPrice = dataUmrohPackageRooms.find(item => item.id === packageRoomPrice)
      setPriceState(selectedPrice?.price || 0)
      setOtherPriceState(selectedPrice?.equipmentHandlingPrice || 0)
    };
  }, [packageRoomPrice]);


  useEffect(() => {
    if (province) refetchDistricts();
  }, [province]);

  useEffect(() => {
    if (province && district) refetchSubDistricts();
  }, [province, district]);

  useEffect(() => {
    if (province && district && subDistrict) refetchNeighborhoods();
  }, [province, district, subDistrict]);

  // Autofill lower levels
  useEffect(() => {
    if (resDistricts && isFromJamaah.current.district) {
      setValue('district', dataJamaah?.district);
      isFromJamaah.current.district = false;
    }
  }, [resDistricts]);

  useEffect(() => {
    if (resSubDistricts && isFromJamaah.current.subDistrict) {
      setValue('subDistrict', dataJamaah?.subDistrict);
      isFromJamaah.current.subDistrict = false;
    }
  }, [resSubDistricts]);

  useEffect(() => {
    if (resNeighborhoods && isFromJamaah.current.neighborhoods) {
      setValue('neighborhoods', dataJamaah?.neighborhoods);
      isFromJamaah.current.neighborhoods = false;
    }
  }, [resNeighborhoods]);



  return (
    <Form
      layout="vertical"
    // onFinish={handleSubmit(onSubmit)}
    >
      <Row gutter={16} style={{ maxWidth: 1240 }}>
        <Col lg={8}>
          <Form.Item
            required
            label="No. KTP"
            validateStatus={errors.identityNumber ? 'error' : ''}
            help={errors.identityNumber?.message}
          >
            <Controller
              name="identityNumber"
              control={control}
              rules={{
                required: 'Nomor identitas tidak boleh kosong',
                pattern: {
                  value: /^\d{16}$/,
                  message: 'Nomor identitas harus terdiri dari 16 digit angka',
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  allowClear
                  placeholder="Masukkan Nomor KTP"
                  onBlur={() => {
                    if (field.value) {
                      refetchJamaah()
                    }
                  }}
                />
              )}
            />
          </Form.Item>
        </Col>

      </Row>

      <Divider />

      <Row gutter={16} style={{ maxWidth: 1240 }}>
        <Col lg={16}>
          <Form.Item required label="Nama Lengkap Jamaah" style={{ margin: 0 }}>
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item
                style={{ flex: 1 }}
                validateStatus={errors.firstName ? 'error' : ''}
                help={errors.firstName?.message}
              >
                <Controller
                  name="firstName"
                  control={control}
                  rules={{ required: 'FirstName wajib diisi' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="FirstName"
                      allowClear
                    />
                  )}
                />
              </Form.Item>
              <Form.Item
                style={{ flex: 1 }}
                validateStatus={errors.middleName ? 'error' : ''}
                help={errors.middleName?.message}
              >
                <Controller
                  name="middleName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="MiddleName"
                      allowClear
                    />
                  )}
                />
              </Form.Item>
              <Form.Item
                style={{ flex: 1 }}
                validateStatus={errors.lastName ? 'error' : ''}
                help={errors.lastName?.message}
              >
                <Controller
                  name="lastName"
                  control={control}
                  rules={{ required: 'LastName wajib diisi' }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="LastName"
                      allowClear
                    />
                  )}
                />
              </Form.Item>
            </Space.Compact>
          </Form.Item>
        </Col>

        <Col lg={8}>
          <Form.Item
            required
            label="Kelamin"
            validateStatus={errors.gender ? 'error' : ''}
            help={errors.gender?.message}
          >
            <Controller
              name="gender"
              control={control}
              rules={{
                required: 'Kelamin tidak boleh kosong',
              }}
              render={({ field }) => (
                <div style={{ width: '100%' }}>
                  <Select
                    {...field}
                    allowClear
                    placeholder="Pilih Jenis Kelamin"
                    style={{ width: '100%' }}
                    options={[
                      {
                        value: '1',
                        label: 'Laki-Laki',
                      },
                      {
                        value: '0',
                        label: 'Perempuan',
                      },
                    ]}
                  />
                </div>
              )}
            />
          </Form.Item>
        </Col>

        <Col lg={8}>
          <Form.Item
            required
            label="Tempat Lahir"
            validateStatus={errors.birthPlace ? 'error' : ''}
            help={errors.birthPlace?.message}
          >
            <Controller
              name="birthPlace"
              control={control}
              rules={{
                required: 'Tempat Lahir tidak boleh kosong',
                minLength: {
                  value: 4,
                  message: 'Tempat Lahir minimal 3 karakter'
                },
                maxLength: {
                  value: 10,
                  message: 'Tempat Lahir maksimal 10 karakter'
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  allowClear
                  placeholder="Masukkan tempat Lahir"
                />
              )}
            />
          </Form.Item>
        </Col>

        <Col md={8}>
          <Form.Item
            required
            label="Tanggal Lahir"
            validateStatus={errors.birthDate ? 'error' : ''}
            help={errors.birthDate?.message}
          >
            <Controller
              name="birthDate"
              control={control}
              rules={{
                required: 'Tanggal Lahir wajib diisi',
              }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  onChange={(date) => field.onChange(date)}
                  style={{ width: '100%' }}
                  placeholder="Pilih Tanggal Lahir"
                />
              )}
            />
          </Form.Item>
        </Col>

        <Col lg={8}>
          <Form.Item
            required
            label="No. Tlp/Hp Jamaah"
            validateStatus={errors.phoneNumber ? 'error' : ''}
            help={errors.phoneNumber?.message}
          >
            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                required: 'No. Tlp/Hp tidak boleh kosong',
                minLength: {
                  value: 10,
                  message: 'No. Tlp/Hp minimal 10 karakter'
                },
                maxLength: {
                  value: 13,
                  message: 'No. Tlp/Hp maksimal 13 karakter'
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'No. Tlp/Hp hanya boleh berisi angka'
                }
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  allowClear
                  placeholder="Masukkan No. Tlp/Hp"
                />
              )}
            />
          </Form.Item>
        </Col>

        <Col lg={8}>
          <Form.Item
            required
            label="Status Nikah"
            validateStatus={errors.marriedStatus ? 'error' : ''}
            help={errors.marriedStatus?.message}
          >
            <Controller
              name="marriedStatus"
              control={control}
              rules={{
                required: 'Status Nikah tidak boleh kosong',
              }}
              render={({ field }) => (
                <div style={{ width: '100%' }}>
                  <Select
                    {...field}
                    showSearch
                    allowClear
                    optionFilterProp='label'
                    placeholder="Pilih Status Nikah"
                    style={{ width: '100%' }}
                    options={[
                      {
                        value: '0',
                        label: 'Menikah',
                      },
                      {
                        value: '1',
                        label: 'Belum Menikah',
                      },
                      {
                        value: '2',
                        label: 'Janda',
                      },
                      {
                        value: '3',
                        label: 'Duda',
                      },
                    ]}
                  />
                </div>
              )}
            />
          </Form.Item>
        </Col>

        <Col lg={8}>
          <Form.Item
            required
            label="Remarks"
            validateStatus={errors.remarks ? 'error' : ''}
            help={errors.remarks?.message}
          >
            <Controller
              name="remarks"
              control={control}
              rules={{
                required: 'Remarks tidak boleh kosong',
              }}
              render={({ field }) => (
                <div style={{ width: '100%' }}>
                  <Select
                    {...field}
                    showSearch
                    allowClear
                    optionFilterProp='label'
                    placeholder="Pilih Status Nikah"
                    style={{ width: '100%' }}
                    options={[
                      {
                        value: '0',
                        label: 'Ayah',
                      },
                      {
                        value: '1',
                        label: 'Ibu',
                      },
                      {
                        value: '2',
                        label: 'Anak Perempuan',
                      },
                      {
                        value: '3',
                        label: 'Anak',
                      },
                      {
                        value: '4',
                        label: 'Saudara Laki-laki',
                      },
                      {
                        value: '5',
                        label: 'Saudara Perempuan',
                      },
                      {
                        value: '6',
                        label: 'Lajang'
                      },
                      {
                        value: '7',
                        label: 'Wog'
                      },
                      {
                        value: '8',
                        label: 'Suami'
                      },
                      {
                        value: '9',
                        label: 'Istri'
                      }
                    ]}
                  />
                </div>
              )}
            />
          </Form.Item>
        </Col>

        <Col lg={8}>
          <Form.Item
            required
            label="Mahram"
            validateStatus={errors.mahram ? 'error' : ''}
            help={errors.mahram?.message}
          >
            <Controller
              name="mahram"
              control={control}
              rules={{
                required: 'Nama Mahram tidak boleh kosong',
                minLength: {
                  value: 4,
                  message: 'Nama Mahram minimal 10 karakter'
                },
                maxLength: {
                  value: 20,
                  message: 'Nama Mahram maksimal 13 karakter'
                },

              }}
              render={({ field }) => (
                <Input
                  {...field}
                  allowClear
                  placeholder="Masukkan Nama Mahram"
                />
              )}
            />
          </Form.Item>
        </Col>

        <Col lg={16}>
          <Form.Item
            required
            label={<Label text='Kondisi Jamaah' extraText="Butuh Kursi Roda? Cuci Darah?" />}
            validateStatus={errors.medicalCondition ? 'error' : ''}
            help={errors.medicalCondition?.message}
          >
            <Controller
              name="medicalCondition"
              control={control}
              rules={{
                required: 'Kondisi Medis Jamaah wajib diisi',
              }}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  allowClear
                  placeholder="Kondisi Medis Jamaah"
                />
              )}
            />
          </Form.Item>
        </Col>

        <Divider />

        <Col lg={16}>
          <Form.Item
            required
            label={<Label text='Alamat' extraText="Sesuai KTP" />}
            validateStatus={errors.address ? 'error' : ''}
            help={errors.address?.message}
          >
            <Controller
              name="address"
              control={control}
              rules={{
                required: 'Kondisi Medis Jamaah wajib diisi',
              }}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  allowClear
                  placeholder="Masukkan Alamat sesuai KTP Jaamaah"
                />
              )}
            />
          </Form.Item>
        </Col>

        <Col lg={8}>
          <Form.Item
            required
            label="Provinsi"
            validateStatus={errors.province ? 'error' : ''}
            help={errors.province?.message}
          >
            <Controller
              name="province"
              control={control}
              rules={{
                required: 'Provinsi tidak boleh kosong',
              }}
              render={({ field }) => (
                <div style={{ width: '100%' }}>
                  <Select
                    {...field}
                    showSearch
                    allowClear
                    optionFilterProp='label'
                    placeholder="Pilih Provinsi"
                    style={{ width: '100%' }}
                    onChange={(value) => {
                      isFromJamaah.current = {
                        province: false,
                        district: false,
                        subDistrict: false,
                        neighborhoods: false,
                      };
                      field.onChange(value);
                      setValue('district', null);
                      setValue('subDistrict', null);
                      setValue('neighborhoods', null);
                    }}
                    options={dataProvinces.map(item => ({
                      value: item.id,
                      label: item.name
                    }))}
                  />
                </div>
              )}
            />
          </Form.Item>
        </Col>

        <Col lg={8}>
          <Form.Item
            required
            label="Kab/Kota"
            validateStatus={errors.district ? 'error' : ''}
            help={errors.district?.message}
          >
            <Controller
              name="district"
              control={control}
              rules={{
                required: 'Kab/Kota tidak boleh kosong',
              }}
              render={({ field }) => (
                <div style={{ width: '100%' }}>
                  <Select
                    {...field}
                    showSearch
                    allowClear
                    optionFilterProp='label'
                    placeholder="Pilih Kab/Kota"
                    style={{ width: '100%' }}
                    onChange={(value) => {
                      isFromJamaah.current.subDistrict = false;
                      isFromJamaah.current.neighborhoods = false;
                      field.onChange(value);
                      setValue('subDistrict', null);
                      setValue('neighborhoods', null);
                    }}
                    options={dataDistricts.map(item => ({
                      value: item.id,
                      label: item.name
                    }))}
                  />
                </div>
              )}
            />
          </Form.Item>
        </Col>

        <Col lg={8}>
          <Form.Item
            required
            label="Kecamatan"
            validateStatus={errors.subDistrict ? 'error' : ''}
            help={errors.subDistrict?.message}
          >
            <Controller
              name="subDistrict"
              control={control}
              rules={{
                required: 'Kecamatan tidak boleh kosong',
              }}
              render={({ field }) => (
                <div style={{ width: '100%' }}>
                  <Select
                    {...field}
                    showSearch
                    allowClear
                    optionFilterProp='label'
                    placeholder="Pilih Kecamatan"
                    style={{ width: '100%' }}
                    onChange={(value) => {
                      isFromJamaah.current.neighborhoods = false;
                      field.onChange(value);
                      setValue('neighborhoods', null);
                    }}
                    options={
                      dataSubDistricts.map(item => ({
                        value: item.id,
                        label: item.name
                      }))
                    }
                  />
                </div>
              )}
            />
          </Form.Item>
        </Col>

        <Col lg={8}>
          <Form.Item
            required
            label="Desa/Kelurahan"
            validateStatus={errors.neighborhoods ? 'error' : ''}
            help={errors.neighborhoods?.message}
          >
            <Controller
              name="neighborhoods"
              control={control}
              rules={{
                required: 'Desa/Kelurahan tidak boleh kosong',
              }}
              render={({ field }) => (
                <div style={{ width: '100%' }}>
                  <Select
                    {...field}
                    showSearch
                    allowClear
                    optionFilterProp='label'
                    placeholder="Pilih Desa/Kelurahan"
                    style={{ width: '100%' }}
                    options={
                      dataNeighborhoods.map(item => ({
                        value: item.id,
                        label: item.name
                      }))
                    }
                  />
                </div>
              )}
            />
          </Form.Item>
        </Col>

        <Divider />

        <Col lg={8}>
          <Form.Item
            required
            label="Paket Umroh / Tanggal Berangkat"
            validateStatus={errors.packageId ? 'error' : ''}
            help={errors.packageId?.message}
          >
            <Controller
              name="packageId"
              control={control}
              rules={{
                required: 'Paket Umroh tidak boleh kosong',
              }}
              render={({ field }) => (
                <div style={{ width: '100%' }}>
                  <Select
                    {...field}
                    showSearch
                    allowClear
                    optionFilterProp='label'
                    placeholder="Pilih Paket Umroh"
                    style={{ width: '100%' }}
                    onChange={(value) => {
                      setPriceState(0)
                      setOtherPriceState(0)
                      field.onChange(value);
                      setValue('packageRoomPrice', null);
                    }}
                    options={dataUmrohPackage.map(item => ({
                      value: item.id,
                      label: item.name
                    }))}
                  />
                </div>
              )}
            />
          </Form.Item>
        </Col>

        <Col lg={8}>
          <Form.Item
            required
            label="Paket Hotel & Kamar"
            validateStatus={errors.packageRoomPrice ? 'error' : ''}
            help={errors.packageRoomPrice?.message}
          >
            <Controller
              name="packageRoomPrice"
              control={control}
              rules={{
                required: 'Paket Hotel & Kamar tidak boleh kosong',
              }}
              render={({ field }) => (
                <div style={{ width: '100%' }}>
                  <Select
                    {...field}
                    showSearch
                    allowClear
                    optionFilterProp='label'
                    placeholder="Pilih Paket Hotel & Kamar"
                    style={{ width: '100%' }}
                    options={dataUmrohPackageRooms.map(item => ({
                      value: item.id,
                      label: item.name
                    }))}
                  />
                </div>
              )}
            />
          </Form.Item>
        </Col>

        <Col md={8}>
          <Form.Item
            label='Harga Paket'
          >
            <div style={{ width: '100%' }}>
              <InputNumber
                disabled
                prefix="Rp"
                value={priceState}
                placeholder="Masukkan Harga"
                style={{ width: '100%' }}
                formatter={(value) =>
                  value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                }
                parser={(value) => value?.replace(/\./g, '')}
              />
            </div>

          </Form.Item>
        </Col>

        <Col md={8}>
          <Form.Item
            label={<Label text="Perlengkapan & Handling" extraText="Harga" />}
          >
            <div style={{ width: '100%' }}>
              <InputNumber
                disabled
                prefix="Rp"
                value={otherPriceState}
                placeholder="Masukkan Harga"
                style={{ width: '100%' }}
                formatter={(value) =>
                  value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                }
                parser={(value) => value?.replace(/\./g, '')}
              />
            </div>

          </Form.Item>
        </Col>

        <Col md={8}>
          <Form.Item
            required
            label={<Label text="Biaya Lainnya" extraText="Harga" />}
            validateStatus={errors.equipmentHandlingPrice ? 'error' : ''}
            help={errors.equipmentHandlingPrice?.message}
          >
            <Controller
              name="equipmentHandlingPrice"
              control={control}
              rules={{
                required: 'Harga Perlengkapan & Handling tidak boleh kosong',
              }}
              render={({ field }) => (
                <div style={{ width: '100%' }}>
                  <InputNumber
                    {...field}
                    prefix="Rp"
                    placeholder="Masukkan Harga"
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                    }
                    parser={(value) => value?.replace(/\./g, '')}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              )}
            />
          </Form.Item>
        </Col>

        <Divider />

        <Col md={8}>
          <Form.Item
            label={<Label text="Disc. Kantor" extraText="Harga" />}
            validateStatus={errors.officeDiscount ? 'error' : ''}
            help={errors.officeDiscount?.message}
          >
            <Controller
              name="officeDiscount"
              control={control}
              render={({ field }) => (
                <div style={{ width: '100%' }}>
                  <InputNumber
                    {...field}
                    prefix="Rp"
                    placeholder="Masukkan Diskon"
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                    }
                    parser={(value) => value?.replace(/\./g, '')}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              )}
            />
          </Form.Item>
        </Col>

        <Col md={8}>
          <Form.Item
            label={<Label text="Disc. Marketing" extraText="Harga" />}
            validateStatus={errors.agentDiscount ? 'error' : ''}
            help={errors.agentDiscount?.message}
          >
            <Controller
              name="agentDiscount"
              control={control}
              render={({ field }) => (
                <div style={{ width: '100%' }}>
                  <InputNumber
                    {...field}
                    prefix="Rp"
                    placeholder="Masukkan Diskon"
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
                    }
                    parser={(value) => value?.replace(/\./g, '')}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              )}
            />
          </Form.Item>
        </Col>

        <Divider />

        <Col lg={8}>
          <Form.Item
            required
            label="Marketing / Agent"
            validateStatus={errors.agentId ? 'error' : ''}
            help={errors.agentId?.message}
          >
            <Controller
              name="agentId"
              control={control}
              rules={{
                required: 'Kelamin tidak boleh kosong',
              }}
              render={({ field }) => (
                <div style={{ width: '100%' }}>
                  <Select
                    {...field}
                    allowClear
                    showSearch
                    optionFilterProp='label'
                    placeholder="Pilih Marketing / Agent"
                    style={{ width: '100%' }}
                    options={dataAgents.map(item => ({
                      value: item.id,
                      label: item.name
                    }))}
                  />
                </div>
              )}
            />
          </Form.Item>
        </Col>

        <Col lg={8}>
          <Form.Item
            required
            label="Nama Pendaftar"
            validateStatus={errors.registerName ? 'error' : ''}
            help={errors.registerName?.message}
          >
            <Controller
              name="registerName"
              control={control}
              rules={{
                required: 'Nama Pendaftar tidak boleh kosong',
                minLength: {
                  value: 4,
                  message: 'Nama Pendaftar minimal 10 karakter'
                },
                maxLength: {
                  value: 20,
                  message: 'Nama Pendaftar maksimal 13 karakter'
                },

              }}
              render={({ field }) => (
                <Input
                  {...field}
                  allowClear
                  placeholder="Masukkan Nama Pendaftar"
                />
              )}
            />
          </Form.Item>
        </Col>

        <Col lg={8}>
          <Form.Item
            required
            label="No. Tlp/Hp Pendaftar"
            validateStatus={errors.registerPhone ? 'error' : ''}
            help={errors.registerPhone?.message}
          >
            <Controller
              name="registerPhone"
              control={control}
              rules={{
                required: 'No. Tlp/Hp tidak boleh kosong',
                minLength: {
                  value: 10,
                  message: 'No. Tlp/Hp minimal 10 karakter'
                },
                maxLength: {
                  value: 13,
                  message: 'No. Tlp/Hp maksimal 13 karakter'
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'No. Tlp/Hp hanya boleh berisi angka'
                }
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  allowClear
                  placeholder="Masukkan No. Tlp/Hp"
                />
              )}
            />
          </Form.Item>
        </Col>

        <Col lg={16}>
          <Form.Item
            required
            label={<Label text='Keterangan' extraText="lain-lain" />}
            validateStatus={errors.notes ? 'error' : ''}
            help={errors.notes?.message}
          >
            <Controller
              name="notes"
              control={control}
              rules={{
                required: 'Kondisi Medis Jamaah wajib diisi',
              }}
              render={({ field }) => (
                <Input.TextArea
                  {...field}
                  allowClear
                  placeholder="Mengetahui Alhijaz dari mana/siapa? Butuh surat mahram?"
                />
              )}
            />
          </Form.Item>
        </Col>

        <Col lg={8}>
          <Form.Item
            required
            label="Staff Kantor"
            validateStatus={errors.staffId ? 'error' : ''}
            help={errors.staffId?.message}
          >
            <Controller
              disabled
              name="staffId"
              control={control}
              rules={{
                required: 'Staff kantor tidak boleh kosong',
                minLength: {
                  value: 4,
                  message: 'Staff kantor minimal 10 karakter'
                },
                maxLength: {
                  value: 20,
                  message: 'Staff kantor maksimal 13 karakter'
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  value={user.name}
                  allowClear
                  placeholder="Masukkan Staff kantor"
                />
              )}
            />
          </Form.Item>
        </Col>

        <Col lg={8}>
          <Form.Item
            style={{ margin: 0, width: 150 }}
            required
            label="KTP"
            validateStatus={errors.photoIdentity ? 'error' : ''}
            help={errors.photoIdentity?.message || ''}
          >
            <Controller
              name='photoIdentity'
              control={control}
              rules={{
                validate: (files) =>
                  files && files.length > 0 ? true : 'KTP Wajib di upload!',
              }}
              render={({ field }) => (
                <Upload
                  listType="picture-card"
                  fileList={field.value}
                  onPreview={handlePreview}
                  onChange={({ fileList }) => setValue('photoIdentity', fileList)}
                  // style={{ width: '100%' }}
                  beforeUpload={(file) =>
                    checkFormatImage(file) ? false : Upload.LIST_IGNORE
                  }
                >
                  {field.value.length >= 1 ? null : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              )}
            />
          </Form.Item>
          {previewImage && (
            <Image
              wrapperStyle={{ display: 'none' }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) =>
                  !visible && setPreviewImage(''),
              }}
              src={previewImage}
            />
          )}
          <Modal
            open={previewPdf}
            title="Preview PDF"
            footer={null}
            onCancel={() => setPreviewPdf(false)}
            width="80%"
            style={{ top: 20 }}
          >
            <iframe
              src={`${pdfUrl}#navpanes=0`}
              width="100%"
              height="700px"
              style={{ border: 'none' }}
              title="PDF Preview"
            />
          </Modal>
          <Typography.Paragraph type='secondary' style={{ fontWeight: 400, fontSize: 12, marginBottom: 24 }}>Format file: JPG, JPEG, PNG. Maks. ukuran: 1MB</Typography.Paragraph>
        </Col>


      </Row>
    </Form>
  )
}

export default UmrohPage