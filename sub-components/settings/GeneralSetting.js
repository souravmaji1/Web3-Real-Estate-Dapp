// import node module libraries
import { Col, Row, Form, Card, Button, Image } from 'react-bootstrap';
import React, { useState } from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select
} from '@chakra-ui/react';
// import widget as custom components
import { FormSelect, DropFiles } from 'widgets';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// import hooks
import useMounted from 'hooks/useMounted';
import { useContract, useContractWrite } from "@thirdweb-dev/react";
import { useSDK } from "@thirdweb-dev/react";
import { ethers } from 'ethers';
import { Fragment } from 'react';
import { Audiowide, Righteous } from 'next/font/google';
import { useAddress } from '@thirdweb-dev/react';

const audiowide = Audiowide({ subsets: ['latin'],weight:'400' });
const righteous = Righteous({ subsets: ['latin'],weight:'400' });

const GeneralSetting = () => {
  const hasMounted = useMounted();
  const countryOptions = [
    { value: 'India', label: 'India' },
    { value: 'US', label: 'US' },
    { value: 'UK', label: 'UK' },
    { value: 'UAE', label: 'UAE' }
  ];

  
  const [landAddress, setlandAddress] = useState('');
  const [imageurl, setimageUrl] = useState('');
  const [price, setPrice] = useState('');

  const [thumbnailurl, setthumbanilUrl] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [description, setDescription] = useState('');
  const [maxguest, setMaxguest] = useState('');
  const address = useAddress();

  const [name, setName] = useState('');
  const sdk = useSDK();

  const { contract } = useContract("0xa3B81363b5aB3482424d124FD2d36B84e1D9817f");
  const { mutateAsync: listLand, isLoading } = useContractWrite(contract, "listLand");

  const { contract: rental } = useContract("0xa3B81363b5aB3482424d124FD2d36B84e1D9817f");
  const { mutateAsync: addRental, isLoading: isRentalLoading } = useContractWrite(rental, "addRental")


  const call = async () => {
    try {
      const img = await sdk.storage.upload(imageurl);
      const thumbnail = await sdk.storage.upload(thumbnailurl);
      const cost = ethers.utils.parseEther(price);
      const data = await listLand({ args: [landAddress, name, img, thumbnail, latitude, longitude, cost] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }

  const rentLand = async () => {
    try {
      const img = await sdk.storage.upload(imageurl);
      const thumbnail = await sdk.storage.upload(thumbnailurl);
      const cost = ethers.utils.parseEther(price);
      const data = await addRental({ args: [name, landAddress, latitude, longitude, description, img, thumbnail, maxguest, cost], 
        overrides: {
        value: ethers.utils.parseEther('0.0001'),
      }, });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }

  const contractOwnerAddress = "0x0967eD6f98A1A60Bb697e1db88d8C077523d3871"; // Replace with the actual contract owner address
  const connectedUserAddress = address; // Replace with the actual connected user address

  const isContractOwner = connectedUserAddress === contractOwnerAddress;

  if (!isContractOwner) {
    return (
      <Row style={{ 
        border: "1px solid #474545",
        borderRadius: "10px",
        margin: "19px",
        background: "#212b36",
        }} >
      <div style={{ color: 'red', textAlign: 'center', marginTop: '20px' }}>
      <h4  style={{color:'white',padding:'30px'}}  className={`mb-1 ${righteous.className}`}>YOU ARE NOT AUTHORIZED AS GOVERMENT TO UPLOAD LISTINGS</h4> 
      </div>
      </Row>
    );
  }

  return (
    <Row style={{background:'#212125',padding:'20px'}}>
      <Tabs variant="soft-rounded" colorScheme="teal" align="start" isFitted>
      <TabList>
        <Tab>List for Sale</Tab>
        <Tab>For Rent</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
        
      <Col >
        <Card>
          <Card.Body style={{background:'#212b36',borderRadius:'6px',border:'1px solid'}} >
           
            <div>
              <div className="mb-6">
                <h4  style={{color:'white'}}  className={`mb-1 ${righteous.className}`}>SELLING INFORMATION</h4>
              </div>
              {hasMounted && 
              <Form>
                <Row className="mb-3">
                  <Form.Label style={{color:'white'}}   className={`col-sm-4 col-form-label form-label ${righteous.className}`} htmlFor="fullName">Full name</Form.Label>
                  <Col sm={4} className="mb-3 mb-lg-0">
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)}   placeholder="Full name" id="fullName" required />
                  </Col>
                </Row>
               

                {/* Address Line One */}
                <Row className="mb-3">
                  <Form.Label style={{color:'white'}}   className={`col-sm-4 ${righteous.className}`} htmlFor="addressLine">City</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control type="text"  value={landAddress} onChange={(e) => setlandAddress(e.target.value)}  placeholder="Enter Address line 1" id="addressLine" required />
                  </Col>
                </Row>

                <Row className="mb-3">
  <Form.Label style={{color:'white'}}   className={`col-sm-4 ${righteous.className}`} htmlFor="imageFile">
    Thumbnail
  </Form.Label>
  <Col md={8} xs={12}>
    <input
      type="file"
      id="imageFile"
      onChange={(e) => {
        const file = e.target.files[0];
        setimageUrl(file);
      }}
    />
  </Col>
</Row>

<Row className="mb-3">
  <Form.Label style={{color:'white'}} className={`col-sm-4 ${righteous.className} `} htmlFor="imageFile">
    Document
  </Form.Label>
  <Col md={8} xs={12}>
    <input
      type="file"
      id="imageFile"
      onChange={(e) => {
        const file = e.target.files[0];
        setthumbanilUrl(file);
      }}
    />
  </Col>
</Row>

                <Row className="mb-3">
                  <Form.Label style={{color:'white'}}   className={`col-sm-4 ${righteous.className}`} htmlFor="addressLine">Price</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control type="text" value={price} onChange={(e) => setPrice(e.target.value)}  placeholder="Enter Address line 1" id="addressLine" required />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Form.Label style={{color:'white'}}   className={`col-sm-4 ${righteous.className} `} htmlFor="addressLine">Latitude</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)}  placeholder="Enter Address line 1" id="addressLine" required />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Form.Label style={{color:'white'}}  className={`col-sm-4 ${righteous.className} `} htmlFor="addressLine">Longitude</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)}  placeholder="Enter Address line 1" id="addressLine" required />
                  </Col>
                </Row>

           
                <Row className="align-items-center">
                



                  <Col md={{ offset: 4, span: 8 }} xs={12} className="mt-4">
                    <Button className={`${righteous.className}`}  style={{background:'#81E6D9',color:'black',border:'none'}}  disabled={isLoading} variant="primary" onClick={call} >
                    {isLoading ? "Listing..." : "LIST FOR SALE"}
                    </Button>
                  </Col>

                </Row>
              </Form>
              }
            </div>
          </Card.Body>
        </Card>

      </Col>

        </TabPanel>
        <TabPanel>
          {/* Content for For Rent */}
          {/* You can create another form for renting */}
          <Col >
        <Card>
          <Card.Body style={{background:'#212b36',borderRadius:'6px',border:'1px solid'}} >
           
            <div>
              <div className="mb-6">
                <h4 style={{color:'white'}}  className={`mb-1 ${righteous.className}`}>RENTAL INFORMATION</h4>
              </div>
              {hasMounted && 
              <Form>
                <Row className="mb-3">
                  <Form.Label style={{color:'white'}}  className={`col-sm-4 col-form-label form-label ${righteous.className}`} htmlFor="fullName">Full name</Form.Label>
                  <Col sm={4} className="mb-3 mb-lg-0">
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)}   placeholder="Full name" id="fullName" required />
                  </Col>
                </Row>
               

                {/* Address Line One */}
                <Row className="mb-3">
                  <Form.Label style={{color:'white'}}  className={`col-sm-4 ${righteous.className} `} htmlFor="addressLine">City</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control type="text"  value={landAddress} onChange={(e) => setlandAddress(e.target.value)}  placeholder="Enter Address line 1" id="addressLine" required />
                  </Col>
                </Row>

                <Row className="mb-3">
  <Form.Label style={{color:'white'}}  className={`col-sm-4 ${righteous.className} `} htmlFor="imageFile">
    Thumbnail
  </Form.Label>
  <Col md={8} xs={12}>
    <input
      type="file"
      id="imageFile"
      onChange={(e) => {
        const file = e.target.files[0];
        setimageUrl(file);
      }}
    />
  </Col>
