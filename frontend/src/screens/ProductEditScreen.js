import axios from 'axios'
import React,{useState,useEffect} from 'react'
import {Form,Button,} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import{useDispatch,useSelector} from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {listProductDetails, updateProduct} from '../actions/productsAction'
import FormContainer from '../components/FormContainer'
import { PRODUCT_UPDATE_RESET } from '../constants/productsConstant'


const ProductEditScreen = ({match,history}) => {
     const productId=match.params.id

     const [name,setName]=useState('')
     const [price,setPrice]=useState(0)
     const [image,setImage]=useState('')
     const [brand,setBrand]=useState('')
     const [category,setCategory]=useState('')
     const [countInStock,setCountInStock]=useState(0)
     const [description,setDescription]=useState('')
     const [uploading,setUploading]= useState(false)

     const dispatch = useDispatch()

     const productDetails=useSelector(state=>state.productDetails)
     const {loading,error,product}=productDetails
     
     const productUpdate=useSelector(state=>state.productUpdate)
     const {loading:loadingUpdate,error:errorUpdate,success:successUpdate}=productUpdate
   
     useEffect(() => {
            if(successUpdate){
                dispatch({type:PRODUCT_UPDATE_RESET})
                history.push('/admin/productlist')
            }else{
                if (!product.name || product._id !==productId){
                    dispatch(listProductDetails(productId))
                }else{
                    setName(product.name)
                    setPrice(product.price)
                    setImage(product.image)
                    setBrand(product.brand)
                    setCategory(product.category)
                    setCountInStock(product.countInStock)
                    setDescription(product.description)
                    
                }
            }

            
        
         
     }, [dispatch, history, product._id, product.brand, product.category, product.countInStock, product.description, product.image, product.name, product.price, productId, successUpdate])


     const uploadFileHandler=async(e)=>{
         const file = e.target.files[0]
         const formData =new FormData()
         formData.append('image',file)
         setUploading(true)
         
         try {
             const config ={
                 headers:{
                     'Content-Type':'multipart/form-data'
                 }
             }

             const {data}= await axios.post('/api/upload',formData,config)
             console.log(data)
             setImage(data)
             setUploading(false)
         } catch (error) {
             console.log(error);
             setUploading(false)
         }
     }

     const submitHandler=(e)=>{
         e.preventDefault()
        dispatch(updateProduct({
            _id:productId,
            name,price,image,brand,category,description,countInStock
        }))
     }
    return (
        <>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
            <h1>Edit Product</h1> 
                {loadingUpdate && <Loader/>}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                 
                {loading?<Loader/>:error?<Message variant='danger'>{error}</Message>:(
              
              
               
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label>
                            Course Name:
                        </Form.Label>
                        <Form.Control type='name' placeholder='Enter Course name' value={name}
                        onChange={(e)=>setName(e.target.value)}>
      
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='Price'>
                        <Form.Label>
                            Price:
                        </Form.Label>
                        <Form.Control type='number' placeholder='Enter price' value={price}
                        onChange={(e)=>setPrice(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    
                    <Form.Group controlId='Image'>
                        <Form.Label>
                            Image
                        </Form.Label>
                        <Form.Control type='text' placeholder='Enter Image Url' value={image}
                        onChange={(e)=>setImage(e.target.value)}>
                        </Form.Control>
                        <Form.File id='image-file' label='Choose File' custom onChange={uploadFileHandler}></Form.File>
                    {uploading && <Loader/>}
                    </Form.Group>
                    
                    
                    <Form.Group controlId='Brand'>
                        <Form.Label>
                            Teacher:
                        </Form.Label>
                        <Form.Control type='text' placeholder='Enter Teacher Name' value={brand}
                        onChange={(e)=>setBrand(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    
                    <Form.Group controlId='CountInStock'>
                        <Form.Label>
                            No of student:
                        </Form.Label>
                        <Form.Control type='text' placeholder='0' value={countInStock}
                        onChange={(e)=>setCountInStock(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    
                    <Form.Group controlId='Category'>
                        <Form.Label>
                            Category:
                        </Form.Label>
                        <Form.Control type='text' placeholder='Programming Language' value={category}
                        onChange={(e)=>setCategory(e.target.value)}>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='Description'>
                        <Form.Label>
                            Description
                        </Form.Label>
                        <Form.Control type='text' placeholder='Enter Description' value={description}
                        onChange={(e)=>setDescription(e.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    
                    
                    
                    
                    
                  <Button type='submit' variant='primary'>Update</Button>
                </Form>
             
               

            )}</FormContainer>
            
        </>
        
    )
}

export default ProductEditScreen
