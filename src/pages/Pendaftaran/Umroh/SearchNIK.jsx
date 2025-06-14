import { Button, Flex, Input, theme, Typography } from 'antd'
import React, { useState } from 'react'

const SearchNIK = ({ onSearchNIK }) => {
  const { token } = theme.useToken()
  const [searchNIK, setSearchNIK] = useState('')

  const handleSearch = () => {
    onSearchNIK(searchNIK)
  }

  return (
    <>
      <Flex style={{ width: '100%' }} gap={8}>
        {/* <Input.Search
          style={{ flex: 1 }}
          placeholder='Masukan Nomor KTP'
          value={searchNIK}
          onChange={(e) => setSearchNIK(e.target.value)}
        />
        <Button
          type='primary'
          icon={<FaSearch />}
          onClick={handleSearch}
        >
          Cari
        </Button>
      </Flex> */}
        <Input.Search
          onChange={(e) => setSearchNIK(e.target.value)}
          placeholder='Masukan Nomor KTP'
          onSearch={handleSearch}
          enterButton
        />
      </Flex>
      
    </>
  )
}

export default SearchNIK