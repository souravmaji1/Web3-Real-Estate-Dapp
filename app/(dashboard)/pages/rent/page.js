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
  const { contract } = useContract("0xa3B81363b5aB3482424d124FD2d36B84e1D9817f");
  const { data, isLoading: isRental } = useContractRead(contract, "getRentals");
  const { mutateAsync: bookDates, isLoading: isBooked } = useContractWrite(contract, "bookDates");
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
      const meetsPriceCriteria = parseFloat(ethers.utils.formatEther(land.pricePerDay)) === filters.maxPrice;
      console.log("price",ethers.utils.formatEther(land.pricePerDay));
    //  const meetsOwnershipCriteria = filters.isForSale === null || land.isForSale === filters.isForSale;
      const meetsSellerNameCriteria = filters.sellerName === "" || land.name.includes(filters.sellerName);

      return meetsPriceCriteria  && meetsSellerNameCriteria;
    });

    return filteredData;
  };

  const filteredData = applyFilters();
  console.log("filtered lands",filteredData);

  const resetPriceFilter = () => {
    setFilters({ ...filters, maxPrice: Infinity });
  };
  


  const handleFromDateChange = (date) => {
    setSelectedFromDate(date);
    console.log(data);
  };

  const handleToDateChange = (date) => {
    setSelectedToDate(date);
    console.log(data);
  };

  

  const BookRent = async () => {
    try {
      const datefrom = Math.floor(selectedFromDate.getTime() / 1000);
      console.log(datefrom);
      const dateto = Math.floor(selectedToDate.getTime() / 1000);
      console.log(dateto);

      const dayToSeconds = 86400;
      const bookPeriod = (dateto - datefrom) / dayToSeconds;
      const totalBookingPriceUSD = Number(ethers.utils.formatEther(selectedLand.pricePerDay.toString())) * bookPeriod;
      const totalBookingPrice = ethers.utils.parseEther(totalBookingPriceUSD.toString());
      const data = await bookDates({
        args: [selectedLand.id.toString(),datefrom,dateto],
        overrides: {
          value: totalBookingPrice.toString(),
        },
      });
      console.log('price is', price);
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }






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
                <Text sx={{color:'white'}} className={righteous.className} >Seller Name: {selectedLand.name}</Text>
               
                <Text sx={{color:'white'}} className={righteous.className}>tokenId: {selectedLand.id.toString()}</Text>
                
                <div>
                <Text sx={{color:'white'}}  className={righteous.className} >Choose Dates: </Text>
                <DatePicker
              selected={selectedFromDate}
              onChange={handleFromDateChange}
              selectsStart
              startDate={selectedFromDate}
              endDate={selectedToDate}
              placeholderText="Select start date"
            />
            <DatePicker
              selected={selectedToDate}
              onChange={handleToDateChange}
              selectsEnd
              startDate={selectedFromDate}
              endDate={selectedToDate}
              minDate={selectedFromDate}
              placeholderText="Select end date"
            />
            </div>

<br></br>
                
            <Text sx={{color:'white'}}  className={righteous.className} >Document: </Text>
                <img 
                style={{borderRadius:'10px'}}
                      src={`https://ipfs.io/ipfs/${selectedLand.thumbnail.split('ipfs://')[1]}`}
                      alt={`Land ${selectedLand.id.toString()} Image`}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                    />
                    <br></br>

                    <Button
                 sx={{width:'-webkit-fill-available'}}
                  mt="2"
                  colorScheme="teal"
                  variant="solid"
                  disabled={isBooked}
                  onClick={() => BookRent()}
                >
                  {isBooked ? "Rent..." : "Book for Rent"}
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