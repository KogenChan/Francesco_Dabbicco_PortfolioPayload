'use client'

import { useEffect } from 'react'

async function convertToWebP(file: File): Promise<File> {
   if (!file.type.startsWith('image/')) return file
   if (file.type === 'image/webp') return file
   if (file.type === 'image/svg+xml') return file
   
   return new Promise((resolve, reject) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      
      img.onload = () => {
         const maxDimension = 2500
         let { width, height } = img
         
         if (width > maxDimension || height > maxDimension) {
            if (width > height) {
               height = (height / width) * maxDimension
               width = maxDimension
            } else {
               width = (width / height) * maxDimension
               height = maxDimension
            }
         }
         
         canvas.width = width
         canvas.height = height
         const ctx = canvas.getContext('2d')
         
         if (!ctx) {
            reject(new Error('Could not get canvas context'))
            return
         }
         
         ctx.drawImage(img, 0, 0, width, height)
         
         canvas.toBlob(
            (blob) => {
               if (!blob) {
                  reject(new Error('Conversion failed'))
                  return
               }
               
               const webpFile = new File(
                  [blob],
                  file.name.replace(/\.(jpg|jpeg|png|gif|bmp)$/i, '.webp'),
                  { type: 'image/webp' }
               )
               
               console.log(`✓ Converted: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(webpFile.size / 1024 / 1024).toFixed(2)}MB`)
               
               resolve(webpFile)
            },
            'image/webp',
            0.85
         )
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
   })
}

export const UploadInput = () => {
   useEffect(() => {
      const interceptFileInputs = async (e: Event) => {
         const input = e.target as HTMLInputElement
         
         // Only process file inputs in upload contexts
         if (input.type !== 'file' || !input.files?.length) return
         
         const file = input.files[0]
         
         // Only convert images
         if (!file.type.startsWith('image/')) return
         
         console.log('🔄 Intercepted file upload, converting...')
         
         try {
            const convertedFile = await convertToWebP(file)
            
            // Replace file in input
            const dt = new DataTransfer()
            dt.items.add(convertedFile)
            input.files = dt.files
            
            // Dispatch change event so Payload processes it
            const changeEvent = new Event('change', { bubbles: true })
            input.dispatchEvent(changeEvent)
         } catch (error) {
            console.error('❌ Conversion failed, using original:', error)
         }
      }
      
      // Capture phase to intercept before Payload processes
      document.addEventListener('change', interceptFileInputs, { capture: true })
      
      return () => {
         document.removeEventListener('change', interceptFileInputs, { capture: true })
      }
   }, [])
   
   return null
}