import { Col, Divider, Row, Select } from 'antd'
import React from 'react'

const JenisPaket = () => {
  return (
    <Row>
      <Col lg={8}>Jenis Paket</Col>
      <Col lg={8}>Hotel</Col>
      <Col lg={8}>kamar</Col>
      <>
        <Divider />
        <Col lg={8}>
          <Select placeholder='Pilih Paket' />
        </Col>
        <Col lg={8}>
          <Select placeholder='Pilih Paket' />
        </Col>
        <Col lg={8}>
          <Select placeholder='Pilih Paket' />
        </Col>
      </>
    </Row>
  )
}

export default JenisPaket