import React, { useState } from 'react'
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from 'react-icons/ai'

import { Product } from '../../components'
import { useStateContext } from '../../context/StateContext'

import { client, urlFor } from '../../lib/client'

export default function ProductDetails({ products, product }) {
  const { image, name, details, price} = product
  const [index, setIndex] = useState(0)
  const { decQty,incQty, qty, onAdd } = useStateContext()

  return (
    <div>
      <div className="product-detail-container">
        <div>
            <div className="image-container">
                <img src={urlFor(image && image[index])} />
            </div>
            <div className="small-images-container">
                {image?.map((elem,i) => {
                    console.log(elem)
                    return (
                        <img 
                            src={urlFor(elem)} 
                            className={"small-image"}
                            onMouseEnter={() => setIndex(i)}
                        />
                    )
                })}
            </div>
        </div>
        <div className="product-details-desc">
            <h1>{name}</h1>
            <div className="reviews">
                <div>
                    <AiFillStar />
                    <AiFillStar />
                    <AiFillStar />
                    <AiFillStar />
                    <AiOutlineStar />
                </div>
                <p className="">
                    (20)
                </p>
            </div>
            <h4>Details: </h4>
            <p>{details}</p>
            <p className="price">${price}</p>
            <div className="quantity">
                <h3>Quantity:</h3>
                <p className="quantity-desc">
                    <span className="minus" onClick={decQty}>
                        <AiOutlineMinus />
                    </span>
                    <span className="num" onClick="">
                        {qty}
                    </span>
                    <span className="plus" onClick={incQty}>
                        <AiOutlinePlus />
                    </span>
                </p>
            </div>
            <div className="buttons">
                <button className="add-to-cart" onClick={() => onAdd(product, qty)}>Add to Cart</button>
                <button className="buy-now" onClick="">Buy Now</button>

            </div>
        </div>
      </div>
      <div className="maylike-products-wrapper">
            <h2>You may also like</h2>
            <div className="marquee">
                <div className="maylike-products-container track">
                    {products.map(elem => {
                        return (
                            <Product
                                key={elem._id}
                                product={elem}
                            />
                        )
                    })}
                </div>
            </div>
      </div>
    </div>
  )
}

export const getStaticPaths = async () => {
    const query = `*[_type == "product"] {
      slug {
        current
      }
    }
    `;
  
    const products = await client.fetch(query);
  
    const paths = products.map((product) => ({
      params: { 
        slug: product.slug.current
      }
    }));
  
    return {
      paths,
      fallback: 'blocking'
    }
  }
  
  export const getStaticProps = async ({ params: { slug }}) => {
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
    const productsQuery = '*[_type == "product"]'
    
    const product = await client.fetch(query);
    const products = await client.fetch(productsQuery);
  
    console.log(product);
  
    return {
      props: { products, product }
    }
  }
