import { Label, ResultSuccess } from '@/components';
import { apiFetchJamaah, apiFetchLovTickets } from '@/services/lovService';
import { apiCreatePackage } from '@/services/masterService';
import checkFormatImage from '@/utils/checkFormatImage';
import getBase64 from '@/utils/getbase64';
import { PlusOutlined } from '@ant-design/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  Button,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Space,
  TimePicker,
  Typography,
  Upload
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import moment from 'moment';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import HotelRooms from './components/HotelRooms';
import styles from '../../index.module.css';
import queryClient from '@/lib/queryClient';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import numberId from '@/utils/numberId';
import FlightItem from '../TicketPage/components/FlightItem';
import JenisPaket from './components/JenisPaket';

const defaultValue = {
  name: null,
  ticket: null,
  seat: null,
  maturityPassportDelivery: null,
  maturityRepayment: null,
  manasikDatetime: null,
  manasikPrice: null,
  adminPrice: null,
  pcrPrice: null,
  equipmentHandlingPrice: null,
  checkInMadinah: null,
  checkInMekkah: null,
  checkOutMadinah: null,
  checkOutMekkah: null,
  isPromo: null,
  waGroup: null,
  notes: null,
  tourLead: null,
  gatheringTime: null,
  airportRallyPoint: null,
  status: '1',
  itinerary: [],
  brochure: [],
  manasikInvitation: [],
  departureInfo: []
}

