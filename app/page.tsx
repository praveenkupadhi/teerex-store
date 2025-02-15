'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import { FormEvent, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  addBulkProducts,
  addProductToCart,
  removeProductFromCart,
  searchProducts
} from '@/lib/productsSlice';
import Image from 'next/image';

export default function Home() {
  const { storeName } = useAppSelector((state: RootState) => state.global);
  const { products, loading } = useAppSelector(
    (state: RootState) => state.products
  );
  const dispatch = useAppDispatch();
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          'https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/catalogue.json'
        );
        dispatch(addBulkProducts({ products: [...data], replace: true }));
      } catch (error) {
        console.error(`Error while fetching products: ${error}`);
        dispatch(addBulkProducts({ products: [], replace: true }));
      }
    })();
  }, [dispatch]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <main>
      <header className="flex justify-between px-10 py-5 bg-gray-200">
        <div>{storeName}</div>
        <div className="underline underline-offset-8">Products</div>
      </header>
      <section className="flex justify-between">
        <div>Filter Section</div>
        <div>
          <form
            onSubmit={(event: FormEvent) => {
              event.preventDefault();
              dispatch(searchProducts(searchInput.current?.value));
            }}
          >
            <input
              ref={searchInput}
              type="search"
              placeholder="Search for products..."
              onChange={() => {
                if (!searchInput.current?.value) {
                  dispatch(searchProducts(searchInput.current?.value));
                }
              }}
            />
            <button type="submit">Search</button>
          </form>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {!products.length ? (
            <h2>No Products Found.</h2>
          ) : (
            <>
              {products.map((product) => {
                return (
                  <div key={product.id}>
                    <div>
                      <Image
                        src={product.imageURL}
                        alt={product.name}
                        width={100}
                        height={100}
                        priority={true}
                        className="w-auto h-auto"
                      />
                    </div>
                    <div>
                      <p>{`${product.currency} ${product.price}`}</p>
                      {product.cartQuantity === 0 && (
                        <button
                          onClick={() => dispatch(addProductToCart(product.id))}
                        >
                          Add to cart
                        </button>
                      )}
                      {product.cartQuantity > 0 && (
                        <div className="flex justify-between">
                          <button
                            onClick={() =>
                              dispatch(removeProductFromCart(product.id))
                            }
                          >
                            -
                          </button>
                          <p>{product.cartQuantity}</p>
                          <button
                            onClick={() =>
                              dispatch(addProductToCart(product.id))
                            }
                            disabled={product.quantity === product.cartQuantity}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
