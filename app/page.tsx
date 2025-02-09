'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import { useEffect } from 'react';
import axios from 'axios';
import {
  addBulkProducts,
  addProductToCart,
  removeProductFromCart
} from '@/lib/productsSlice';
import Image from 'next/image';

export default function Home() {
  const { storeName } = useAppSelector((state: RootState) => state.global);
  const { products } = useAppSelector((state: RootState) => state.products);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        'https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/catalogue.json'
      );
      dispatch(addBulkProducts({ products: data, replace: true }));
    })();
  }, []);

  return (
    <main>
      <header className="flex justify-between px-10 py-5 bg-gray-200">
        <div>{storeName}</div>
        <div className="underline underline-offset-8">Products</div>
      </header>
      <section className="flex justify-between">
        {!products.length ? (
          <h2>Loading...</h2>
        ) : (
          <>
            <div>Filter Section</div>
            <div className="grid grid-cols-3 gap-6">
              {/* card */}
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
            </div>
          </>
        )}
      </section>
    </main>
  );
}
