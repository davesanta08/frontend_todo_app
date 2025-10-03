import { useParams } from "react-router-dom";
import { storeContext } from "../context/storeContext";
import { useContext, useEffect, useState } from "react";
import Spinner from "../layout/Spinner";
import { toast } from "react-toastify";

function Book() {

    const {  isLoading, setIsLoading, fetchBook, singleBook} = useContext(storeContext)


  const params = useParams();
  const bookId = params.bookId;

useEffect(() => {
 fetchBook(bookId) //fetch book from api
 console.log(singleBook);
},[])

  if (isLoading) {
    return <Spinner />;
  }

  if (singleBook !== null) {
    console.log(singleBook);
  }

  return (
    <>
      {singleBook === null ? (
        <h1>Book not found</h1>
      ) : (
        <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-2 lg:gap-x-8">
          <div className="lg:col-start-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
              {singleBook.title}
            </h2>
            <p className="mt-4 text-gray-500"> {singleBook.description}</p>

            <div className="mt-6">
              <p className="text-base text-gray-500">Author: {singleBook.author}</p>
              <p className="text-base text-gray-500">
                Price Requested: ${singleBook.priceRequest}
              </p>
              <p className="text-base text-gray-500">
                Category:{" "}
                {singleBook.category === undefined
                  ? "fetching data..."
                  : singleBook.category.name}
              </p>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-start-2 lg:row-start-1">
            <img
              src="https://picsum.photos/500/300"
              alt="Book cover"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      )}
    </>
  );
}
export default Book;
