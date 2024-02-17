// import node module libraries
import { Row, Col } from 'react-bootstrap';

const PageHeading = props => {
  const { heading } = props;
  return (
    <Row>
      <Col lg={12} md={12} xs={12}>
        {/* Page header */}
        <div className=" pb-4 mb-4 ">
          <h3 style={{color:'white'}}  className="mb-0 ">{heading}</h3>
        </div>
      </Col>
    </Row>
  )
}

export default PageHeading