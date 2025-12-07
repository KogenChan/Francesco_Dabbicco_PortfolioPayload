'use client'

import { useEffect } from 'react'

async function convertToWebP(file: File): Promise<File> {
   if (!file.type.startsWith('image/')) return file
   if (file.type === 'image/webp') return file
   if (file.type === 'image/svg+xml') return file // Don't convert SVGs
   
   return new Promise((resolve, reject) => {
      const img = new Image()
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      img.onload = () => {
         // Resize if too large (optional - maintains aspect ratio)
         const maxDimension = 8000 // Max width or height
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
               
               console.log(`Converted ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(webpFile.size / 1024 / 1024).toFixed(2)}MB`)
               
               resolve(webpFile)
            },
            'image/webp',
            0.92 // 92% quality - excellent for art, usually <4MB
         )
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
   })
}

export function WebPUploadInjector() {
   useEffect(() => {
      // Intercept all file inputs
      const handleFileInput = async (e: Event) => {
         const input = e.target as HTMLInputElement
         if (!input.files || input.files.length === 0) return
         
         const originalFile = input.files[0]
         
         try {
            const convertedFile = await convertToWebP(originalFile)
            
            // Replace the file in the input
            const dataTransfer = new DataTransfer()
            dataTransfer.items.add(convertedFile)
            input.files = dataTransfer.files
            
            // Trigger change event so Payload processes it
            input.dispatchEvent(new Event('change', { bubbles: true }))
         } catch (error) {
            console.error('WebP conversion failed:', error)
            // If conversion fails, continue with original file
         }
      }
      
      // Listen for file input changes
      document.addEventListener('change', handleFileInput, true)
      
      return () => {
         document.removeEventListener('change', handleFileInput, true)
      }
   }, [])
   
   return null
};