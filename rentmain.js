'use client'
import React from 'react';
import { useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from "@chakra-ui/react";
import { ethers } from 'ethers';
import {
  Box,
  Button,
  Center,
  CircularProgress,
  Container,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Fragment } from 'react';
import { Audiowide, Righteous } from 'next/font/google';
// ... (previous imports)
import Map, { Marker } from 'react-map-gl';
// ... (existing code)
import 'mapbox-gl/dist/mapbox-gl.css';

const audiowide = Audiowide({ subsets: ['latin'],weight:'400' });
const righteous = Righteous({ subsets: ['latin'],weight:'400' });


const Billing = () => {

  const { contract } = useContract("0x1280c376B5814cd838d2E346d904e589C433cce6");
  const { mutateAsync: bookDates, isLoading: isBooked } = useContractWrite(contract, "bookDates");
  const { data, isLoading: isRental } = useContractRead(contract, "getRentals", []);
  console.log(data);

  


  const [selectedLand, setSelectedLand] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [selectedFromDate, setSelectedFromDate] = useState(null);
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [price, setPrice] = useState(0);

  const priceCategories = [0.01, 1, 10];

  
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
      console.log("price",meetsPriceCriteria);
    //  const meetsOwnershipCriteria = filters.isForSale === null || land.isForRent === filters.isForSale;
      const meetsSellerNameCriteria = filters.sellerName === "" || land.name.includes(filters.sellerName);

      return meetsPriceCriteria && meetsSellerNameCriteria;
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


  

  const openModal = (land) => {
    setSelectedLand(land);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedLand(null);
    setIsModalOpen(false);
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
    <Fragment>
            <div className="pt-5 pb-21" style={{background:'#212125'}}>
    <Container maxW="xl" centerContent sx={{display:'contents'}}>
      <VStack spacing="4" align="stretch" w="100%" >
        {isRental ? (
          <Center>
            <CircularProgress isIndeterminate color="teal.500" />
          </Center>
        ) : (
          <>
          <Flex 
          style={{ 
            border: "1px solid #474545",
            borderRadius: "10px",
            margin: "19px",
            background: "#212b36",
            }}
          justifyContent="space-between" p="4">
              <Box>
                <Text className={righteous.className}>MAX PRICE :</Text>
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
                <Text className={righteous.className}>SELLER NAME :</Text>
                <input
                style={{color:'white',borderRadius:'4px'}}
                  type="text"
                  value={filters.sellerName}
                  onChange={(e) => setFilters({ ...filters, sellerName: e.target.value })}
                />
              </Box>
              <Button onClick={applyFilters}>Apply Filters</Button>
            </Flex>
          <Flex flexWrap="wrap" justifyContent="space-between" >
            {filteredData.map((land, index) => (
              <Box
              sx={{background:'#212b36',border: "1px solid #474545",}} 
                key={index}
                borderWidth="1px"
                borderRadius="lg"
                p="4"
                m="4"  
                width={{ base: "100%", sm: "100%", md: "100%", lg: "100%" }}
              >
                <Text className={righteous.className} sx={{color:'white'}}>SELLER NAME : {land.name}</Text>
                <Center>
                  <Box height="200px" overflow="hidden">
                    <img
                      src={`https://ipfs.io/ipfs/${land.imgUrl.split('ipfs://')[1]}`}
                      alt={`Land ${land.tokenId} Image`}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                    />
                  </Box>
                </Center>
              <br></br>
                <Text className={righteous.className}  sx={{color:'white'}} >OWNER : {land.owner}</Text>
                <Text className={righteous.className} sx={{color:'white'}} >PRICE/DAY: {ethers.utils.formatEther(land.pricePerDay.toString())}</Text>
                <Text className={righteous.className} sx={{color:'white'}} >FOR RENT: {land.isForRent ? 'Yes' : 'No'}</Text>
              
                <Button
                    className={audiowide.className}
                    onClick={() => openModal(land)}
                  >
                    VIEW DETAILS
                  </Button>
              </Box>
            ))}
        
          </Flex>
        
          </>
        )}
      </VStack>

      <Modal isOpen={isModalOpen} onClose={closeModal} size="full" >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader   className={righteous.className} >LAND DETAILS</ModalHeader>
          <ModalCloseButton />
          <ModalBody sx={{background:'#212b36',margin:'22px',padding:'20px',borderRadius:'10px'}} >
            {/* Render additional details here using the selectedLand state */}
            {selectedLand && (
              <>
                <Text sx={{color:'white'}} className={righteous.className} >Seller Name: {selectedLand.name}</Text>
                {/* Add other details you want to display */}
                <Text sx={{color:'white'}}  className={righteous.className} >Latitude: {selectedLand.latitude}</Text>
                <Text sx={{color:'white'}} className={righteous.className}>Longitude: {selectedLand.longitude}</Text>
                <Text sx={{color:'white'}} className={righteous.className}>tokenId: {selectedLand.id.toString()}</Text>
                
                
                
          <Map
          mapboxAccessToken='pk.eyJ1Ijoic291cmF2dyIsImEiOiJjbHM1dTJ0MGExZzgxMmtvZTA5MWs0ZXFnIn0.RkjKD84lnE10iZwNjOtx5w'
        mapLib={import('mapbox-gl')}
        initialViewState={{
          longitude: selectedLand.longitude,
          latitude: selectedLand.latitude,
          zoom: 3.5
        }}
        style={{width: 600, height: 400}}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        
          
      >
        
    <Marker 
      longitude={selectedLand.longitude}
      latitude={selectedLand.latitude}
    >
    </Marker>
  
        </Map>
     
     
    

      <br></br>

     



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

     
    </Container>
    </div>
    </Fragment>
  );
}

export default Billing;
