'use client'

import { useEffect } from 'react'

export const WebPConverter = () => {
   useEffect(() => {
      console.log('✓ WebP converter loaded')
      
      const convertToWebP = async (file: File): Promise<File> => {
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
                     
                     console.log(`✓ Converted: ${file.name}`)
                     console.log(`  Before: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
                     console.log(`  After: ${(webpFile.size / 1024 / 1024).toFixed(2)}MB`)
                     
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
      
      // Track which inputs we've already processed to avoid double-conversion
      const processedInputs = new WeakSet()
      
      const handleFileSelect = async (e: Event) => {
         const input = e.target as HTMLInputElement
         
         if (input.type !== 'file') return
         if (!input.files || input.files.length === 0) return
         if (processedInputs.has(input)) return
         
         const file = input.files[0]
         
         if (!file.type.startsWith('image/')) return
         
         console.log('🔄 Converting image...')
         
         // Mark as processing to prevent loops
         processedInputs.add(input)
         
         try {
            const convertedFile = await convertToWebP(file)
            
            // Create new FileList with converted file
            const dt = new DataTransfer()
            dt.items.add(convertedFile)
            input.files = dt.files
            
            // Trigger Payload's file processing
            const event = new Event('change', { bubbles: true })
            Object.defineProperty(event, 'target', { value: input, enumerable: true })
            input.dispatchEvent(event)
            
         } catch (error) {
            console.error('❌ Conversion failed:', error)
            // Remove from processed set so user can retry
            processedInputs.delete(input)
         }
      }
      
      // Listen to all file inputs
      document.addEventListener('change', handleFileSelect, true)
      
      return () => {
         document.removeEventListener('change', handleFileSelect, true)
      }
   }, [])
   
   return <div style={{ display: 'none' }} data-webp-converter="active" />
}