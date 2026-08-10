import React from 'react'
import { useAllTours } from '../api/queries/useTraveler';

function TravelerLayout() {
  const {
      data,
      isLoading,
      isError,
    } = useAllTours();
  console.log(data);
  
  return (
    <div>TravelerLayout</div>
  )
}

export default TravelerLayout