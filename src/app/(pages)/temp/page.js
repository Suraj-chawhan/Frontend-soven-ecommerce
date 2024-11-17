"use client"
import { useState } from 'react';

export default function SizeInputForm() {
  const [sizes, setSizes] = useState('');

  const handleSubmit = async () => {
    console.log(sizes)
  
    try {
      const response = await fetch('/api/temp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sizes: JSON.parse(sizes) }),
      });

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };


  

  return (
    <div>
      <h1>Enter Sizes</h1>
      
        <textarea
          rows="10"
          cols="50"
          placeholder='Enter JSON array like [{"size":"M","enabled":true}]'
          value={sizes}
          onChange={(e) => setSizes(e.target.value)}
        />
        <br />
        <button onClick={handleSubmit}>Submit</button>
     
    </div>
  );
}