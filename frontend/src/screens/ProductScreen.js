import React,{useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import {Row,Col,Image,ListGroup,Card,Button, ListGroupItem, Form, FormGroup} from 'react-bootstrap'
import Rating from '../components/Rating'

import { useDispatch, useSelector } from 'react-redux'
import { listProductDetails,createProductReview} from '../actions/productsAction'
import Loader from '../components/Loader'
import Meta from '../components/Meta'
import Message from '../components/Message'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productsConstant'

const ProductScreen = ({history,match}) => {
   const [qty,setQty]=useState(1) 
   const [rating,setRating]=useState(0) 
   const [comment,setComment]=useState('') 

   const dispatch=useDispatch()

   const productDetails = useSelector(state => state.productDetails)
   const {loading,error,product}=productDetails

   const productReviewCreate = useSelector(state => state.productReviewCreate)
   const {success:successReviewCreate, loading: loadingProductReview,error:errorReviewCreate}=productReviewCreate
   
   const userLogin=useSelector(state=>state.userLogin)
   const {userInfo}=userLogin
   
    useEffect(() => {
        if(successReviewCreate){
            setRating(0)
            setComment('')
            
        }
        if (!product._id || product._id !== match.params.id) {
            dispatch(listProductDetails(match.params.id))
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
          }
    },[dispatch, match.params.id, product._id, successReviewCreate])

    const addToCartHandler=()=>{
            history.push(`/cart/${match.params.id}?qty=${qty}`)
    }

    const submitHandler=(e)=>{
        e.preventDefault()
        dispatch(createProductReview(match.params.id,{rating,comment}))
    }
    console.log(product)

    return (
        <>
           <Link className="btn btn-light my-3" to='/'>
               Go Back
           </Link>
           {loading? <Loader/>:error? <Message variant='danger'>{error}</Message>:
           (<>
           <Meta title={product.name}/>
           <Row>
           <Col md={8} className='product_image'>
               <Image src={product.image} alt={product.name} fluid/>
           </Col>
           <Col md={7}>
               <ListGroup variant='flush'>
                   <ListGroup.Item>
                       <h2>
                           {product.name}
                       </h2>
                   </ListGroup.Item>
                   <ListGroup.Item>
                       <Rating
                            value={product.rating}
                            text={`${product.numReviews} reviews`}
                            
                       />
                   </ListGroup.Item>
                   <ListGroup.Item>
                       Price:???{product.price}
                   </ListGroup.Item>
                   <ListGroup.Item>
                       Mentor: {product.brand}
                   </ListGroup.Item>
                   <ListGroup.Item>
                       Description:  {product.description}
                   </ListGroup.Item>
               </ListGroup>
           </Col>
           <Col md={1}></Col>
           <Col md={4}>
               <Card>
                   <ListGroup variant='flush'>
                       <ListGroup.Item>
                           <Row>
                               <Col>
                                    Price:
                               </Col>
                               <Col>
                                    <strong>???{product.price}</strong>
                               </Col>
                           </Row>
                       </ListGroup.Item>
                       <ListGroup.Item>
                           <Row>
                               <Col>
                                    Status:
                               </Col>
                               <Col>
                                   {product.countInStock>0 ? '15% Discount':'Comming Soon'}
                               </Col>
                           </Row>
                       </ListGroup.Item>
                        {product.countInStock>0 &&(
                            <ListGroup>
                                <Row>
                                    <Col>
                                            No of User
                                    </Col>
                                    <Col>
                                        <Form.Control as='select' value={qty} onChange={(e)=>
                                        setQty(e.target.value)}> {
                                        [...Array(product.countInStock).keys()].map((x)=>(
                                            <option key={x+1} value={x+1}>{x+1}</option>
                                           
                                        ))}
                                        </Form.Control>
                                    </Col>
                                </Row>
                            </ListGroup>
                        )}
                       <ListGroup.Item>
                           <Button onClick={addToCartHandler} className='btn-block' type='button' disabled={product.countInStock===0}>Add to Cart</Button>
                       </ListGroup.Item>
                       <ListGroup.Item>
                           <Button variant='danger' onClick={addToCartHandler} className='btn-block' type='button' disabled={product.countInStock===0}>Buy Now</Button>
                       </ListGroup.Item>
                   </ListGroup>
               </Card>
           </Col>
       </Row>
        <Row>
         <Col md={6}>
            <h3>Reviews</h3>
            {product.reviews.length===0 && <Message>No Reviews</Message>}
            <ListGroup variant='flush'>
                {console.log(product.review)}
                {product.reviews.map(review =>(
                    <ListGroup.Item key={review._id}>
                        <strong>{review.name}</strong>
                        <Rating value={review.rating}/>
                        <p>{review.createdAt.substring(0,10)}</p>
                        <p>{review.comment}</p>
                    </ListGroup.Item>
                ))}
                <ListGroup.Item>
                    <h2>Write a Customer Review</h2>
                    {successReviewCreate && (
                    <Message variant='success'>
                      Review submitted successfully
                    </Message>
                  )}
                  {loadingProductReview && <Loader />}
                    {errorReviewCreate && (
                        <Message variant ='danger'>{errorReviewCreate}</Message>
                    )}
                    {userInfo?
                    <Form onSubmit={submitHandler}>
                    <Form.Group onControlId='rating'>
                        <Form.Label>
                            Rating
                        </Form.Label>
                        <Form.Control as='select' value={rating} onChange={(e)=> setRating(e.target.value)}>
                            <option value=''>Select ....</option>
                            <option value='1'>1 - Poor</option>
                            <option value='2'>2 - Fair</option>
                            <option value='3'>3 - Good</option>
                            <option value='4'>4 - Very Good</option>
                            <option value='5'>5 - Excellent</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='comment'>
                        <Form.Label>
                            Comment
                        </Form.Label>
                        <Form.Control as='textarea' row='3' value={comment} onChange={(e)=> setComment(e.target.value)}>

                        </Form.Control>
                    </Form.Group>
                    <Button disabled={loadingProductReview}  type='submit'  variant='primary'>Submit</Button>
                     
                    </Form>
                    :<Message>Please <Link to='/login'>sign in</Link> to write a review{' '}</Message>}
                </ListGroup.Item>
            </ListGroup>
         </Col>
        </Row>
       </>)}
           
        </>
    )
}

export default ProductScreen
