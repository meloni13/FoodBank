import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Button, Image, FloatingLabel, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { listProductDetails, createProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import axios from 'axios'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { refreshLogin, getUserDetails } from '../actions/userActions'
import FileBase64 from 'react-file-base64'

import FormContainer from '../components/FormContainer'

const ProductCreatePage = ({ match, history }) => {
  // all variable for stroing product details
  const productId = match.params.id
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [originalimage, setOriginalImage] = useState('')
  const [price, setPrice] = useState(0.0)
  const [countInStock, setCountInStock] = useState(0)
  const [isCampaign, setIsCampaign] = useState(false)

  // to upload product image
  const [uploading, setUploading] = useState(false)
  const [errorImageUpload, setErrorImageUpload] = useState('')
  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, product, error } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: loadingUpdate,
    success: successUpdate,
    error: errorUpdate,
  } = productUpdate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userDetails = useSelector((state) => state.userDetails)
  const { error: userLoginError } = userDetails

  // fetch user login details
  useEffect(() => {
    userInfo
      ? userInfo.isSocialLogin
        ? dispatch(getUserDetails(userInfo.id))
        : dispatch(getUserDetails('profile'))
      : dispatch(getUserDetails('profile'))
  }, [userInfo, dispatch])

  // fetch new access tokens if user details fail, using the refresh token
  useEffect(() => {
    if (userLoginError && userInfo && !userInfo.isSocialLogin) {
      const user = JSON.parse(localStorage.getItem('userInfo'))
      user && dispatch(refreshLogin(user.email))
    }
  }, [userLoginError, dispatch, userInfo])

  // submit the product details
  const handleSubmit = async (e) => {
    e.preventDefault()
    setOriginalImage(image.image)
    dispatch(
      createProduct({
        name,
        brand,
        price,
        user: userInfo.id,
        category,
        description,
        countInStock,
        isCampaign,
        image: image.image,
      }),
    )
    history.push('/admin/productlist')
  }

  return (
    <>
      <Link to="/admin/productlist">
        <Button variant="outline-primary" className="mt-3">
          Go Back
        </Button>
      </Link>
      <FormContainer style={{ marginTop: '-2em' }}>
        <h1>Create Product</h1>
        {loadingUpdate ? (
          <Loader />
        ) : errorUpdate ? (
          <Message dismissible variant="danger" duration={10}>
            {errorUpdate}
          </Message>
        ) : (
          <>
            {loading ? (
              <Loader />
            ) : (
              <Form onSubmit={handleSubmit}>
                {error && (
                  <Message dismissible variant="danger" duration={10}>
                    {error}
                  </Message>
                )}
                <Form.Group controlId="name">
                  <FloatingLabel
                    controlId="nameinput"
                    label="Name"
                    className="mb-3"
                  >
                    <Form.Control
                      size="lg"
                      placeholder="Enter Name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group controlId="price">
                  <FloatingLabel
                    controlId="priceinput"
                    label="Price"
                    className="mb-3"
                  >
                    <Form.Control
                      size="lg"
                      placeholder="Enter price"
                      type="number"
                      value={price}
                      min="0"
                      max="1000"
                      step="0.1"
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </FloatingLabel>
                </Form.Group>
                {errorImageUpload && (
                  <Message dismissible variant="danger" duration={10}>
                    {errorImageUpload}
                  </Message>
                )}
                {uploading ? (
                  <div>Uploading...</div>
                ) : (
                  <Form.Group controlId="image">
                    <Row>
                      <Col md={9}>
                        {/* <form action="" onSubmit={onImageUpload}> */}
                        <FileBase64
                          type="file"
                          multiple={false}
                          onDone={({ base64 }) => setImage({ image: base64 })}
                        />
                        {/* <div className="right-align">
														<button className="btn">Upload Food Item Photo</button>
													</div>
												</form> */}
                      </Col>
                      <Col md={3}>
                        <div
                          className="profile-page-image"
                          style={{
                            alignSelf: 'center',
                          }}
                        >
                          <Image
                            src={image && image.image}
                            alt={name}
                            // title='Click to input file'
                            style={{
                              width: '100%',
                              border: '1px solid #ced4da',
                              marginBottom: '1em',
                              cursor: 'pointer',
                              borderRadius: '0.25rem',
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Form.Group>
                )}
                <Form.Group controlId="brand">
                  <FloatingLabel
                    controlId="brandinput"
                    label="Brand"
                    className="mb-3"
                  >
                    <Form.Control
                      size="lg"
                      placeholder="Enter brand"
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group controlId="campaign">
                  <Form.Check
                    type="switch"
                    id="1-switch"
                    label="Is this a Campaign ? "
                    // value={isCampaign}
                    onChange={(e) => {
                      setIsCampaign(!isCampaign)
                      console.log(isCampaign)
                    }}
                  />
                </Form.Group>

                <Form.Group controlId="category">
                  <FloatingLabel
                    controlId="categoryinput"
                    label="Category"
                    className="mb-3"
                  >
                    <Form.Control
                      size="lg"
                      placeholder="Enter category"
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group controlId="description">
                  <FloatingLabel
                    controlId="descinput"
                    label="Description"
                    className="mb-3"
                  >
                    <Form.Control
                      size="lg"
                      placeholder="Enter description URL"
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group controlId="countInStock">
                  <FloatingLabel
                    controlId="countinstockinput"
                    label="CountInStock"
                    className="mb-3"
                  >
                    <Form.Control
                      size="lg"
                      placeholder="Enter Count In Stock"
                      type="number"
                      min="0"
                      max="1000"
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                    />
                  </FloatingLabel>
                </Form.Group>
                <div className="d-flex">
                  {/* <Link to='/admin/productlist'> */}
                  <Button type="submit" className="my-1 ms-auto">
                    Create Product
                  </Button>
                  {/* </Link> */}
                </div>
              </Form>
            )}
          </>
        )}
      </FormContainer>
    </>
  )
}

export default ProductCreatePage
