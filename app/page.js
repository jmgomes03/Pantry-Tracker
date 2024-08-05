'use client'
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material'
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from 'firebase/firestore'
import Image from 'next/image' // Import Image

export default function Home() {
  // variables
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // fetching function
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    console.log(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box width="100vw" height="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        backgroundImage: 'url(/market.jpg)', 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Fruit basket icon */}
      <Image src="/fruit-basket.png" alt="Fruit Basket" width={100} height={100} />

      {/* title */}
      <Typography variant="h1" color="#c0bbf9" style={{ marginBottom: 70 }}>
        Track Your Inventory
      </Typography>

      <Modal open={open} onClose={handleClose}>
        <Box 
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3} 
          sx={{ transform: 'translate(-50%,-50%)' }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>

      <TextField
        variant="outlined"
        placeholder="Search for items"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '20px', width: '800px' }}
      />

      <Box border="3px solid #333">
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD7E5"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" color="black">
            Inventory Items
          </Typography>
        </Box>
        
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {inventory
            .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map(({ name, quantity }) => (
              <Box 
                key={name} 
                width="100%" 
                minHeight="150px" 
                display="flex"
                alignItems="center" 
                justifyContent="space-between"
                bgcolor="white"
                padding={5}
              >
                <Typography
                  variant="h3"
                  color="black"
                  textAlign="center"
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}  
                </Typography>
                <Typography
                  variant="h3"
                  color="black"
                  textAlign="center"
                >
                  {quantity}
                </Typography>
                <Stack direction="row" spacing={2}>
                  <Button 
                    variant="contained" 
                    onClick={() => {
                      addItem(name)
                    }}  
                  > 
                    Add an Item 
                  </Button>

                  <Button 
                    variant="contained" 
                    onClick={() => {
                      removeItem(name)
                    }}  
                    sx={{ background: 'red', color: 'white' }}
                  > 
                    Remove an Item 
                  </Button>
                </Stack>
              </Box>
            ))
          }
        </Stack>
      </Box>
    </Box>
  )
}
