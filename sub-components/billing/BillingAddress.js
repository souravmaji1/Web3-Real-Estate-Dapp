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

  const filteredEvents = data && data.filter((land) => {
    // Add your filtering conditions here
    // For example, filter lands that are for sale
    return land.isForRent;
  });
  
  console.log("filtered rents",filteredEvents);

  
  

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
    <Container maxW="xl" centerContent sx={{display:'contents'}}>
      <VStack spacing="4" align="stretch" w="100%" >
        {isRental ? (
          <Center>
            <CircularProgress isIndeterminate color="teal.500" />
          </Center>
        ) : (
          <>
          <Flex flexWrap="wrap" justifyContent="space-between" >
            {data.map((land, index) => (
              <Box
              sx={{background:'#212b36'}} 
                key={index}
                borderWidth="1px"
                borderRadius="lg"
                p="4"
                m="4"  
                width={{ base: "100%", sm: "100%", md: "100%", lg: "100%" }}
              >
                <Text sx={{color:'white'}}>Seller Name: {land.name}</Text>
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
              
                <Text sx={{color:'white'}} >Owner: {land.owner}</Text>
                <Text sx={{color:'white'}} >For Rent: {land.isForRent ? 'Yes' : 'No'}</Text>
              
                <Button
                    // ... (existing styling)
                    onClick={() => openModal(land)}
                  >
                    View Details
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
          <ModalHeader>Land Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Render additional details here using the selectedLand state */}
            {selectedLand && (
              <>
                <Text>Seller Name: {selectedLand.name}</Text>
                {/* Add other details you want to display */}
                <Text  >Latitude: {selectedLand.latitude}</Text>
                <Text >Longitude: {selectedLand.longitude}</Text>
                <Text >tokenId: {selectedLand.id.toString()}</Text>

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
           
                <img
                      src={`https://ipfs.io/ipfs/${selectedLand.thumbnail.split('ipfs://')[1]}`}
                      alt={`Land ${selectedLand.id.toString()} Image`}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                    />
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
  );
}

export default Billing;
