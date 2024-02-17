// import node module libraries
import Link from 'next/link';
import { Col, Row, Image } from 'react-bootstrap';
import { useAddress } from "@thirdweb-dev/react";
import { useContract, useContractRead } from "@thirdweb-dev/react";
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
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
const ProfileHeader = () => {

  const address = useAddress();
  const { contract } = useContract("0x1280c376B5814cd838d2E346d904e589C433cce6");
  const { data, isLoading } = useContractRead(contract, "getUserLandsBought", [address]);
  const { data: listedforsale, isLoading: isListingSale } = useContractRead(contract, "getUserLandsForSale", [address]);
  const { data: rentalbooked, isLoading: isrentalbook } = useContractRead(contract, "getUserRentalsBooked", [address]);
  const { data: rentalcreated, isLoading: isrentalcreate } = useContractRead(contract, "getUserRentalsCreated", [address]);
  console.log(data);

  return (
    <Row className="align-items-center">
      <Col xl={12} lg={12} md={12} xs={12}>
        {/* Bg */}
        <div className="pt-20 rounded-top" style={{ background: 'url(/images/background/profile-cover.jpg) no-repeat', backgroundSize: 'cover' }}>
        </div>
        <div style={{background:'#212b36'}}  className=" rounded-bottom smooth-shadow-sm ">
          <div className="d-flex align-items-center justify-content-between pt-4 pb-6 px-4">
            <div className="d-flex align-items-center">
              {/* avatar */}
              <div className="avatar-xxl avatar-indicators avatar-online me-2 position-relative d-flex justify-content-end align-items-end mt-n10">
                <Image src="/images/avatar/avatar-1.jpg" className="avatar-xxl rounded-circle border border-4 border-white-color-40" alt="" />
                <Link href="#!" className="position-absolute top-0 right-0 me-2" data-bs-toggle="tooltip" data-placement="top" title="" data-original-title="Verified">
                  <Image src="/images/svg/checked-mark.svg" alt="" height="30" width="30" />
                </Link>
              </div>
              {/* text */}
              <div className="lh-1">
                <h2  style={{color:'white'}} className="mb-0">Wallet Address:
                  <Link href="#!" className="text-decoration-none" data-bs-toggle="tooltip" data-placement="top" title="" data-original-title="Beginner">
                  </Link>
                </h2>
                <p style={{color:'white'}} className="mb-0 d-block">{address}</p>
              </div>
            </div>
            <div>
              <Link href="#" className="btn btn-outline-primary d-none d-md-block">Edit Profile</Link>
            </div>
          </div>
          <Tabs>
  <TabList>
    <Tab>Listed Lands</Tab>
    <Tab>Bought Lands</Tab>
    <Tab>Listed For Rent</Tab>
    <Tab>Paying for Rent</Tab>
  </TabList>

  <TabPanels>
    <TabPanel>
    <Container maxW="xl" centerContent sx={{display:'contents'}}>
      <VStack spacing="4" align="stretch" w="100%" >
        {isListingSale ? (
          <Center>
            <CircularProgress isIndeterminate color="teal.500" />
          </Center>
        ) : (
          <Flex flexWrap="wrap" justifyContent="space-between" >
            { listedforsale && listedforsale.map((land, index) => (
              <Box
              sx={{background:'#212b36'}} 
                key={index}
                borderWidth="1px"
                borderRadius="lg"
                p="4"
                m="4"  
                width={{ base: "100%", sm: "100%", md: "100%", lg: "100%" }}
              >
                <Text sx={{color:'white'}}>Seller Name: {land.sellerName}</Text>
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
                <Text sx={{color:'white'}} >Price: {ethers.utils.formatEther(land.price)}</Text>
                <Text sx={{color:'white'}} >Owner: {land.owner}</Text>
                <Text sx={{color:'white'}} >For Sale: {land.isForSale ? 'Yes' : 'No'}</Text>
               
              </Box>
            ))}
          </Flex>
        )}
      </VStack>
    </Container>
    </TabPanel>

    <TabPanel>
    <Container maxW="xl" centerContent sx={{display:'contents'}}>
      <VStack spacing="4" align="stretch" w="100%" >
        {isLoading ? (
          <Center>
            <CircularProgress isIndeterminate color="teal.500" />
          </Center>
        ) : (
          <Flex flexWrap="wrap" justifyContent="space-between" >
            {data && data.map((land, index) => (
              <Box
              sx={{background:'#212b36'}} 
                key={index}
                borderWidth="1px"
                borderRadius="lg"
                p="4"
                m="4"  
                width={{ base: "100%", sm: "100%", md: "100%", lg: "100%" }}
              >
                <Text sx={{color:'white'}}>Seller Name: {land.sellerName}</Text>
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
                <Text sx={{color:'white'}} >Price: {ethers.utils.formatEther(land.price)}</Text>
                <Text sx={{color:'white'}} >Owner: {land.owner}</Text>
                <Text sx={{color:'white'}} >For Sale: {land.isForSale ? 'Yes' : 'No'}</Text>
               
              </Box>
            ))}
          </Flex>
        )}
      </VStack>
    </Container>
    </TabPanel>
    <TabPanel>
    <Container maxW="xl" centerContent sx={{display:'contents'}}>
      <VStack spacing="4" align="stretch" w="100%" >
        {isrentalcreate ? (
          <Center>
            <CircularProgress isIndeterminate color="teal.500" />
          </Center>
        ) : (
          <Flex flexWrap="wrap" justifyContent="space-between" >
            { rentalcreated && rentalcreated.map((land, index) => (
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
                      src={`https://ipfs.io/ipfs/${land.thumbnail.split('ipfs://')[1]}`}
                      alt={`Land ${land.id.toString()} Image`}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                    />
                  </Box>
                </Center>
                <Text sx={{color:'white'}} >Price: {ethers.utils.formatEther(land.pricePerDay)}</Text>
                <Text sx={{color:'white'}} >Owner: {land.owner}</Text>
                <Text sx={{color:'white'}} >For Rent: {land.isForRent ? 'Yes' : 'No'}</Text>
              </Box>
            ))}
          </Flex>
        )}
      </VStack>
    </Container>
    </TabPanel>
    <TabPanel>
    <Container maxW="xl" centerContent sx={{display:'contents'}}>
      <VStack spacing="4" align="stretch" w="100%" >
        {isrentalbook ? (
          <Center>
            <CircularProgress isIndeterminate color="teal.500" />
          </Center>
        ) : (
          <Flex flexWrap="wrap" justifyContent="space-between" >
            { rentalbooked && rentalbooked.map((land, index) => (
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
                      src={`https://ipfs.io/ipfs/${land.thumbnail.split('ipfs://')[1]}`}
                      alt={`Land ${land.id.toString()} Image`}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                    />
                  </Box>
                </Center>
                <Text sx={{color:'white'}} >Price: {ethers.utils.formatEther(land.pricePerDay)}</Text>
                <Text sx={{color:'white'}} >Owner: {land.owner}</Text>
                <Text sx={{color:'white'}} >For Rent: {land.isForRent ? 'Yes' : 'No'}</Text>
              </Box>
            ))}
          </Flex>
        )}
      </VStack>
    </Container>
    </TabPanel>
  </TabPanels>
</Tabs>
         
    

        </div>
      </Col>
    </Row>
  )
}

export default ProfileHeader