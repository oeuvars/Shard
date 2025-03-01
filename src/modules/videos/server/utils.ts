import { s3Client } from '@/config/s3-init';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { TRPCError } from '@trpc/server';

export const videoUtils = {
   generateUploadUrl: async (fileName: string, contentType: string): Promise<string> => {
     try {
       const command = new PutObjectCommand({
         Bucket: process.env.AWS_S3_BUCKET_NAME!,
         Key: fileName,
         ContentType: contentType,
       });

       return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
     } catch (error) {
       console.error('Error creating signed URL:', error);
       throw new TRPCError({
         code: 'INTERNAL_SERVER_ERROR',
         message: 'An error occurred while preparing the upload',
       });
     }
   },

   deleteVideo: async (fileName: string): Promise<void> => {
     try {
       const command = new DeleteObjectCommand({
         Bucket: process.env.AWS_S3_BUCKET_NAME!,
         Key: fileName,
       });

       await s3Client.send(command);
     } catch (error) {
       console.error('Error deleting video from S3:', error);
       throw new TRPCError({
         code: 'INTERNAL_SERVER_ERROR',
         message: 'An error occurred while deleting the video from storage',
       });
     }
   },

   getVideoUrl: (fileName: string): string => {
     return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
   }
 };