const NewPackagePage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch
  } = useForm({
    mode: 'onChange',
    defaultValues: defaultValue,
  });
  const { data: dataLovJamaah } = useQuery({
    queryKey: ['lov-jamaah'],
    queryFn: apiFetchJamaah,
  });
  const { data: dataLovTickets } = useQuery({
    queryKey: ['lov-tickets'],
    queryFn: apiFetchLovTickets,
  });
  const navigate = useNavigate()


  const optionJamaah = dataLovJamaah?.data || [];
  const optionTickets = dataLovTickets?.data || [];

  const ticket = watch('ticket')
  const selectedTicket = optionTickets.find(item => item.id === ticket)

  const [hotelRooms, setHotelRooms] = useState([])
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [openResult, setOpenResult] = useState({
    open: false,
    title: '',
    subtitle: ''
  })
  const [previewPdf, setPreviewPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const createPackageMutation = useMutation({
    mutationFn: apiCreatePackage,
    onSuccess: (data, variable) => {
      reset();
      setHotelRooms([])
      queryClient.invalidateQueries(['packages']);
      setOpenResult({
        open: true,
        title: 'Package Berhasil Ditambahkan',
        subtitle: `Package baru dengan nama "${variable.name}" telah berhasil ditambahkan ke sistem.`,
      });
    },
  });

  const handleOpenResult = (values) => {
    setOpenResult((prevState) => ({
      ...prevState,
      ...values
    }))
  }

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

  const renderUploadField = (name, label) => (
    <Form.Item
      style={{ margin: 0, width: 150 }}
      required
      label={label}
      validateStatus={errors[name] ? 'error' : ''}
      help={errors[name]?.message || ''}
    >
      <Controller
        name={name}
        control={control}
        rules={{
          validate: (files) =>
            files && files.length > 0 ? true : 'Wajib di upload!',
        }}
        render={({ field }) => (
          <Upload
            listType="picture-card"
            className={styles.uploadWrapper}
            fileList={field.value}
            onPreview={handlePreview}
            onChange={({ fileList }) => setValue(name, fileList)}
            style={{ width: '100%' }}
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
  );

  const handleUpdateHotelRooms = (values) => {
    setHotelRooms(prevState => ([
      ...prevState,
      values
    ]))
  }

  const handleDeleteHotelRoom = (id) => {
    setHotelRooms(prevState => (prevState.filter(item => item.packageTypeId !== id)))
  }

  const onSubmit = (data) => {
    const newData = {
      ...data,
      hotelRooms,
      checkInMadinah: moment(data.checkInMadinah.toDate()).format('YYYY-MM-DD'),
      checkInMekkah: moment(data.checkInMekkah.toDate()).format('YYYY-MM-DD'),
      checkOutMadinah: moment(data.checkOutMadinah.toDate()).format('YYYY-MM-DD'),
      checkOutMekkah: moment(data.checkOutMekkah.toDate()).format('YYYY-MM-DD'),
      gatheringTime: moment(data.gatheringTime.toDate()).format('YYYY-MM-DD HH:mm:ss'),
      manasikDatetime: moment(data.manasikDatetime.toDate()).format('YYYY-MM-DD HH:mm:ss'),
      maturityPassportDelivery: moment(data.maturityPassportDelivery.toDate()).format('YYYY-MM-DD'),
      maturityRepayment: moment(data.maturityRepayment.toDate()).format('YYYY-MM-DD'),
    }
    createPackageMutation.mutate(newData)
  };

  return (
    <>
      <Form
        layout="vertical"
        onFinish={handleSubmit(onSubmit)}
      >
        <Row gutter={16} style={{ maxWidth: 1240 }}>

          <Col lg={8}>
            <Form.Item
              required
              label="Nama Paket"
              validateStatus={errors.name ? 'error' : ''}
              help={errors.name?.message}
            >
              <Controller
                name="name"
                control={control}
                rules={{
                  required: 'Nama Paket tidak boleh kosong',
                  minLength: {
                    value: 3,
                    message: 'Nama Paket minimal 3 karakter'
                  },
                  maxLength: {
                    value: 20,
                    message: 'Nama Paket maksimal 20 karakter'
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    allowClear
                    placeholder="Masukkan Nama Paket"
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col lg={8}>
            <Form.Item
              required
              label="Tiket & Tanggal Berangkat"
              validateStatus={errors.ticket ? 'error' : ''}
              help={errors.ticket?.message}
            >
              <Controller
                name="ticket"
                control={control}
                rules={{
                  required: 'Tiket tidak boleh kosong',
                }}
                render={({ field }) => (
                  <div style={{ width: '100%' }}>
                    <Select
                      {...field}
                      showSearch
                      allowClear
                      optionFilterProp='label'
                      placeholder="Pilih Tiket"
                      style={{ width: '100%' }}
                      options={optionTickets.map((item) => ({ value: item.id, label: `${item.bookingCode} - ${moment(item.departureDate).format('DD MMM YYYY')}` }))}
                    />
                  </div>
                )}
              />
            </Form.Item>
          </Col>

          <Col lg={24}>
            <Flex vertical gap={8}>
              {(selectedTicket?.ticketDetails || []).length !== 0 && selectedTicket?.ticketDetails.map((item => (
                <FlightItem key={item.id} data={item} isArrival={item.type === 1} />
              )))}
            </Flex>
          </Col>

          <Divider />

          <Col lg={24}>

            {/* Format file: JPG, JPEG, PNG. Maks. ukuran: 1MB */}
            <Flex gap={16} align='flex-end'>
              {renderUploadField('brochure', 'Brosur')}
              {renderUploadField('itinerary', 'Itinerary')}
              {renderUploadField('manasikInvitation', 'Undangan Manasik')}
              {renderUploadField('departureInfo', 'Info Keberangkatan')}
            </Flex>
            <Typography.Paragraph type='secondary' style={{ fontWeight: 400, fontSize: 12, marginBottom: 24 }}>Format file: JPG, JPEG, PNG. Maks. ukuran: 1MB</Typography.Paragraph>
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
          </Col>

          <Divider />

          <Col md={8}>
            <Form.Item
              required
              label={<Label text="Jumlah Seat" extraText={`Total: ${numberId(selectedTicket?.seatPack)}, Sisa: ${numberId(selectedTicket?.remainingSeat)}`} />}
              validateStatus={errors.seat ? 'error' : ''}
              help={errors.seat?.message}
            >
              <Controller
                name="seat"
                control={control}
                rules={{
                  required: 'Jumlah Seat tidak boleh kosong',
                  min: {
                    value: 1,
                    message: 'Minimal 1 Seat'
                  },
                  max: {
                    value: selectedTicket?.remainingSeat || 1,
                    message: `Maksimal ${numberId(selectedTicket?.remainingSeat || '')} Seat`
                  },
                }}
                render={({ field }) => (
                  <div style={{ width: '100%' }}>
                    <InputNumber
                      {...field}
                      suffix="Pax"
                      placeholder="Masukkan Jumlah Seat"
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
              required
              label={<Label text="Penyerahan Paspor" extraText="Jatuh Tempo" />}
              validateStatus={errors.maturityPassportDelivery ? 'error' : ''}
              help={errors.maturityPassportDelivery?.message}
            >
              <Controller
                name="maturityPassportDelivery"
                control={control}
                rules={{
                  required: 'Jatuh Tempo Penyerahan Passpor wajib diisi',
                }}
                render={({ field }) => (
                  <DatePicker
                    minDate={dayjs()}
                    {...field}
                    onChange={(date) => field.onChange(date)}
                    style={{ width: '100%' }}
                    placeholder="Pilih tanggal"
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col md={8}>
            <Form.Item
              required
              label={<Label text="Pelunasan" extraText="Jatuh Tempo" />}
              validateStatus={errors.maturityRepayment ? 'error' : ''}
              help={errors.maturityRepayment?.message}
            >
              <Controller
                name="maturityRepayment"
                control={control}
                rules={{
                  required: 'Jatuh Tempo Pelunasan wajib diisi',
                }}
                render={({ field }) => (
                  <DatePicker
                    minDate={dayjs()}
                    {...field}
                    onChange={(date) => field.onChange(date)}
                    style={{ width: '100%' }}
                    placeholder="Pilih tanggal"
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col md={8}>
            <Form.Item
              required
              label={<Label text="Manasik" extraText="Tanggal dan Jam" />}
              validateStatus={errors.manasikDatetime ? 'error' : ''}
              help={errors.manasikDatetime?.message}
            >
              <Controller
                name="manasikDatetime"
                control={control}
                rules={{
                  required: 'Waktu Manasik wajib diisi',
                }}
                render={({ field }) => (
                  <DatePicker
                    minDate={dayjs()}
                    {...field}
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    onChange={(date) => field.onChange(date)}
                    style={{ width: '100%' }}
                    placeholder="Pilih Tanggal dan Jam"
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col md={8}>
            <Form.Item
              required
              label={<Label text="Manasik" extraText="Harga" />}
              validateStatus={errors.manasikPrice ? 'error' : ''}
              help={errors.manasikPrice?.message}
            >
              <Controller
                name="manasikPrice"
                control={control}
                rules={{
                  required: 'Harga Manasik tidak boleh kosong',
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

          <Col md={8}>
            <Form.Item
              required
              label={<Label text="Perlengkapan & Handling" extraText="Harga" />}
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

          <Col md={8}>
            <Form.Item
              required
              label={<Label text="PCR & Karantina" extraText="Harga" />}
              validateStatus={errors.pcrPrice ? 'error' : ''}
              help={errors.pcrPrice?.message}
            >
              <Controller
                name="pcrPrice"
                control={control}
                rules={{
                  required: 'Harga PCR & Karantina tidak boleh kosong',
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

          <Col md={8}>
            <Form.Item
              required
              label={<Label text="ADM." extraText="Harga" />}
              validateStatus={errors.adminPrice ? 'error' : ''}
              help={errors.adminPrice?.message}
            >
              <Controller
                name="adminPrice"
                control={control}
                rules={{
                  required: 'Harga Administrasi tidak boleh kosong',
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

          <Col lg={8}>
            <Form.Item
              label="Tour Leader"
              validateStatus={errors.tourLead ? 'error' : ''}
              help={errors.tourLead?.message}
            >
              <Controller
                name="tourLead"
                control={control}
                render={({ field }) => (
                  <div style={{ width: '100%' }}>
                    <Select
                      {...field}
                      showSearch
                      allowClear
                      optionFilterProp='label'
                      placeholder="Pilih Tour Leader"
                      style={{ width: '100%' }}
                      options={optionJamaah.map((item) => ({ value: item.jamaahCode, label: item.jamaahName }))}
                    />
                  </div>
                )}
              />
            </Form.Item>
          </Col>

          <Col md={8}>
            <Form.Item
              required
              label="Jam Kumpul"
              validateStatus={errors.gatheringTime ? 'error' : ''}
              help={errors.gatheringTime?.message}
            >
              <Controller
                name="gatheringTime"
                control={control}
                rules={{
                  required: 'Jam Kumpul wajib diisi',
                }}
                render={({ field }) => (
                  <TimePicker
                    {...field}
                    showTime={{ format: 'HH:mm' }}
                    format="HH:mm"
                    onChange={(date) => field.onChange(date)}
                    style={{ width: '100%' }}
                    placeholder="Pilih Jam Kumpul"
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col lg={8}>
            <Form.Item
              required
              label="Tempat Kumpul di Bandara"
              validateStatus={errors.airportRallyPoint ? 'error' : ''}
              help={errors.airportRallyPoint?.message}
            >
              <Controller
                name="airportRallyPoint"
                control={control}
                rules={{
                  required: 'Tempat Kumpul di Bandara wajib diisi',
                }}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    allowClear
                    placeholder="Masukkan Tempat Kumpul di Bandara"
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <HotelRooms
          hotelRooms={hotelRooms}
          onUpdateHotelRoom={handleUpdateHotelRooms}
          onDeleteHotelRoom={handleDeleteHotelRoom}
        />

        {/* <Divider />

        <JenisPaket />

        <Divider /> */}

        <Row gutter={16} style={{ maxWidth: 1240, marginTop: 24 }}>
          {/* Madinah */}
          <Col md={8}>
            <Form.Item required label={<Label text="Madinah" extraText="Tanggal" />} style={{ margin: 0 }}>
              <Space.Compact style={{ width: '100%' }}>
                <Form.Item
                  style={{ flex: 1 }}
                  validateStatus={errors.checkInMadinah ? 'error' : ''}
                  help={errors.checkInMadinah?.message}
                >
                  <Controller
                    name="checkInMadinah"
                    control={control}
                    rules={{ required: 'Tanggal Check-in Madinah wajib diisi' }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        minDate={dayjs()}
                        placeholder="Check In"
                        style={{ width: '100%' }}
                        onChange={(date) => field.onChange(date)}
                      />
                    )}
                  />
                </Form.Item>
                <Form.Item
                  style={{ flex: 1 }}
                  validateStatus={errors.checkOutMadinah ? 'error' : ''}
                  help={errors.checkOutMadinah?.message}
                >
                  <Controller
                    name="checkOutMadinah"
                    control={control}
                    rules={{ required: 'Tanggal Check-out Madinah wajib diisi' }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        minDate={dayjs()}
                        placeholder="Check Out"
                        style={{ width: '100%' }}
                        onChange={(date) => field.onChange(date)}
                      />
                    )}
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Col>

          {/* Mekkah */}
          <Col md={8}>
            <Form.Item required label={<Label text="Mekkah" extraText="Tanggal" />} style={{ margin: 0 }}>
              <Space.Compact style={{ width: '100%' }}>
                <Form.Item
                  style={{ flex: 1 }}
                  validateStatus={errors.checkInMekkah ? 'error' : ''}
                  help={errors.checkInMekkah?.message}
                >
                  <Controller
                    name="checkInMekkah"
                    control={control}
                    rules={{ required: 'Tanggal Check-in Mekkah wajib diisi' }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        minDate={dayjs()}
                        placeholder="Check In"
                        style={{ width: '100%' }}
                        onChange={(date) => field.onChange(date)}
                      />
                    )}
                  />
                </Form.Item>
                <Form.Item
                  style={{ flex: 1 }}
                  validateStatus={errors.checkOutMekkah ? 'error' : ''}
                  help={errors.checkOutMekkah?.message}
                >
                  <Controller
                    name="checkOutMekkah"
                    control={control}
                    rules={{ required: 'Tanggal Check-out Mekkah wajib diisi' }}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        minDate={dayjs()}
                        placeholder="Check Out"
                        style={{ width: '100%' }}
                        onChange={(date) => field.onChange(date)}
                      />
                    )}
                  />
                </Form.Item>
              </Space.Compact>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} style={{ maxWidth: 1240, marginTop: 16 }}>
          <Col lg={8}>
            <Form.Item
              required
              label="Link WA Group"
              validateStatus={errors.waGroup ? 'error' : ''}
              help={errors.waGroup?.message}
            >
              <Controller
                name="waGroup"
                control={control}
                rules={{
                  required: 'Link WA tidak boleh kosong',
                  minLength: {
                    value: 3,
                    message: 'Link WA minimal 3 karakter'
                  },
                  maxLength: {
                    value: 10,
                    message: 'Link WA maksimal 10 karakter'
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    allowClear
                    placeholder="Masukkan Link WA"
                  />
                )}
              />
            </Form.Item>
          </Col>
          <Col lg={8}>
            <Form.Item
              required
              label="Status"
              validateStatus={errors.status ? 'error' : ''}
              help={errors.status?.message}
            >
              <Controller
                name="status"
                control={control}
                rules={{
                  required: 'Status tidak boleh kosong',
                }}
                render={({ field }) => (
                  <div style={{ width: '100%' }}>
                    <Select
                      {...field}
                      allowClear
                      placeholder="Pilih Status"
                      style={{ width: '100%' }}
                      options={[
                        {
                          value: '1',
                          label: 'Aktif',
                        },
                        {
                          value: '0',
                          label: 'Tidak Aktif',
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
              label="Promo"
              validateStatus={errors.isPromo ? 'error' : ''}
              help={errors.isPromo?.message}
            >
              <Controller
                name="isPromo"
                control={control}
                rules={{
                  required: 'Promo tidak boleh kosong',
                }}
                render={({ field }) => (
                  <div style={{ width: '100%' }}>
                    <Select
                      {...field}
                      allowClear
                      placeholder="Apakah Promo ?"
                      style={{ width: '100%' }}
                      options={[
                        {
                          value: 'true',
                          label: 'Ya',
                        },
                        {
                          value: 'false',
                          label: 'Tidak',
                        },
                      ]}
                    />
                  </div>
                )}
              />
            </Form.Item>
          </Col>
          <Col lg={16}>
            <Form.Item
              label="Keterangan Lain"
              validateStatus={errors.notes ? 'error' : ''}
              help={errors.notes?.message}
            >
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    allowClear
                    placeholder="Masukkan Notes Jika ada"
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Flex justify='flex-end' style={{ marginTop: 16 }} gap={16}>
          <Button onClick={() => navigate(-1)}>
            Kembali
          </Button>
          <Button type="primary" htmlType="submit">
            Simpan
          </Button>
        </Flex>
      </Form>
      <ResultSuccess
        open={openResult}
        onOpenResult={handleOpenResult}
        extra={
          <Button type="primary" key="console" onClick={() => navigate('/data-master/package')}>
            List Package
          </Button>
        }
      />
    </>
  );
};

export default NewPackagePage;
