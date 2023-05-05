import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

class ProductItemDetails extends Component {
  state = {productData: [], quantity: 1, viewStatus: ''}

  componentDidMount() {
    this.getProductItemData()
  }

  increaseQuantity = () => {
    this.setState(prev => ({quantity: prev.quantity + 1}))
  }

  decreaseQuantity = () => {
    const {quantity} = this.state
    if (quantity >= 2) {
      this.setState(prev => ({quantity: prev.quantity - 1}))
    }
  }

  getProductItemData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({viewStatus: 'loading'})
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = Array(fetchedData).map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
        availability: product.availability,
        description: product.description,
        similarProducts: product.similar_products,
        totalReviews: product.total_reviews,
        style: product.style,
      }))
      this.setState({
        productData: updatedData,
        viewStatus: 'success',
      })
    } else {
      this.setState({viewStatus: 'failure'})
    }
  }

  renderLoading = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailure = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failedImage"
        alt="failure view"
      />
      <h1 className="productNotFound">Product Not Found</h1>
      <Link to="/products">
        <button className="noPRod" type="button">
          Continue Shopping
        </button>
      </Link>
    </>
  )

  renderSuccess = () => {
    const {productData, quantity} = this.state
    const {title} = productData
    console.log(title)
    const image = productData.map(each => each.imageUrl)
    const description = productData.map(each => each.description)
    const rating = productData.map(each => each.rating)
    const availability = productData.map(each => each.availability)
    const similarProducts = productData.map(each => each.similarProducts)
    const totalReviews = productData.map(each => each.totalReviews)
    const brand = productData.map(each => each.brand)
    const price = productData.map(each => each.price)
    return (
      <>
        <div className="productDetailsContainer">
          <img src={image} alt="product" className="productImage" />
          <div className="detailsContainer">
            <h1 className="titleCSS">{title}</h1>
            <p className="priceCSS">Rs {price}/-</p>
            <div className="ratingAndReviews">
              <div className="rating-container2">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p>Availability: {availability}</p>
            <p>Brand: {brand}</p>
            <hr />
            <div className="buttonContainer">
              <button
                onClick={this.decreaseQuantity}
                type="button"
                className="Btns"
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p>{quantity}</p>
              <button
                onClick={this.increaseQuantity}
                type="button"
                className="Btns"
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="addToCart">
              ADD TO CART
            </button>
          </div>
        </div>
        <ul className="similarProductsContainer">
          <SimilarProductItem list={similarProducts} />
        </ul>
      </>
    )
  }

  render() {
    const {viewStatus} = this.state
    switch (viewStatus) {
      case 'success':
        return (
          <>
            <Header />
            {this.renderSuccess()}
          </>
        )
      case 'failure':
        return (
          <>
            <Header />
            {this.renderFailure()}
          </>
        )
      case 'loading':
        return (
          <>
            <Header />
            {this.renderLoading()}
          </>
        )
      default:
        return null
    }
  }
}

export default ProductItemDetails
