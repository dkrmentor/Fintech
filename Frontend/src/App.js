import React, { useState, useEffect } from "react";
import { Table, Input } from "antd";
import axios from "axios";

const App = () => {
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState('');

  const fetchNabData = async () => {
    try {
      const productsResponse = await axios.get(
        "https://openbank.api.nab.com.au/cds-au/v1/banking/products",
        {
          headers: {
            "x-v": "3",
          },
        }
      );
      return productsResponse.data.data.products; // Ensure correct path
    } catch (error) {
      console.error("Error fetching NAB data:", error);
      return [];
    }
  };

  const fetchCbaData = async () => {
    try {
      const productsResponse = await axios.get(
        "https://api.commbank.com.au/public/cds-au/v1/banking/products",
        {
          headers: {
            "x-v": "6",
            "x-min-v": "3",
            "x-fapi-interaction-id": "f688ae24-9719-4975-9f58-f6b7e655c37d",
          },
        }
      );
      return productsResponse.data.data.products; // Ensure correct path
    } catch (error) {
      console.error("Error fetching CBA data:", error);
      return [];
    }
  };

  const fetchBankData = async () => {
    const nabData = await fetchNabData();
    const cbaData = await fetchCbaData();
    const combinedData = [...nabData, ...cbaData];
    setDataSource(combinedData);
  };

  useEffect(() => {
    fetchBankData();
  }, []);

  const columns = [
    {
      title: "Product Category",
      dataIndex: "productCategory",
      key: "productCategory",
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => record.productCategory.toLowerCase().includes(value.toLowerCase())
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
  ];

  return (
    <>
      <Input.Search
        placeholder="Search"
        style={{ marginBottom: 8 }}
        onSearch={setSearchText}
      />
      <Table dataSource={dataSource} columns={columns} />
    </>
  );
};

export default App;
