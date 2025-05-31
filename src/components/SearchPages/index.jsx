import React, { useState } from 'react';
import { AutoComplete, Input } from 'antd';
const getRandomInt = (max, min = 0) => Math.floor(Math.random() * (max - min + 1)) + min;
const searchResult = query =>
  Array.from({ length: getRandomInt(5) })
    .join('.')
    .split('.')
    .map((_, idx) => {
      const category = `${query}${idx}`;
      return {
        value: category,
        label: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>
              Found {query} on{' '}
              <a
                href={`https://s.taobao.com/search?q=${query}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {category}
              </a>
            </span>
            <span>{getRandomInt(200, 100)} results</span>
          </div>
        ),
      };
    });

const SearchPages = () => {
  const [options, setOptions] = useState([]);
  const handleSearch = value => {
    setOptions(value ? searchResult(value) : []);
  };
  const onSelect = value => {
    console.log('onSelect', value);
  };
  return (
    <AutoComplete
      popupMatchSelectWidth={252}
      style={{ width: 300 }}
      options={options}
      onSelect={onSelect}
      onSearch={handleSearch}
    >
      <Input.Search color='#d89000' placeholder="Search Menu" enterButton />
    </AutoComplete>
  );
};

export default SearchPages;