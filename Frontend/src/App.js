import React, { useState, useEffect } from "react";
import { Table, Input, Layout } from "antd";

import axios from "axios";

const App = () => {
  const [dataSource, setDataSource] = useState([]);
  const [searchText, setSearchText] = useState("");
  const { Header, Content, Footer } = Layout;

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
      onFilter: (value, record) =>
        record.productCategory.toLowerCase().includes(value.toLowerCase()),
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
    <Layout className="layout">
      <Header
        style={{
          background: "#ffffff",
          boxShadow: " 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",        
          

        }}
      >
       <div className="logo" style={{display: "flex",
          alignItems: "center",
          justifyContent: "space-between",}}>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNV1Tr-PvO8PH5uh-fjsry0KgGBwUXSgORaw&s" // Replace with your logo path
            alt="Logo"
            style={{ height: "60px" }} // Adjust the height as needed
          />
        </div>
      </Header>
      <Content
        className="site-layout"
        style={{
          padding: "50px 200px",
        }}
      >
        <Input.Search
          placeholder="Search"
          style={{ marginBottom: 8 }}
          onSearch={setSearchText}
        />
        <Table dataSource={dataSource} columns={columns} />
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        Design ©2024
      </Footer>
    </Layout>
  );
};

export default App;
