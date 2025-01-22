import Slider from '../components/Slider'

const SinglePage = ({ currentUser }) => {
  const singleItemData = useLoaderData()

  return (
    <main className="single-item-container">
      <Slider images={singleItemData.images} />

      <h1>{singleItemData.title}</h1>
      <div>
        <strong>Price:</strong> ${singleItemData.price}
      </div>
      <div>
        <strong>Category:</strong> {singleItemData.category}
      </div>
      <div>
        <strong>Condition:</strong> {singleItemData.condition}
      </div>
      <div>
        <strong>Description:</strong>
        <p>{singleItemData.description}</p>
      </div>
    </main>
  )
}

export default SinglePage
