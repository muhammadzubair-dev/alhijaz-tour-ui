import { Card, Flex, Space, theme, Typography } from 'antd';
import { FaPlane, FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa6";
import styles from './index.module.css';

const FlightItem = ({ isArrival = false, data }) => {
  const { token } = theme.useToken()
  return (
    <Card
      // hoverable
      type='inner'
      className={styles.card}
      style={{
        borderRadius: 0,
        backgroundColor: token.colorWarningBg,
        border: `1px solid ${token.colorWarningBorder}`,
        mask: 'repeating-conic-gradient(from 25deg at 10px 50%,#0000,#000 1deg 129deg,#0000 130deg 180deg) -10px 50%/100% 42.89px'
      }}
      styles={{
        body: {
          padding: 0, // Mengatur padding body menjadi 0
        },
      }}
    >
      <Flex gap={24}>
        <div style={{ padding: '8px 40px' }}>
          <Space>
            {isArrival ? <FaPlaneArrival /> : <FaPlaneDeparture />}
            <Typography.Text type='secondary' style={{ fontSize: 12, fontWeight: 600 }}>{isArrival ? 'Return' : 'Departure'}</Typography.Text>
          </Space>
          <Typography.Title level={5} style={{ margin: 0, fontWeight: 800 }}>{data?.ticketAirline}</Typography.Title>
          <Typography.Text type='secondary' style={{ fontSize: 10 }}>Flight No. </Typography.Text>
          <Typography.Text style={{ fontSize: 14 }}>{data?.flightNo}</Typography.Text>
        </div>
        <Flex justify='space-evenly' align='center' flex={1} style={{ padding: 8 }}>
          <Typography.Paragraph>{data?.ticketDate}</Typography.Paragraph>
          <Flex justify='center' align='center' gap={30}>
            <div style={{ flex: 1 }}>
              <Typography.Text>{data?.ticketFrom}</Typography.Text>
              <Typography.Title level={5} style={{ margin: 0 }}>{data?.ticketEtd}</Typography.Title>
              <Typography.Text type='secondary' style={{ fontSize: 10 }}>Cengkareng Jakarta</Typography.Text>
            </div>
            <FaPlane color={token.colorPrimary} />
            <div style={{ flex: 1 }}>
              <Typography.Text>{data?.ticketTo}</Typography.Text>
              <Typography.Title level={5} style={{ margin: 0 }}>{data?.ticketEta}</Typography.Title>
              <Typography.Text type='secondary' style={{ fontSize: 10 }}>Cengkareng Jakarta</Typography.Text>
            </div>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  )
}

export default FlightItem