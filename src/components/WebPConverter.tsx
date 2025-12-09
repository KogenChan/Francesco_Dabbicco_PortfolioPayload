'use client'

import { useEffect } from 'react'

export const WebPConverter = () => {
   useEffect(() => {
      console.log('✓ WebP converter loaded')
      
      const convertToWebP = async (file: File): Promise<File> => {
         // Skip non-images, WebP, and SVG
         if (!file.type.startsWith('image/')) return file
         if (file.type === 'image/webp') return file
         if (file.type === 'image/svg+xml') return file
         
         return new Promise((resolve, reject) => {
            const img = new Image()
            const canvas = document.createElement('canvas')
            
            img.onload = () => {
               // Aggressive resizing to stay under 4.5MB
               const maxDimension = 2000 // Reduced from 2500
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
                  0.80 // Reduced quality to 80% for smaller files
               )
            }
            
            img.onerror = () => reject(new Error('Failed to load image'))
            img.src = URL.createObjectURL(file)
         })
      }
      
      // Track converted files to avoid infinite loops
      const convertedFiles = new WeakMap<HTMLInputElement, string>()
      
      const handleFileSelect = async (e: Event) => {
         const input = e.target as HTMLInputElement
         
         if (input.type !== 'file') return
         if (!input.files || input.files.length === 0) return
         
         const file = input.files[0]
         
         // Skip if already converted this file
         if (convertedFiles.get(input) === file.name) {
            return
         }
         
         // Skip non-images or already WebP
         if (!file.type.startsWith('image/')) return
         if (file.type === 'image/webp') return
         if (file.type === 'image/svg+xml') return
         
         console.log('🔄 Converting image...')
         
         // Stop the original event
         e.stopImmediatePropagation()
         e.preventDefault()
         
         try {
            const convertedFile = await convertToWebP(file)
            
            // Check if converted file is still too large
            const sizeMB = convertedFile.size / 1024 / 1024
            if (sizeMB > 4) {
               console.warn(`⚠️  File still ${sizeMB.toFixed(2)}MB after conversion. May fail on upload.`)
            }
            
            // Update input with converted file
            const dt = new DataTransfer()
            dt.items.add(convertedFile)
            input.files = dt.files
            
            // Mark as converted
            convertedFiles.set(input, convertedFile.name)
            
            // Dispatch new event
            const newEvent = new Event('change', { bubbles: true })
            input.dispatchEvent(newEvent)
            
         } catch (error) {
            console.error('❌ Conversion failed:', error)
            // Allow original file through on error
            convertedFiles.set(input, file.name)
         }
      }
      
      // Listen to file inputs in capture phase
      document.addEventListener('change', handleFileSelect, { capture: true })
      
      return () => {
         document.removeEventListener('change', handleFileSelect, { capture: true })
      }
   }, [])
   
   return (
      <div style={{ 
         position: 'fixed', 
         bottom: '10px', 
         right: '10px', 
         background: '#10b981', 
         color: 'white', 
         padding: '4px 8px',
         borderRadius: '4px',
         fontSize: '11px',
         zIndex: 9999,
         fontFamily: 'monospace'
      }}>
         WebP ✓
      </div>
   )
};