</Row>

<Row className="mb-3">
  <Form.Label style={{color:'white'}}  className={`col-sm-4 ${righteous.className} `} htmlFor="imageFile">
    Document
  </Form.Label>
  <Col md={8} xs={12}>
    <input
      type="file"
      id="imageFile"
      onChange={(e) => {
        const file = e.target.files[0];
        setthumbanilUrl(file);
      }}
    />
  </Col>
</Row>

<Row className="mb-3">
                  <Form.Label style={{color:'white'}} className={`col-sm-4 ${righteous.className} `} htmlFor="addressLine">Description</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)}  placeholder="Enter Address line 1" id="addressLine" required />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Form.Label style={{color:'white'}}  className={`col-sm-4 ${righteous.className} `} htmlFor="addressLine">Max Guest</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control type="text" value={maxguest} onChange={(e) => setMaxguest(e.target.value)}  placeholder="Enter Address line 1" id="addressLine" required />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Form.Label style={{color:'white'}}  className={`col-sm-4 ${righteous.className} `} htmlFor="addressLine">Price Per Day</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control type="text" value={price} onChange={(e) => setPrice(e.target.value)}  placeholder="Enter Address line 1" id="addressLine" required />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Form.Label style={{color:'white'}}  className={`col-sm-4 ${righteous.className} `} htmlFor="addressLine">Latitude</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)}  placeholder="Enter Address line 1" id="addressLine" required />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Form.Label style={{color:'white'}}  className={`col-sm-4 ${righteous.className} `} htmlFor="addressLine">Longitude</Form.Label>
                  <Col md={8} xs={12}>
                    <Form.Control type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)}  placeholder="Enter Address line 1" id="addressLine" required />
                  </Col>
                </Row>

           
                <Row className="align-items-center">
                



                  <Col md={{ offset: 4, span: 8 }} xs={12} className="mt-4">
                    <Button className={`${righteous.className}`}  style={{background:'#81E6D9',color:'black',border:'none'}}  disabled={isRentalLoading}  variant="primary" onClick={rentLand} >
                    {isRentalLoading ? "Listing..." : "LIST FOR RENT"}
                    </Button>
                  </Col>

                </Row>
              </Form>
              }
            </div>
          </Card.Body>
        </Card>

      </Col>
        </TabPanel>
      </TabPanels>
    </Tabs>

     
    </Row>
  )
}

export default GeneralSetting