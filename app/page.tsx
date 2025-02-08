'use client';

import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { RootState } from '@/lib/store';
import { useEffect } from 'react';
import axios from 'axios';
import { addBulkProducts } from '@/lib/productsSlice';

export default function Home() {
  const { storeName } = useAppSelector((state: RootState) => state.global);
  const { products } = useAppSelector((state: RootState) => state.products);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        'https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/catalogue.json'
      );
      dispatch(addBulkProducts(data));
    })();
  }, []);

  return (
    <>
      <div>{storeName}</div>
      <div>{JSON.stringify(products)}</div>
    </>
  );
}
