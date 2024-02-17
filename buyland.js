'use client'
// import node module libraries
import { Fragment } from "react";
import Link from 'next/link';
import { Col, Row } from 'react-bootstrap';
import { StatRightTopIcon } from "widgets";
import { ActiveProjects, Teams, 
    TasksPerformance 
} from "sub-components";
import ProjectsStatsData from "data/dashboard/ProjectsStatsData";
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
import { Audiowide, Righteous } from 'next/font/google';

const audiowide = Audiowide({ subsets: ['latin'],weight:'400' });
const righteous = Righteous({ subsets: ['latin'],weight:'400' });


const Home = () => {
    
  const { contract } = useContract("0x1280c376B5814cd838d2E346d904e589C433cce6");
  const { data, isLoading } = useContractRead(contract, "getAllListedLands", []);
  const { mutateAsync: buyLand, isLoading: isBuying } = useContractWrite(contract, "buyLand");
  console.log(data);

  const [selectedLand, setSelectedLand] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

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
  

  const openModal = (land) => {
    setSelectedLand(land);
    setIsModalOpen(true);
  };

  const resetPriceFilter = () => {
    setFilters({ ...filters, maxPrice: Infinity });
  };

 
  const closeModal = () => {
    setSelectedLand(null);
    setIsModalOpen(false);
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
        <Fragment>
            <div className="pt-5 pb-21" style={{background:'#212125'}}>
            <Container maxW="xl" centerContent sx={{display:'contents'}}>
      <VStack spacing="4" align="stretch" w="100%" >
        {isLoading ? (
          <Center>
            <CircularProgress isIndeterminate color="teal.500" />
          </Center>
        ) : (
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
          <Flex flexWrap="wrap" justifyContent="space-between" >
            {filteredData.map((land, index) => (
              <Box
              sx={{background:'#212b36',border:'1px solid #474545'}}
                key={index}
                borderWidth="1px"
                borderRadius="lg"
                p="4"
                m="4"  
                width={{ base: "100%", sm: "100%", md: "100%", lg: "100%" }}
              >
                <Text className={righteous.className}  sx={{color:'white'}}>SELLER NAME : {land.sellerName}</Text>
                <Center>
                  <Box height="200px" overflow="hidden">
                    <img
                      src={`https://ipfs.io/ipfs/${land.imageUri.split('ipfs://')[1]}`}
                      alt={`Land ${land.tokenId.toNumber()} Image`}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                    />
                  </Box>
                </Center>
                <br></br>
                <Text  className={righteous.className}  sx={{color:'white'}} >PRICE : {ethers.utils.formatEther(land.price)}</Text>
                <Text className={righteous.className}  sx={{color:'white'}} >OWNER : {land.owner}</Text>
                <Text className={righteous.className}  sx={{color:'white'}} >FOR SALE : {land.isForSale ? 'Yes' : 'No'}</Text>
              
                <Button
                sx={{color:'white'}}
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
          <ModalHeader className={righteous.className} >LAND DETAILS</ModalHeader>
          <ModalCloseButton />
          <ModalBody sx={{background:'#212b36',margin:'22px',padding:'20px',borderRadius:'10px'}}>
            {/* Render additional details here using the selectedLand state */}
            {selectedLand && (
              <>
                <Text className={righteous.className} >SELLER NAME : {selectedLand.sellerName}</Text>
                {/* Add other details you want to display */}
                <Text className={righteous.className} >LATITUDE : {selectedLand.latitude}</Text>
                <Text className={righteous.className}>LONGITUDE : {selectedLand.longitude}</Text>
                <Text className={righteous.className} >DOCUMENT :</Text>
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
                <br></br>
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
    )
}
export default Home;
