// components/MapboxComponent.js
'use client'
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalCloseButton,
  ModalFooter,
} from "@chakra-ui/react";
import { Audiowide, Righteous } from 'next/font/google';
import { ethers } from 'ethers';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const audiowide = Audiowide({ subsets: ['latin'],weight:'400' });
const righteous = Righteous({ subsets: ['latin'],weight:'400' });

const MapboxComponent = () => {
  const { contract } = useContract("0xe443430d8f6FED66c6F2b5f3D49Ac755Ff478254");
  const { data, isLoading } = useContractRead(contract, "getAllListedLands", []);
  const { mutateAsync: buyLand, isLoading: isBuying } = useContractWrite(contract, "buyLand");
  const [selectedLand, setSelectedLand] = useState(null);
  console.log(data);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [price, setPrice] = useState(0);


  const [viewport, setViewport] = React.useState({
    width: '100%',
    height: '400px',
    latitude: 0, // Set your initial map center latitude
    longitude: 0, // Set your initial map center longitude
    zoom: 2, // Set the initial zoom level
  });

  const priceCategories = [0.001, 1, 10];

  
  const [filters, setFilters] = useState({
    maxPrice: Infinity,
    isForSale: null,
    sellerName: "",
  });

  const applyFilters = () => {
    if (!data) {
      return null; // or return an empty array or handle loading state
    }
  
    if (filters.maxPrice === Infinity && filters.sellerName === "") {
      // No filters applied, return all data
      return data;
    }
    const filteredData = data && data.filter((land) => {
      const meetsPriceCriteria = parseFloat(ethers.utils.formatEther(land.price)) === filters.maxPrice;
      console.log("price",ethers.utils.formatEther(land.price));
    //  const meetsOwnershipCriteria = filters.isForSale === null || land.isForSale === filters.isForSale;
      const meetsSellerNameCriteria = filters.sellerName === "" || land.sellerName.includes(filters.sellerName);

      return meetsPriceCriteria  && meetsSellerNameCriteria;
    });

    return filteredData;
  };

  const filteredData = applyFilters();
  console.log("filtered lands",filteredData);

  const resetPriceFilter = () => {
    setFilters({ ...filters, maxPrice: Infinity });
  };
  

  

  const BuyLand = async (tokenId, selectedLand) => {
    try {
      const data = await buyLand({
        args: [tokenId.toNumber()],
        overrides: {
          value:  selectedLand.price,
        },
      });
      console.info("contract call success", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };






  return (
    <>
    <Flex style={{ 
           border: "1px solid #474545",
           borderRadius: "10px",
           margin: "19px",
           background: "#212b36",
           }}   justifyContent="space-between" p="4">
              <Box>
                <Text sx={{color:'white'}}  className={righteous.className}>MAX PRICE :</Text>
                {priceCategories.map((category, index) => (
              <Button
              sx={{
                color: filters.maxPrice === category ? 'black' : '#81E6D9',
                border: '1px solid #81E6D9',
              }}
              className={righteous.className}
                key={index}
                onClick={() => setFilters({ ...filters, maxPrice: category })}
                size="sm"
                variant={filters.maxPrice === category ? "solid" : "outline"}
                colorScheme="teal"
                style={{ marginRight: '8px' }}
              >
                {category} ETH
              </Button>
            ))}

         <Button
         className={audiowide.className}
              onClick={resetPriceFilter}
              size="sm"
              colorScheme="teal"
            >
              RESET PRICE
            </Button>
              </Box>
             
              <Box>
                <Text sx={{color:'white'}} className={righteous.className}>SELLER NAME:</Text>
                <input
                style={{color:'white',borderRadius:'4px',background:'#777777714'}}
                  type="text"
                  value={filters.sellerName}
                  onChange={(e) => setFilters({ ...filters, sellerName: e.target.value })}
                />
              </Box>
              <Button onClick={applyFilters}>Apply Filters</Button>
            </Flex>

            

            <Flex style={{ 
           border: "1px solid #474545",
           borderRadius: "10px",
           margin: "19px",
           background: "#212b36",
           }}   justifyContent="space-between" p="4">  

            <Box style={{ width: '100%', height: '400px' }}>
    <Map
    style={{ 
      border: "1px solid #474545",
      borderRadius: "10px",
      }} 
    mapboxAccessToken='pk.eyJ1Ijoic291cmF2dyIsImEiOiJjbHM1dTJ0MGExZzgxMmtvZTA5MWs0ZXFnIn0.RkjKD84lnE10iZwNjOtx5w'
  mapLib={import('mapbox-gl')}
  initialViewState={{
    longitude: '0',
    latitude: '0',
    zoom: 3.5
  }}
  
  mapStyle="mapbox://styles/mapbox/streets-v9"
>
{filteredData?.map(land => {
  const {latitude, longitude} = land;
  return (
    <Marker 
    color="red"
      key={land.id}
      latitude={latitude}
      longitude={longitude}
      onClick={() => {
        setSelectedLand(land);
        openModal();  // Open modal when marker is clicked
      }}
    >
      
      </Marker>
  ) 
})}
  </Map>

  {selectedLand && (
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <ModalOverlay />
        <ModalContent>
          <ModalHeader   className={righteous.className} >LAND DETAILS</ModalHeader>
          <ModalCloseButton />
          <ModalBody sx={{background:'#212b36',margin:'22px',padding:'20px',borderRadius:'10px'}} >
            {/* Render additional details here using the selectedLand state */}
            {selectedLand && (
              <>
                <Text sx={{color:'white'}} className={righteous.className} >Seller Name: {selectedLand.sellerName}</Text>
               
                <Text sx={{color:'white'}} className={righteous.className}>tokenId: {selectedLand.tokenId.toNumber()}</Text>
                
                
            <Text sx={{color:'white'}}  className={righteous.className} >Document: </Text>
                <img 
                style={{borderRadius:'10px'}}
                      src={`https://ipfs.io/ipfs/${selectedLand.thumbnail.split('ipfs://')[1]}`}
                      alt={`Land ${selectedLand.tokenId.toNumber()} Image`}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                    />
                    <br></br>

                    <Button
                className={righteous.className}
                 sx={{width:'-webkit-fill-available'}}
                  mt="2"
                  colorScheme="teal"
                  variant="solid"
                  disabled={isBuying}
                  onClick={() => BuyLand(selectedLand.tokenId, selectedLand)}
                >
                  {isBuying ? "Buying..." : "BUY LAND"}
                </Button>
               
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={closeModal}>
              Close
            </Button>
            {/* You can add a "Buy" button here if needed */}
          </ModalFooter>
        </ModalContent>
            </Modal>
          )}


      </Box>
      </Flex>
  </>
  );
};

export default MapboxComponent;